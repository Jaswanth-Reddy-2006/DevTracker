import express from 'express'
import { db } from '../config/firebase.js'
import { verifyToken } from '../middleware/auth.js'
import { rateLimit } from '../middleware/rateLimit.js'

const router = express.Router()

// POST /api/events
// Expects: { eventId, type, userId(optional), timestamp, payload }
router.post('/', verifyToken, rateLimit, async (req, res) => {
  const body = req.body
  const userId = req.user.uid
  const eventId = body.eventId
  if (!body.type) return res.status(400).json({ error: 'Missing event type' })

  try {
    if (!eventId) {
      // assign id server-side if not provided
      const docRef = await db.collection('events').add({ ...body, userId, createdAt: new Date().toISOString(), processed: false })
      return res.status(201).json({ id: docRef.id })
    }

    // Idempotency: if event with same eventId exists, return it
    const existing = await db.collection('events').where('eventId', '==', eventId).limit(1).get()
    if (!existing.empty) {
      return res.status(200).json({ message: 'Event already ingested', id: existing.docs[0].id })
    }

    const eventDoc = {
      eventId,
      type: body.type,
      payload: body.payload || {},
      userId,
      timestamp: body.timestamp || Date.now(),
      createdAt: new Date().toISOString(),
      processed: false
    }

    const ref = await db.collection('events').add(eventDoc)
    res.status(201).json({ id: ref.id })
  } catch (error) {
    console.error('Error ingesting event', error)
    res.status(500).json({ error: 'Failed to ingest event' })
  }
})

// GET /api/events?limit=20
router.get('/', verifyToken, rateLimit, async (req, res) => {
  try {
    const userId = req.user.uid
    const limit = parseInt(req.query.limit || '50', 10)
    const snapshot = await db.collection('events').where('userId', '==', userId).orderBy('timestamp', 'desc').limit(limit).get()
    const events = snapshot.docs.map(d => ({ id: d.id, ...d.data() }))
    res.json(events)
  } catch (error) {
    console.error('Error fetching events', error)
    res.status(500).json({ error: 'Failed to fetch events' })
  }
})

export default router
