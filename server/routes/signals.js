import express from 'express';
import { db } from '../config/firebase.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Tracking state (can also be moved to DB per user later)
let isTrackingEnabled = true;

// Signal Ingestion Endpoint
router.post('/', verifyToken, async (req, res) => {
    if (!isTrackingEnabled) {
        return res.status(200).json({ message: 'Tracking is disabled, signal ignored.' });
    }

    const signal = req.body;
    const userId = req.user.uid;

    // Validation
    const requiredFields = ['source', 'appOrDomain', 'category', 'startTime', 'endTime', 'durationInSeconds'];
    for (const field of requiredFields) {
        if (signal[field] === undefined) {
            return res.status(400).json({ error: `Missing required field: ${field}` });
        }
    }

    try {
        const signalData = {
            ...signal,
            userId,
            createdAt: new Date().toISOString(),
            timestamp: Date.now()
        };

        // Dev fallback: store in-memory when Firebase not available
        if (process.env.DISABLE_AUTH === 'true') {
            // store per-user in-memory
            if (!global.__DEV_SIGNALS__) global.__DEV_SIGNALS__ = new Map();
            const m = global.__DEV_SIGNALS__
            if (!m.has(userId)) m.set(userId, [])
            const arr = m.get(userId)
            const id = Date.now().toString()
            const entry = { id, ...signalData }
            arr.unshift(entry)
            return res.status(201).json({ message: 'Signal processed (dev)', id, signal: entry })
        }

        const docRef = await db.collection('signals').add(signalData);
        res.status(201).json({ message: 'Signal processed', id: docRef.id, signal: signalData });
    } catch (error) {
        console.error('Error saving signal:', error);
        res.status(500).json({ error: 'Failed to process signal' });
    }
});

// GET /api/signals
router.get('/', verifyToken, async (req, res) => {
    try {
        const userId = req.user.uid;
        if (process.env.DISABLE_AUTH === 'true') {
            const m = global.__DEV_SIGNALS__ || new Map()
            const arr = m.get(userId) || []
            return res.json(arr.slice(0,100))
        }
        const signalsSnapshot = await db.collection('signals')
            .where('userId', '==', userId)
            .orderBy('timestamp', 'desc')
            .limit(100)
            .get();
        
        const signals = signalsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.json(signals);
    } catch (error) {
        console.error('Error fetching signals:', error);
        res.status(500).json({ error: 'Failed to fetch signals' });
    }
});

// Focus Analytics
router.get('/focus-stats', verifyToken, async (req, res) => {
    try {
        const userId = req.user.uid;
        const oneHourAgo = Date.now() - 60 * 60 * 1000;
        
        const signalsSnapshot = await db.collection('signals')
            .where('userId', '==', userId)
            .where('timestamp', '>', oneHourAgo)
            .get();
        
        const recentSignals = signalsSnapshot.docs.map(doc => doc.data());
        
        let educationalTime = 0;
        let distractionTime = 0;

        recentSignals.forEach(s => {
            if (s.category === 'Educational' || s.category === 'Coding') {
                educationalTime += s.durationInSeconds;
            } else if (s.category === 'Distraction') {
                distractionTime += s.durationInSeconds;
            }
        });

        const totalTime = educationalTime + distractionTime;
        const focusRatio = totalTime > 0 ? (educationalTime / totalTime) : 0;

        res.json({
            focusRatio: parseFloat(focusRatio.toFixed(2)),
            educationalTime,
            distractionTime
        });
    } catch (error) {
        console.error('Error fetching focus stats:', error);
        res.status(500).json({ error: 'Failed to fetch focus stats' });
    }
});

// Tracking Toggle Endpoint
router.post('/toggle-tracking', verifyToken, (req, res) => {
    const { enabled } = req.body;
    if (typeof enabled !== 'boolean') {
        return res.status(400).json({ error: 'Field "enabled" must be a boolean' });
    }
    isTrackingEnabled = enabled;
    res.json({ message: `Tracking ${isTrackingEnabled ? 'enabled' : 'disabled'}`, isTrackingEnabled });
});

router.get('/tracking-status', verifyToken, (req, res) => {
    res.json({ isTrackingEnabled });
});

export default router;
