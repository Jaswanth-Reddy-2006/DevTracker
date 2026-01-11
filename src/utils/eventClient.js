// Lightweight client event emitter for DevTracker frontend
// Usage: import { emitEvent } from '../utils/eventClient'

import { auth } from '../firebase'

function makeId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2,9)}`
}

async function postWithRetry(url, body, headers = {}, retries = 2, backoff = 300) {
  try {
    if (typeof window !== 'undefined') console.debug('[eventClient] POST', url, body)
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...headers },
      body: JSON.stringify(body),
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const json = await res.json()
    if (typeof window !== 'undefined') console.debug('[eventClient] response', json)
    return json
  } catch (err) {
    if (retries <= 0) throw err
    await new Promise(r => setTimeout(r, backoff))
    return postWithRetry(url, body, headers, retries - 1, backoff * 1.8)
  }
}

async function getAuthHeader() {
  try {
    if (!auth || !auth.currentUser) return {}
    const token = await auth.currentUser.getIdToken()
    return { Authorization: `Bearer ${token}` }
  } catch (err) {
    console.warn('eventClient: failed to get auth token', err)
    return {}
  }
}

export async function emitEvent(type, payload = {}, opts = {}) {
  const event = {
    eventId: opts.eventId || makeId(),
    type,
    timestamp: opts.timestamp || Date.now(),
    payload,
  }

  // Fire-and-forget: try posting but don't block UI on failure
  try {
    const base = opts.baseUrl || ''
    const authHeader = await getAuthHeader()
    const headers = { ...authHeader }
    await postWithRetry(`${base}/api/events`, event, headers, opts.retries ?? 2)
  } catch (err) {
    // swallow - optionally integrate with client-side logging/telemetry
    console.warn('emitEvent failed', err)
  }
}

export default { emitEvent }
