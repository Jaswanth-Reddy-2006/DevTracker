import { db } from '../config/firebase.js'

// Worker config
const DAILY_ACTIVE_SECONDS_THRESHOLD = 10 * 60 // 10 minutes
const DECAY = 0.95

function difficultyScore(level){
  switch((level||'').toLowerCase()){
    case 'easy': return 1
    case 'medium': return 2
    case 'hard': return 4
    default: return 1
  }
}

function dateKeyFromTimestamp(ts, tz){
  const d = new Date(ts)
  // Use ISO date (UTC) as key
  return d.toISOString().slice(0,10)
}

async function processOneEvent(doc){
  const e = doc.data()
  const id = doc.id
  try{
    if (e.processed) return
    if (e.type === 'task.completed'){
      const userId = e.userId
      const payload = e.payload || {}
      const ts = e.timestamp || Date.now()
      const dateKey = dateKeyFromTimestamp(ts)
      const skills = payload.skills || [] // [{skillId, weight}]
      const difficulty = payload.difficulty || 'medium'
      const durationMinutes = payload.durationMinutes || 0
      const baseScore = difficultyScore(difficulty)

      for(const s of skills){
        const skillId = s.skillId || s.id || s
        const weight = typeof s.weight === 'number' ? s.weight : 1
        const points = baseScore * weight

        // Update daily_aggregates doc per user+skill+date
        const aggId = `${userId}_${skillId}_${dateKey}`
        const aggRef = db.collection('daily_aggregates').doc(aggId)
        await db.runTransaction(async (tx)=>{
          const snap = await tx.get(aggRef)
          if (!snap.exists){
            tx.set(aggRef, { userId, skillId, date: dateKey, task_points: points, time_seconds: durationMinutes*60, tasks_completed: 1, active: true, updatedAt: Date.now() })
          } else {
            const data = snap.data()
            tx.update(aggRef, { task_points: (data.task_points || 0) + points, time_seconds: (data.time_seconds || 0) + durationMinutes*60, tasks_completed: (data.tasks_completed || 0)+1, active: true, updatedAt: Date.now() })
          }
        })

        // Update decayed mastery running-sum per user+skill
        const masteryId = `${userId}_${skillId}`
        const masteryRef = db.collection('skill_mastery').doc(masteryId)
        await db.runTransaction(async (tx)=>{
          const snap = await tx.get(masteryRef)
          if (!snap.exists){
            tx.set(masteryRef, { userId, skillId, decayed_sum: points, mastery: Math.min(100, points*10), lastActive: dateKey, updatedAt: Date.now() })
          } else {
            const data = snap.data()
            const newSum = (data.decayed_sum || 0)*DECAY + points
            const mastery = Math.min(100, Math.round(newSum * 10))
            tx.update(masteryRef, { decayed_sum: newSum, mastery, lastActive: dateKey, updatedAt: Date.now() })
          }
        })
      
      // After updating mastery, check for week-over-week drop for each skill
      try{
        await checkWeeklyDrop(e.userId, skills)
      } catch(err){
        console.error('Error checking weekly drop', err)
      }
      }

      // Update per-user daily summary (no skill)
      const userDayId = `${e.userId}_summary_${dateKey}`
      const userDayRef = db.collection('daily_user').doc(userDayId)
      await db.runTransaction(async (tx)=>{
        const snap = await tx.get(userDayRef)
        if (!snap.exists){
          tx.set(userDayRef, { userId: e.userId, date: dateKey, tasks_completed: 1, time_seconds: durationMinutes*60, active: true, updatedAt: Date.now() })
        } else {
          const data = snap.data()
          tx.update(userDayRef, { tasks_completed: (data.tasks_completed||0)+1, time_seconds: (data.time_seconds||0)+durationMinutes*60, active: true, updatedAt: Date.now() })
        }
      })

      // Update streaks: simple approach - check previous day active
      const streakRef = db.collection('streaks').doc(e.userId)
      await db.runTransaction(async (tx)=>{
        const snap = await tx.get(streakRef)
        const today = dateKey
        if (!snap.exists){
          tx.set(streakRef, { userId: e.userId, current_streak: 1, longest_streak: 1, last_active_date: today, updatedAt: Date.now() })
        } else {
          const data = snap.data()
          const last = data.last_active_date
          const lastDate = new Date(last)
          const todayDate = new Date(today)
          const oneDayMs = 24*60*60*1000
          if (new Date(todayDate - oneDayMs).toISOString().slice(0,10) === last){
            const cur = (data.current_streak || 0) + 1
            const longest = Math.max(data.longest_streak || 0, cur)
            tx.update(streakRef, { current_streak: cur, longest_streak: longest, last_active_date: today, updatedAt: Date.now() })
          } else if (last === today){
            // already active today
            tx.update(streakRef, { updatedAt: Date.now() })
          } else {
            tx.update(streakRef, { current_streak: 1, last_active_date: today, updatedAt: Date.now() })
          }
        }
      })
    }

    // Mark event processed
    await db.collection('events').doc(id).update({ processed: true, processedAt: Date.now() })
  } catch(err){
    console.error('Error processing event', id, err)
  }
}

// Weekly drop detection: compare last 7 days vs previous 7 days for each skill
async function checkWeeklyDrop(userId, skills){
  const now = Date.now()
  const dayMs = 24*60*60*1000
  // build date keys for last 14 days
  const keys = []
  for(let i=0;i<14;i++){
    const d = new Date(now - i*dayMs).toISOString().slice(0,10)
    keys.push(d)
  }

  for(const s of skills){
    const skillId = s.skillId || s.id || s
    // fetch last 14 daily_aggregates for user+skill
    const aggRef = db.collection('daily_aggregates')
    const q = aggRef.where('userId','==',userId).where('skillId','==',skillId).where('date','in', keys.slice(0,14))
    const snap = await q.get()
    if (snap.empty) continue
    const map = {}
    snap.forEach(doc=>{ const d = doc.data(); map[d.date] = (d.task_points||0) })
    // sum last 7 and previous 7
    let last7 = 0, prev7 = 0
    for(let i=0;i<7;i++){ last7 += (map[keys[i]]||0) }
    for(let i=7;i<14;i++){ prev7 += (map[keys[i]]||0) }
    if (prev7 <= 0) continue
    const drop = (last7 - prev7)/prev7
    if (drop <= -0.10){
      // create insight
      const insightRef = db.collection('insights').doc()
      await insightRef.set({ userId, skillId, key: 'skill_drop', severity: Math.abs(drop) > 0.25 ? 'critical' : 'warn', message: `${skillId} dropped ${Math.round(drop*100)}% week-over-week`, data: { prev7, last7, drop }, generatedAt: Date.now() })
    }
  }
}

async function processBatch(){
  console.log('Worker: scanning for unprocessed events...')
  const q = db.collection('events').where('processed','==',false).orderBy('timestamp').limit(100)
  const snap = await q.get()
  if (snap.empty){
    console.log('No events to process.')
    return
  }
  const promises = []
  snap.forEach(doc=>{
    promises.push(processOneEvent(doc))
  })
  await Promise.all(promises)
  console.log('Batch processed.')
}

async function runDailyNeglectedCheck(){
  console.log('Daily neglected skills check...')
  const thresholdDays = 7
  const cutoff = new Date(Date.now() - thresholdDays*24*60*60*1000).toISOString().slice(0,10)
  const masteryRef = db.collection('skill_mastery')
  const snap = await masteryRef.where('lastActive','<',cutoff).get()
  if (snap.empty){
    console.log('No neglected skills found.')
    return
  }
  const batch = db.batch()
  snap.forEach(doc=>{
    const data = doc.data()
    const insightRef = db.collection('insights').doc()
    batch.set(insightRef, { userId: data.userId, skillId: data.skillId, key: 'neglected_skill', severity: 'warn', message: `${data.skillId} inactive for >= ${thresholdDays} days`, data: { lastActive: data.lastActive }, generatedAt: Date.now() })
  })
  await batch.commit()
  console.log('Neglected insights generated:', snap.size)
}

async function main(){
  try{
    await processBatch()
    await runDailyNeglectedCheck()
  } catch(err){
    console.error('Worker error', err)
  }
}

if (require.main === module){
  main().then(()=>{
    console.log('Worker finished')
    process.exit(0)
  })
}
