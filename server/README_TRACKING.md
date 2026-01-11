# DevTracker Server — Worker & Event Ingestion

This README explains the minimal event ingestion and worker skeleton implemented.

Endpoints added:
- `POST /api/events` — ingest event (idempotent if `eventId` provided). Requires auth.
- `GET  /api/events` — list recent events.

Worker:
- `server/worker/processEvents.js` — simple Node script that:
  - scans `events` collection for `processed:false` events
  - processes `task.completed` events to update `daily_aggregates`, `skill_mastery`, `daily_user`, and `streaks`
  - marks events as processed
  - runs a daily neglected skills check to insert `insights` for skills inactive >= 7 days

How to run (from `server` folder):

```bash
# start server
npm run dev

# run worker once
npm run worker
```

Notes:
- This is a minimal skeleton using Firestore (existing project uses Firebase). For production, replace polls with a proper queue (Pub/Sub, Kafka) and scale processors horizontally.
- The mastery update uses an exponential decay running sum for O(1) updates.
- Idempotency is handled by checking `eventId` on ingest.

