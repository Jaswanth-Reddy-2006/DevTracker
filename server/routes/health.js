import express from 'express'
import { db } from '../config/firebase.js'
import { redisClient, usingRedis } from '../lib/redisClient.js'

const router = express.Router()

router.get('/', async (req, res) => {
  const result = { ok: true, firestore: false, redis: 'disabled' }
  try {
    // Firestore: list collections to verify connectivity
    await db.listCollections()
    result.firestore = true
  } catch (err) {
    result.ok = false
    result.firestore = false
    result.error = result.error || {}
    result.error.firestore = err.message
  }

  if (usingRedis && redisClient) {
    try {
      const pong = await redisClient.ping()
      result.redis = pong === 'PONG'
    } catch (err) {
      result.ok = false
      result.redis = false
      result.error = result.error || {}
      result.error.redis = err.message
    }
  }

  res.status(result.ok ? 200 : 503).json(result)
})

export default router
