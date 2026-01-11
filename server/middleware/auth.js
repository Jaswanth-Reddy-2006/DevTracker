import { auth, db } from '../config/firebase.js';
import { incAuthSuccess, incAuthFailure, incAuthRevoked } from '../lib/metrics.js'

// Throttle logging to avoid spam. Keyed by client IP or UID.
const LOG_THROTTLE_MS = parseInt(process.env.TOKEN_LOG_THROTTLE_MS || '60000', 10);
const _logThrottle = new Map();
function _shouldLog(key) {
    const now = Date.now();
    const last = _logThrottle.get(key) || 0;
    if (now - last > LOG_THROTTLE_MS) {
        _logThrottle.set(key, now);
        return true;
    }
    return false;
}

export const verifyToken = async (req, res, next) => {
    // Development shortcut: allow bypassing Firebase auth when explicitly enabled.
    if (process.env.DISABLE_AUTH === 'true') {
        req.user = { uid: 'local-dev' };
        if (_shouldLog('dev-bypass')) console.info('[auth] DISABLE_AUTH enabled — bypassing token verification');
        return next();
    }
    const authHeader = req.headers.authorization;
    const clientIp = req.headers['x-forwarded-for'] || req.ip || 'unknown'

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        if (_shouldLog(`no-token|${clientIp}`)) {
            console.warn(`[auth] Missing token from ${clientIp}`);
            if (process.env.ENABLE_AUTH_AUDIT_LOG === 'true') {
                const log = { type: 'token_verification', status: 'missing_token', uid: null, ip: clientIp, ts: new Date().toISOString() }
                db.collection('auth_audit').add(log).catch(e => console.warn('auth audit write failed', e))
            }
        }
        return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }

    const idToken = authHeader.split('Bearer ')[1];
    const start = Date.now();

    try {
        // Verify the ID token and check for revocation to ensure token is not revoked.
        const decodedToken = await auth.verifyIdToken(idToken, true);
        req.user = decodedToken;
        const elapsed = Date.now() - start;
        const logKey = decodedToken.uid || clientIp;
        if (_shouldLog(`success|${logKey}`)) {
            console.info(`[auth] token verified uid=${decodedToken.uid} ip=${clientIp} time=${elapsed}ms`);
            if (process.env.ENABLE_AUTH_AUDIT_LOG === 'true') {
                const log = { type: 'token_verification', status: 'success', uid: decodedToken.uid, ip: clientIp, timeMs: elapsed, ts: new Date().toISOString() }
                db.collection('auth_audit').add(log).catch(e => console.warn('auth audit write failed', e))
            }
        }
        try { incAuthSuccess() } catch(e){/* noop */}
        return next();
    } catch (error) {
        const elapsed = Date.now() - start;
        const errCode = error.code || (error.message || '').slice(0, 80);
        const logKey = clientIp;
        if (_shouldLog(`fail|${logKey}`)) {
            console.warn(`[auth] token verification failed ip=${clientIp} err=${errCode} time=${elapsed}ms`);
            if (process.env.ENABLE_AUTH_AUDIT_LOG === 'true') {
                const log = { type: 'token_verification', status: 'failure', uid: null, ip: clientIp, err: errCode, timeMs: elapsed, ts: new Date().toISOString() }
                db.collection('auth_audit').add(log).catch(e => console.warn('auth audit write failed', e))
            }
        }
        try { incAuthFailure() } catch(e){/* noop */}

        // If token is revoked or invalid, return 401 with a clear message.
        if (error.code === 'auth/id-token-revoked' || error.message?.includes('revoked')) {
            try { incAuthRevoked() } catch(e){/* noop */}
            return res.status(401).json({ error: 'Unauthorized: Token revoked' });
        }

        return res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }
};
