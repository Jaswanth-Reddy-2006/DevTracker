// Local simulation of event processing logic (no Firestore required)
// Run with: node server/test/simulateLocalRun.js

import fs from 'fs'

const DECAY = 0.95
function difficultyScore(level){
  switch((level||'').toLowerCase()){
    case 'easy': return 1
    case 'medium': return 2
    case 'hard': return 4
    default: return 1
  }
}

function dateKeyFromTimestamp(ts){
  const d = new Date(ts)
  return d.toISOString().slice(0,10)
}

// In-memory stores
const dailyAggs = new Map() // key: user_skill_date -> {task_points, time_seconds, tasks_completed}
const mastery = new Map() // key: user_skill -> {decayed_sum, mastery, lastActive}
const userDaily = new Map() // key: user_date -> {tasks_completed, time_seconds}
const streaks = new Map()
const insights = []

function upsertDailyAgg(userId, skillId, dateKey, points, durationSeconds){
  const key = `${userId}_${skillId}_${dateKey}`
  const cur = dailyAggs.get(key) || {task_points:0, time_seconds:0, tasks_completed:0}
  cur.task_points += points
  cur.time_seconds += durationSeconds
  cur.tasks_completed += 1
  dailyAggs.set(key, cur)
}

function upsertUserDaily(userId, dateKey, durationSeconds){
  const key = `${userId}_summary_${dateKey}`
  const cur = userDaily.get(key) || {tasks_completed:0, time_seconds:0}
  cur.tasks_completed +=1
  cur.time_seconds += durationSeconds
  userDaily.set(key, cur)
}

function updateMastery(userId, skillId, points, dateKey){
  const key = `${userId}_${skillId}`
  const cur = mastery.get(key) || {decayed_sum:0, mastery:0, lastActive:null}
  const newSum = cur.decayed_sum*DECAY + points
  const newMastery = Math.min(100, Math.round(newSum*10))
  mastery.set(key, {decayed_sum:newSum, mastery:newMastery, lastActive:dateKey})
}

function updateStreak(userId, dateKey){
  const cur = streaks.get(userId) || {current_streak:0, longest_streak:0, last_active_date:null}
  const last = cur.last_active_date
  const oneDayMs = 24*60*60*1000
  if (!last){
    cur.current_streak = 1
    cur.longest_streak = 1
    cur.last_active_date = dateKey
  } else {
    const lastDate = new Date(last)
    const todayDate = new Date(dateKey)
    if (new Date(todayDate - oneDayMs).toISOString().slice(0,10) === last){
      cur.current_streak += 1
      cur.longest_streak = Math.max(cur.longest_streak, cur.current_streak)
      cur.last_active_date = dateKey
    } else if (last === dateKey){
      // already active
    } else {
      cur.current_streak = 1
      cur.last_active_date = dateKey
    }
  }
  streaks.set(userId, cur)
}

function checkWeeklyDropLocal(userId, skillId){
  // collect last 14 days from today
  const now = Date.now()
  const dayMs = 24*60*60*1000
  const keys = []
  for(let i=0;i<14;i++){ keys.push(new Date(now - i*dayMs).toISOString().slice(0,10)) }
  let last7=0, prev7=0
  for(let i=0;i<7;i++) last7 += (dailyAggs.get(`${userId}_${skillId}_${keys[i]}`)?.task_points||0)
  for(let i=7;i<14;i++) prev7 += (dailyAggs.get(`${userId}_${skillId}_${keys[i]}`)?.task_points||0)
  if (prev7 <= 0) return
  const drop = (last7 - prev7)/prev7
  if (drop <= -0.10) insights.push({userId, skillId, key:'skill_drop', severity: Math.abs(drop)>0.25?'critical':'warn', message:`${skillId} dropped ${Math.round(drop*100)}% w/w`, data:{prev7,last7,drop}})
}

// Simulation: create events that show a drop in Algorithms
const userId = 'user_1'
const skillA = 'Algorithms'
const skillB = 'DataStructures'

function makeEvent(daysAgo, skillId, difficulty='medium', durationMinutes=30){
  const ts = Date.now() - daysAgo*24*60*60*1000
  return { type:'task.completed', timestamp: ts, payload: { skills: [{skillId, weight:1}], difficulty, durationMinutes } }
}

// Generate events: weeks: 14 days back. Make earlier week strong, recent week weak
const events = []
// prev week (days 7-13): many completions
for(let d=7; d<14; d++){
  // 2 tasks of Algorithms per day
  events.push(makeEvent(d, skillA, 'hard', 60))
  events.push(makeEvent(d, skillA, 'medium', 30))
}
// last week (days 0-6): fewer tasks -> drop
for(let d=0; d<7; d++){
  if (d % 2 === 0){
    events.push(makeEvent(d, skillA, 'easy', 20))
  }
  // DataStructures steady
  events.push(makeEvent(d, skillB, 'medium', 30))
}

// process events
for(const e of events){
  const dateKey = dateKeyFromTimestamp(e.timestamp)
  const skills = e.payload.skills
  const difficulty = e.payload.difficulty
  const pointsBase = difficultyScore(difficulty)
  const durationSeconds = (e.payload.durationMinutes||0)*60
  for(const s of skills){
    const skillId = s.skillId
    const weight = s.weight||1
    const points = pointsBase * weight
    upsertDailyAgg(userId, skillId, dateKey, points, durationSeconds)
    updateMastery(userId, skillId, points, dateKey)
  }
  upsertUserDaily(userId, dateKey, durationSeconds)
  updateStreak(userId, dateKey)
}

// run local weekly drop check for Algorithms
(function runChecks(){
  // compute weekly sums for demonstration
  const now = Date.now()
  const dayMs = 24*60*60*1000
  function sumForRange(startDaysAgo, endDaysAgo, skillId){
    let sum = 0
    for(let d=startDaysAgo; d<=endDaysAgo; d++){
      const k = new Date(now - d*dayMs).toISOString().slice(0,10)
      sum += (dailyAggs.get(`${userId}_${skillId}_${k}`)?.task_points||0)
    }
    return sum
  }
  const last7 = sumForRange(0,6,skillA)
  const prev7 = sumForRange(7,13,skillA)
  const drop = prev7>0 ? (last7 - prev7)/prev7 : 0

  if (prev7>0 && drop <= -0.10){
    insights.push({ userId, skillId: skillA, key:'skill_drop', severity: Math.abs(drop)>0.25?'critical':'warn', message:`${skillA} dropped ${Math.round(drop*100)}% week-over-week`, data:{prev7,last7,drop}})
  }

  // collect outputs
  const output = {
    dailyAggs: Array.from(dailyAggs.entries()).slice(0,40),
    mastery: Array.from(mastery.entries()),
    userDaily: Array.from(userDaily.entries()),
    streaks: Array.from(streaks.entries()),
    insights
  }

  fs.writeFileSync('server/test/output.json', JSON.stringify(output, null, 2))
  console.log('Simulation complete. Wrote server/test/output.json')
})()
