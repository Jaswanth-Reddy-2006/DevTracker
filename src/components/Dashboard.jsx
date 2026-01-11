import { useMemo, useState, useEffect, useCallback } from 'react'
import Card from './ui/Card'
import ProgressBar from './ui/ProgressBar'
import { useAppData } from '../hooks/useAppData'
import axios from 'axios'
import { auth } from '../firebase'

const API_URL = 'http://localhost:5000/api'

export default function Dashboard() {
  const { user } = useAppData()
  const [isTracking, setIsTracking] = useState(true)
  const [hackathonTasks, setHackathonTasks] = useState([])
  const [focusStats, setFocusStats] = useState({ focusRatio: 0, educationalTime: 0, distractionTime: 0 })
  const [recentSignals, setRecentSignals] = useState([])

  const fetchData = useCallback(async () => {
    try {
      const currentUser = auth.currentUser
      if (!currentUser) return

      const token = await currentUser.getIdToken()
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      }

      const [tasksRes, statsRes, signalsRes, statusRes] = await Promise.all([
        axios.get(`${API_URL}/tasks`, config),
        axios.get(`${API_URL}/signals/focus-stats`, config),
        axios.get(`${API_URL}/signals`, config),
        axios.get(`${API_URL}/signals/tracking-status`, config)
      ])
      
      setHackathonTasks(tasksRes.data)
      setFocusStats(statsRes.data)
      setRecentSignals(signalsRes.data.slice(0, 5))
      setIsTracking(statusRes.data.isTrackingEnabled)
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
    }
  }, [])

  const toggleTracking = async () => {
    try {
      const currentUser = auth.currentUser
      if (!currentUser) return

      const token = await currentUser.getIdToken()
      const newState = !isTracking
      await axios.post(`${API_URL}/signals/toggle-tracking`, 
        { enabled: newState },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setIsTracking(newState)
    } catch (error) {
      console.error('Failed to toggle tracking:', error)
    }
  }

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 10000)
    return () => clearInterval(interval)
  }, [fetchData])

  const activeTasks = useMemo(() => {
    return (hackathonTasks || []).filter(t => t.status !== 'completed').slice(0, 3)
  }, [hackathonTasks])

  const activities = useMemo(() => {
    return recentSignals.map((signal, idx) => ({
      id: idx,
      activity: signal.appOrDomain,
      type: signal.category === 'Coding' ? 'active' : signal.category === 'Educational' ? 'educational' : 'distraction',
      time: new Date(signal.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    }))
  }, [recentSignals])

  const educationalTimeStats = useMemo(() => focusStats.educationalTime / 60, [focusStats])
  const distractionTimeStats = useMemo(() => focusStats.distractionTime / 60, [focusStats])

  const formatTime = (minutes) => {
    const h = Math.floor(minutes / 60)
    const m = Math.round(minutes % 60)
    return `${h}h ${m}m`
  }

  const calculatedScore = useMemo(() => {
    const taskPoints = (hackathonTasks || []).reduce((sum, task) => {
      if (task.status !== 'completed') return sum
      return sum + 100
    }, 0)
    return (user?.developerScore || 0) + taskPoints
  }, [hackathonTasks, user])

  const levelInfo = useMemo(() => {
    const level = Math.floor(calculatedScore / 500) + 1
    const currentLevelXP = (level - 1) * 500
    const progress = ((calculatedScore - currentLevelXP) / 500) * 100
    
    return {
      level,
      progress,
      title: `Developer Tier ${level}`
    }
  }, [calculatedScore])

  const taskDistribution = useMemo(() => {
    const counts = (hackathonTasks || []).reduce((acc, t) => {
      acc[t.activityType] = (acc[t.activityType] || 0) + 1
      return acc
    }, {})
    const total = (hackathonTasks || []).length || 1
    return Object.entries(counts).map(([type, count]) => ({
      type,
      percentage: Math.round((count / total) * 100),
      count
    }))
  }, [hackathonTasks])

  return (
    <div className="space-y-10 py-6 relative">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="animate-slideUp">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-2.5 h-8 bg-gradient-to-b from-blue-600 to-indigo-700 rounded-full shadow-[0_0_15px_rgba(37,99,235,0.4)]"></div>
            <div>
              <h1 className="text-4xl font-black tracking-tighter uppercase leading-none" style={{ color: 'var(--text-primary)' }}>
                Dashboard
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[8px] font-black text-blue-500 uppercase tracking-[0.4em] opacity-70">Real-time Metrics</span>
                <div className="w-1 h-1 bg-blue-500 rounded-full animate-ping"></div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-4 bg-[var(--bg-secondary)] p-2 rounded-3xl border border-[var(--border-color)] shadow-xl animate-fadeIn">
          <div className={`flex items-center gap-3 px-6 py-3 rounded-2xl border ${isTracking ? 'bg-green-500/10 border-green-500/20 text-green-600 dark:text-green-400' : 'bg-red-500/10 border-red-500/20 text-red-600 dark:text-red-400'}`}>
            <span className={`w-2 h-2 rounded-full ${isTracking ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></span>
            <span className="text-[9px] font-black uppercase tracking-[0.2em]">{isTracking ? 'Tracking Active' : 'Tracking Paused'}</span>
          </div>
          <button 
            onClick={toggleTracking}
            className={`px-8 py-3 rounded-2xl font-black text-[9px] uppercase tracking-[0.2em] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-lg ${isTracking ? 'bg-[var(--bg-tertiary)] text-[var(--text-primary)] border border-[var(--border-color)] hover:bg-[var(--bg-secondary)]' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
          >
            {isTracking ? 'Stop Tracking' : 'Start Tracking'}
          </button>
        </div>
      </header>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        <Card glass animated hover className="lg:col-span-2 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl group-hover:bg-blue-500/10 transition-colors"></div>
          <div className="space-y-8 relative z-10">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-2xl font-black tracking-tight" style={{ color: 'var(--text-primary)' }}>Focus Analysis</h3>
                <p className="text-xs font-bold uppercase tracking-widest mt-1" style={{ color: 'var(--text-tertiary)' }}>Productivity Stream</p>
              </div>
              <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center border border-blue-500/20">
                <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <div className="flex justify-between mb-2 items-end">
                  <span className="text-xs font-black uppercase tracking-widest" style={{ color: 'var(--text-secondary)' }}>Productive Time</span>
                  <span className="text-sm font-black text-blue-500">{formatTime(educationalTimeStats)}</span>
                </div>
                <ProgressBar progress={Math.min((educationalTimeStats / 60) * 100, 100)} color="from-blue-500 to-indigo-500" showLabel={false} />
              </div>

              <div>
                <div className="flex justify-between mb-2 items-end">
                  <span className="text-xs font-black uppercase tracking-widest" style={{ color: 'var(--text-secondary)' }}>Distractions</span>
                  <span className="text-sm font-black text-red-500">{formatTime(distractionTimeStats)}</span>
                </div>
                <ProgressBar progress={Math.min((distractionTimeStats / 60) * 100, 100)} color="from-red-500 to-rose-500" showLabel={false} />
              </div>

              <div className="pt-6 mt-2 border-t border-[var(--border-color)] border-dashed">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-black uppercase tracking-widest" style={{ color: 'var(--text-tertiary)' }}>Focus Score</span>
                  <div className="flex items-end gap-1">
                    <span className="text-4xl font-black text-gradient leading-none">
                      {Math.round(focusStats.focusRatio * 100)}
                    </span>
                    <span className="text-sm font-black text-blue-500 mb-1">%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Card glass animated hover className="lg:col-span-2 flex flex-col items-center justify-center p-10 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
          <div className="relative w-48 h-48 mb-8">
            <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90 filter drop-shadow-[0_0_15px_rgba(59,130,246,0.2)]">
              <circle cx="50" cy="50" r="44" fill="none" stroke="var(--bg-tertiary)" strokeWidth="4" />
              <circle
                cx="50"
                cy="50"
                r="44"
                fill="none"
                stroke="url(#dashboardGradient)"
                strokeWidth="6"
                strokeDasharray={`${(levelInfo.progress / 100) * 276.5} 276.5`}
                strokeLinecap="round"
                className="transition-all duration-1000 cubic-bezier(0.4, 0, 0.2, 1)"
              />
              <defs>
                <linearGradient id="dashboardGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#8b5cf6" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-5xl font-black text-gradient leading-none">{calculatedScore}</span>
              <span className="text-[10px] uppercase tracking-[0.3em] font-black text-[var(--text-tertiary)] mt-2">XP Points</span>
            </div>
          </div>
          <div className="text-center relative z-10">
            <div className="inline-block px-4 py-1.5 rounded-full bg-[var(--bg-tertiary)] border border-[var(--border-color)] mb-3">
              <span className="text-xs font-black uppercase tracking-widest text-blue-500">Level {levelInfo.level}</span>
            </div>
            <h3 className="text-3xl font-black tracking-tight uppercase" style={{ color: 'var(--text-primary)' }}>{levelInfo.title}</h3>
          </div>
        </Card>

        <Card glass animated hover className="lg:col-span-4 overflow-hidden">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="p-4">
              <h3 className="text-2xl font-black tracking-tight mb-2" style={{ color: 'var(--text-primary)' }}>Activity Distribution</h3>
              <p className="text-sm font-bold uppercase tracking-widest mb-8" style={{ color: 'var(--text-tertiary)' }}>Session Composition Analysis</p>
              <div className="space-y-6">
                {taskDistribution.map((item, idx) => (
                  <div key={item.type} className="group">
                    <div className="flex justify-between mb-2 text-xs font-black uppercase tracking-widest">
                      <span className="group-hover:text-blue-500 transition-colors" style={{ color: 'var(--text-secondary)' }}>{item.type}</span>
                      <span style={{ color: 'var(--text-primary)' }}>{item.count} NODES ({item.percentage}%)</span>
                    </div>
                    <div className="h-3 rounded-full bg-[var(--bg-tertiary)] overflow-hidden p-0.5 border border-[var(--border-color)]">
                      <div 
                        className="h-full rounded-full transition-all duration-1000 shadow-sm" 
                        style={{ 
                          width: `${item.percentage}%`,
                          backgroundColor: idx === 0 ? '#3b82f6' : idx === 1 ? '#10b981' : idx === 2 ? '#f59e0b' : '#8b5cf6'
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-center p-8 bg-[var(--bg-tertiary)]/30 rounded-[var(--radius-2xl)]">
              <div className="relative w-64 h-64">
                <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90 filter drop-shadow-xl">
                  {taskDistribution.map((item, idx) => {
                    let offset = 0
                    for (let i = 0; i < idx; i++) {
                      offset += taskDistribution[i].percentage
                    }
                    return (
                      <circle
                        key={item.type}
                        cx="50"
                        cy="50"
                        r="38"
                        fill="none"
                        stroke={idx === 0 ? '#3b82f6' : idx === 1 ? '#10b981' : idx === 2 ? '#f59e0b' : '#8b5cf6'}
                        strokeWidth="12"
                        strokeDasharray={`${(item.percentage / 100) * 238.7} 238.7`}
                        strokeDashoffset={`${-(offset / 100) * 238.7}`}
                        strokeLinecap="round"
                        className="transition-all duration-1000"
                      />
                    )
                  })}
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-4xl font-black text-gradient leading-none">{hackathonTasks?.length || 0}</p>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-tertiary)] mt-2">Total Ops</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Card glass animated hover className="lg:col-span-2 relative">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-black tracking-tight uppercase" style={{ color: 'var(--text-primary)' }}>Priority Objectives</h3>
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
              </div>
            </div>
            <div className="space-y-4">
              {activeTasks && activeTasks.length > 0 ? (
                activeTasks.map((task) => (
                  <div key={task.taskId} className="p-4 rounded-2xl bg-[var(--bg-tertiary)]/50 border border-[var(--border-color)] group hover:border-blue-500/30 transition-all cursor-pointer">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="text-sm font-black uppercase tracking-tight group-hover:text-blue-500 transition-colors" style={{ color: 'var(--text-primary)' }}>{task.title}</p>
                        <p className="text-[10px] font-black uppercase tracking-widest mt-1" style={{ color: 'var(--text-tertiary)' }}>{task.activityType}</p>
                      </div>
                      <span className="text-[10px] font-black px-2 py-1 rounded-lg bg-blue-500/10 text-blue-500 border border-blue-500/20 uppercase tracking-widest">
                        {task.status}
                      </span>
                    </div>
                    <ProgressBar 
                      progress={Math.round((task.currentProgressInSeconds / task.targetDurationInSeconds) * 100)} 
                      color="from-blue-500 to-indigo-500" 
                      showLabel={true} 
                    />
                  </div>
                ))
              ) : (
                <div className="text-center py-12 rounded-[var(--radius-xl)] border-2 border-dashed border-[var(--border-color)]">
                  <p className="text-xs font-black uppercase tracking-widest" style={{ color: 'var(--text-tertiary)' }}>No Active Protocols</p>
                </div>
              )}
            </div>
          </div>
        </Card>

        <Card glass animated hover className="lg:col-span-2 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <svg className="w-24 h-24 text-blue-500" fill="currentColor" viewBox="0 0 24 24 opacity-20"><path d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
          </div>
          <div className="space-y-6 relative z-10">
            <div className="flex justify-between items-center border-b border-dashed border-[var(--border-color)] pb-4">
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-6 bg-blue-500 rounded-full"></div>
                <h3 className="text-xl font-black tracking-tight uppercase text-blue-500">Signal_Stream</h3>
              </div>
              <div className="flex gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-[pulse_1.5s_infinite]"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500/50 animate-[pulse_1.5s_infinite_0.5s]"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500/20 animate-[pulse_1.5s_infinite_1s]"></div>
              </div>
            </div>
            <div className="space-y-3 font-mono">
              {activities && activities.length > 0 ? (
                activities.slice(0, 6).map((act) => (
                  <div key={act.id} className="flex items-center justify-between text-[10px] group cursor-default p-2 rounded-lg hover:bg-blue-500/5 transition-colors">
                    <div className="flex items-center gap-4">
                      <span className="text-[var(--text-tertiary)] opacity-40 font-bold">[{act.time}]</span>
                      <span className={`uppercase font-black tracking-tight ${
                        act.type === 'active' ? 'text-green-500' : act.type === 'educational' ? 'text-blue-500' : 'text-red-500'
                      }`}>
                        {act.activity.length > 20 ? act.activity.substring(0, 20) + '...' : act.activity}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[var(--text-tertiary)] uppercase tracking-[0.2em] text-[8px] opacity-0 group-hover:opacity-100 transition-opacity">Node_Valid</span>
                      <div className={`w-1 h-1 rounded-full shadow-[0_0_5px_rgba(var(--accent-primary-rgb),0.5)] ${
                        act.type === 'active' ? 'bg-green-500' : act.type === 'educational' ? 'bg-blue-500' : 'bg-red-500'
                      }`}></div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-20 text-center text-[var(--text-tertiary)] uppercase tracking-[0.3em] text-[10px] border border-dashed border-[var(--border-color)] rounded-2xl">
                  <div className="animate-pulse">Awaiting_Signal_Input...</div>
                </div>
              )}
            </div>
            {activities.length > 0 && (
              <div className="pt-2 flex justify-center">
                <div className="h-0.5 w-12 bg-blue-500/20 rounded-full"></div>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}
