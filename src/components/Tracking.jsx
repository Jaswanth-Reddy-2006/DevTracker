import { useState, useEffect } from 'react'
import axios from 'axios'
import Card from './ui/Card'
import { auth } from '../firebase'

export default function Tracking() {
  const [trackingData, setTrackingData] = useState([])
  const [recentEvents, setRecentEvents] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSessionActive, setIsSessionActive] = useState(false)
  const [sessionStartTime, setSessionStartTime] = useState(null)
  const [sessionApp, setSessionApp] = useState('VS Code')

  const API_URL = 'http://localhost:5000/api'

  const toggleSession = async () => {
    if (isSessionActive) {
      // End session
      const duration = Math.floor((Date.now() - sessionStartTime) / 1000)
      try {
        const user = auth.currentUser
        const token = await user.getIdToken()
        await axios.post(`${API_URL}/signals`, {
          source: sessionApp === 'Chrome' ? 'Browser' : 'VS Code',
          appOrDomain: sessionApp,
          category: sessionApp === 'VS Code' ? 'Coding' : 'Educational',
          startTime: new Date(sessionStartTime).toISOString(),
          endTime: new Date().toISOString(),
          durationInSeconds: duration
        }, {
          headers: { Authorization: `Bearer ${token}` }
        })
        setIsSessionActive(false)
        fetchTrackingData()
      } catch (err) {
        console.error('Failed to save session:', err)
      }
    } else {
      // Start session
      setSessionStartTime(Date.now())
      setIsSessionActive(true)
    }
  }

  const fetchTrackingData = async () => {
    setIsLoading(true)
    try {
      const user = auth.currentUser
      if (!user) return

      const token = await user.getIdToken()
      const response = await axios.get(`${API_URL}/signals`, {
        headers: { Authorization: `Bearer ${token}` }
      })

      const signals = response.data
      setRecentEvents(signals.slice(0, 10))

      // Aggregate signals by platform/app
      const platformMap = {}
      signals.forEach(sig => {
        const key = sig.appOrDomain
        if (!platformMap[key]) {
          platformMap[key] = {
            platform: key,
            timeSpent: 0,
            icon: sig.source === 'VS Code' ? '💻' : sig.source === 'Browser' ? '🌐' : '📱',
            color: sig.category === 'Coding' ? 'emerald' : sig.category === 'Educational' ? 'blue' : 'orange'
          }
        }
        platformMap[key].timeSpent += Math.round(sig.durationInSeconds / 60) // Store in minutes
      })

      setTrackingData(Object.values(platformMap))
    } catch (error) {
      console.error('Telemetry fetch failed', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchTrackingData()
  }, [])

  const formatTime = (minutes) => {
    if (!minutes) return '0m'
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`
  }

  const totalTime = trackingData.reduce((acc, curr) => acc + curr.timeSpent, 0)

  return (
    <div className="min-h-screen p-4 md:p-8 transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="mb-12 animate-slideUp flex justify-between items-end">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-4xl font-black tracking-tighter uppercase" style={{ color: 'var(--text-primary)' }}>
                Usage_Telemetry
              </h1>
              <p className="text-[10px] font-black uppercase tracking-[0.3em]" style={{ color: 'var(--text-tertiary)' }}>
                Real-time platform engagement analysis
              </p>
            </div>
          </div>
          <button 
            onClick={fetchTrackingData}
            className="mb-4 px-4 py-2 bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-500 hover:text-white transition-all"
          >
            Refresh_Feed
          </button>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <Card className="h-48 border-[var(--border-color)] bg-[var(--bg-secondary)]/50"></Card>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-10">
            {/* Session Controller */}
            <Card padding={true} className="border border-emerald-500/30 bg-emerald-500/5">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className={`w-3 h-3 rounded-full ${isSessionActive ? 'bg-red-500 animate-ping' : 'bg-emerald-500'}`}></div>
                  <div>
                    <h3 className="text-lg font-black tracking-tighter" style={{ color: 'var(--text-primary)' }}>
                      {isSessionActive ? `Tracking: ${sessionApp}` : 'External Activity Tracking'}
                    </h3>
                    <p className="text-[10px] opacity-50 uppercase tracking-widest">
                      {isSessionActive ? 'Session in progress...' : 'Start a manual session for external platforms'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {!isSessionActive && (
                    <select 
                      value={sessionApp}
                      onChange={(e) => setSessionApp(e.target.value)}
                      className="bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded-xl px-4 py-2 text-xs font-bold"
                    >
                      <option value="VS Code">VS Code</option>
                      <option value="Chrome">Chrome</option>
                      <option value="IntelliJ">IntelliJ</option>
                      <option value="Discord">Discord</option>
                    </select>
                  )}
                  <button 
                    onClick={toggleSession}
                    className={`px-8 py-3 rounded-xl font-black uppercase tracking-widest text-xs transition-all ${
                      isSessionActive 
                        ? 'bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-500/20' 
                        : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg shadow-emerald-500/20'
                    }`}
                  >
                    {isSessionActive ? 'Stop_Session' : 'Start_Session'}
                  </button>
                </div>
              </div>
            </Card>

            {/* Summary Card */}
            <Card padding={true} className="border border-[var(--border-color)] bg-gradient-to-br from-emerald-600/5 to-transparent relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl -mr-20 -mt-20"></div>
              <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
                <div>
                  <p className="text-[11px] font-black uppercase tracking-[0.3em] text-emerald-500 mb-2">Total System Engagement</p>
                  <h2 className="text-5xl font-black tracking-tighter" style={{ color: 'var(--text-primary)' }}>
                    {formatTime(totalTime)}
                  </h2>
                </div>
                <div className="flex gap-4">
                  <div className="text-center px-6 py-3 rounded-2xl bg-[var(--bg-tertiary)] border border-[var(--border-color)]">
                    <p className="text-[9px] font-black uppercase tracking-widest opacity-60 mb-1">Platforms</p>
                    <p className="text-xl font-black">{trackingData.length}</p>
                  </div>
                  <div className="text-center px-6 py-3 rounded-2xl bg-[var(--bg-tertiary)] border border-[var(--border-color)]">
                    <p className="text-[9px] font-black uppercase tracking-widest opacity-60 mb-1">Avg/Session</p>
                    <p className="text-xl font-black">{trackingData.length > 0 ? Math.round(totalTime / trackingData.length) : 0}m</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Platforms Grid */}
            {trackingData.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {trackingData.map((item, idx) => (
                  <Card 
                    key={idx} 
                    hover 
                    animated 
                    className="border-[var(--border-color)] group hover:border-emerald-500/50 transition-all duration-500"
                  >
                    <div className="flex items-start justify-between mb-6">
                      <div className={`w-12 h-12 rounded-xl bg-${item.color}-500/10 border border-${item.color}-500/20 flex items-center justify-center text-2xl shadow-inner`}>
                        {item.icon}
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-[9px] font-black uppercase tracking-widest opacity-40">Load_Factor</span>
                        <span className="text-[10px] font-black text-emerald-500">{Math.round((item.timeSpent / totalTime) * 100)}%</span>
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-black tracking-tight mb-2 group-hover:text-emerald-500 transition-colors" style={{ color: 'var(--text-primary)' }}>
                      {item.platform}
                    </h3>
                    
                    <div className="flex items-end justify-between">
                      <p className="text-2xl font-black tracking-tighter">
                        {formatTime(item.timeSpent)}
                      </p>
                      <div className="w-24 h-1.5 bg-[var(--bg-tertiary)] rounded-full overflow-hidden">
                        <div 
                          className={`h-full bg-${item.color}-500 rounded-full transition-all duration-1000`} 
                          style={{ width: `${Math.min((item.timeSpent / (totalTime || 1)) * 100, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Card padding={true} className="text-center py-20 border-dashed border-2 border-[var(--border-color)] bg-[var(--bg-secondary)]/30">
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-[var(--bg-tertiary)] flex items-center justify-center mb-6">
                    <svg className="w-8 h-8 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <p className="text-xs font-black uppercase tracking-[0.3em] opacity-40">Waiting for Telemetry Feed...</p>
                  <p className="text-[10px] font-bold mt-2 opacity-30">No active platform tracking data detected.</p>
                </div>
              </Card>
            )}

            {/* Activity Timeline */}
            <div>
              <h2 className="text-sm font-black mb-6 uppercase tracking-[0.3em] text-emerald-500 flex items-center gap-2">
                <span className="w-8 h-px bg-emerald-500"></span> Live_Engagement_Feed
              </h2>
              <div className="space-y-3">
                {recentEvents.length > 0 ? (
                  recentEvents.map((event, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl group hover:border-emerald-500/30 transition-all">
                      <div className="flex items-center gap-4">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                        <div>
                          <p className="text-xs font-black" style={{ color: 'var(--text-primary)' }}>{event.appOrDomain}</p>
                          <p className="text-[9px] opacity-50 uppercase tracking-widest">{event.source} • {event.category}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-black text-emerald-500">+{Math.round(event.durationInSeconds / 60)}m</p>
                        <p className="text-[8px] opacity-30">{new Date(event.createdAt).toLocaleTimeString()}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-[10px] font-bold opacity-30 italic">No recent events logged.</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
