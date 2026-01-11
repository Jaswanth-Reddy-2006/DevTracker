// Rate limiter for /api/events
// Supports Redis-backed fixed-window counters when REDIS_URL is configured.
// Fallback: in-memory fixed-window counter (single instance only).

const LIMIT_PER_MIN = parseInt(process.env.EVENTS_RATE_LIMIT_PER_MIN || '120', 10)

function keyForReq(req) {
  const uid = req.user?.uid
  const ip = req.headers['x-forwarded-for'] || req.ip || 'unknown'
  return uid ? `u:${uid}` : `ip:${ip}`
}

// In-memory simple fixed-window
const INMEM_BUCKETS = new Map()
function inmemRateLimit(req, res, next) {
  const key = keyForReq(req)
  const now = Date.now()
  const windowKey = Math.floor(now / 60000) // minute bucket
  const mapKey = `${key}:${windowKey}`
  const cur = INMEM_BUCKETS.get(mapKey) || { count: 0, ts: now }
  cur.count += 1
  INMEM_BUCKETS.set(mapKey, cur)
  // Cleanup-ish: remove old keys occasionally
  if (INMEM_BUCKETS.size > 5000) {
    const cutoff = now - 5 * 60000
    for (const [k, v] of INMEM_BUCKETS.entries()) {
      if (v.ts < cutoff) INMEM_BUCKETS.delete(k)
    }
  }
  if (cur.count > LIMIT_PER_MIN) {
    res.set('Retry-After', '60')
    return res.status(429).json({ error: 'Rate limit exceeded. Try again later.' })
  }
  return next()
}

import { redisClient, usingRedis } from '../lib/redisClient.js'

export async function rateLimit(req, res, next) {
  if (!usingRedis || !redisClient) return inmemRateLimit(req, res, next)

  const key = keyForReq(req)
  // use fixed window key per minute
  const minute = Math.floor(Date.now() / 60000)
  const redisKey = `rl:${key}:${minute}`

  try {
    const cur = await redisClient.incr(redisKey)
    if (cur === 1) {
      // set TTL ~70s to cover the minute
      await redisClient.expire(redisKey, 70)
    }
    if (cur > LIMIT_PER_MIN) {
      try { const { incRateLimitDenied } = await import('../lib/metrics.js'); incRateLimitDenied() } catch(e){}
      res.set('Retry-After', '60')
      return res.status(429).json({ error: 'Rate limit exceeded. Try again later.' })
    }
    return next()
  } catch (err) {
    console.warn('rateLimit: redis error, falling back to in-memory', err)
    return inmemRateLimit(req, res, next)
  }
}

export default rateLimit
