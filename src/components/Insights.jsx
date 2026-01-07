import { useState, useEffect, useMemo } from 'react'
import Card from './ui/Card'
import { useAppData } from '../hooks/useAppData'

export default function Insights() {
  const { tasks, insights, focusRatio } = useAppData()
  const [currentInsightIndex, setCurrentInsightIndex] = useState(0)
  const [displayedText, setDisplayedText] = useState('')
  const [isTyping, setIsTyping] = useState(true)
  const [activityFilter, setActivityFilter] = useState('all')
  const [showFilters, setShowFilters] = useState(false)

  // Initialize insights if empty
  useEffect(() => {
    if (insights && insights.length === 0) {
      // In a production app, we would fetch these from the API
      // We no longer provide predefined fake insights
    }
  }, [insights])

  const currentInsight = insights?.[currentInsightIndex] || ''

  useEffect(() => {
    if (!isTyping && insights?.length > 0) {
      const nextInsightTimer = setTimeout(() => {
        setCurrentInsightIndex((prev) => (prev + 1) % insights.length)
        setIsTyping(true)
        setDisplayedText('')
      }, 4000)

      return () => clearTimeout(nextInsightTimer)
    }
  }, [isTyping, insights?.length])

  useEffect(() => {
    if (isTyping && currentInsight) {
      if (displayedText.length < currentInsight.length) {
        const typingTimer = setTimeout(() => {
          setDisplayedText(
            currentInsight.substring(0, displayedText.length + 1)
          )
        }, 30)

        return () => clearTimeout(typingTimer)
      } else {
        setIsTyping(false)
      }
    } else if (!currentInsight) {
      setIsTyping(false)
    }
  }, [displayedText, currentInsight, isTyping])

  const completedTasks = tasks?.filter(t => t.status === 'Completed') || []
  const totalDuration = tasks?.reduce((sum, t) => sum + (t.targetDuration * (t.progress / 100)), 0) || 0
  const totalHours = Math.floor(totalDuration / 60)
  const totalMinutes = Math.round(totalDuration % 60)

  const stats = [
    {
      label: 'Total Active Time',
      value: `${totalHours}h ${totalMinutes}m`,
      subtext: 'Calculated from tasks',
      icon: '⏱️',
      color: 'from-blue-500 to-cyan-400',
    },
    {
      label: 'Tasks Completed',
      value: completedTasks.length.toString(),
      subtext: `Out of ${tasks?.length || 0} tasks`,
      icon: '✅',
      color: 'from-green-500 to-emerald-400',
    },
    {
      label: 'Focus Score',
      value: `${focusRatio}%`,
      subtext: 'Current Focus Ratio',
      icon: '🎯',
      color: 'from-purple-500 to-pink-400',
    },
    {
      label: 'Streak Days',
      value: '0',
      subtext: 'Consecutive days',
      icon: '🔥',
      color: 'from-orange-500 to-red-400',
    },
  ]

  const timeline = useMemo(() => {
    return (tasks || [])
      .sort((a, b) => b.createdAt - a.createdAt)
      .map(t => ({
        time: new Date(t.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        activity: t.name,
        duration: `${t.targetDuration}m`,
        type: t.activityType.toLowerCase().includes('coding') || t.activityType.toLowerCase().includes('testing') ? 'active' : 'educational',
        originalType: t.activityType
      }))
  }, [tasks])

  const filteredTimeline = timeline.filter((item) =>
    activityFilter === 'all' ? true : item.type === activityFilter
  )

  const hasActiveFilters = activityFilter !== 'all'

  const hourlyData = []

  return (
    <div className="min-h-screen p-4 md:p-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-10 animate-slideUp flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-6 bg-blue-600 rounded-full"></div>
              <h1 className="text-4xl font-black tracking-tighter" style={{ color: 'var(--text-primary)' }}>
                SYSTEM_INSIGHTS
              </h1>
            </div>
            <p className="font-bold text-xs uppercase tracking-[0.2em]" style={{ color: 'var(--text-tertiary)' }}>
              Neural Analysis & Telemetry Data
            </p>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 border flex items-center gap-2 ${
                showFilters || hasActiveFilters
                  ? 'bg-blue-600 text-white border-blue-500 shadow-lg shadow-blue-500/20'
                  : 'bg-[var(--bg-secondary)] border-[var(--border-color)] hover:border-blue-500/50'
              }`}
            >
              <span>{showFilters ? '✕' : '⚙️'}</span> {showFilters ? 'Close Filters' : 'Configure View'}
            </button>
            {hasActiveFilters && (
              <button
                onClick={() => setActivityFilter('all')}
                className="px-6 py-3 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500/20 text-[10px] font-black uppercase tracking-widest transition-all border border-red-500/20"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        {showFilters && (
          <div className="mb-8 animate-fadeIn">
            <Card padding={true} className="border-2 border-blue-500/20 bg-[var(--bg-secondary)]/50 backdrop-blur-xl">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-[0.3em] mb-4 text-blue-500">
                  Data Classification Protocol
                </label>
                <div className="flex gap-2 p-1 bg-[var(--bg-tertiary)] rounded-2xl border border-[var(--border-color)] max-w-md">
                  {['all', 'active', 'educational'].map((opt) => (
                    <button
                      key={opt}
                      onClick={() => setActivityFilter(opt)}
                      className={`flex-1 px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                        activityFilter === opt
                          ? 'bg-blue-600 text-white shadow-md'
                          : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-white/5'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Intelligence Stream */}
        <Card animated padding={false} className="mb-10 border border-[var(--border-color)] bg-gradient-to-r from-blue-600/5 to-transparent overflow-hidden relative group">
          <div className="absolute inset-y-0 left-0 w-1 bg-blue-600"></div>
          <div className="p-8 flex flex-col md:flex-row items-start md:items-center gap-6 relative z-10">
            <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20 shrink-0">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] mb-2 text-blue-500">Core Intelligence Stream</p>
              <div className="min-h-[3rem]">
                <p className="text-xl md:text-2xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
                  {displayedText}
                  {isTyping && <span className="ml-1 inline-block w-1.5 h-6 bg-blue-500 animate-pulse align-middle"></span>}
                </p>
              </div>
            </div>
            <div className="hidden md:flex flex-col items-end opacity-40 group-hover:opacity-100 transition-opacity">
              <span className="text-[10px] font-black uppercase tracking-widest">Node_Status</span>
              <span className="text-[10px] font-black uppercase tracking-widest text-green-500">Active_Processing</span>
            </div>
          </div>
        </Card>

        {/* Vital Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-10 animate-fadeIn">
          {stats.map((stat, idx) => (
            <div key={idx} className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 rounded-[var(--radius-xl)] transition-opacity" style={{ backgroundImage: `linear-gradient(to bottom right, ${stat.color.split(' ')[1]}, ${stat.color.split(' ')[3]})` }}></div>
              <Card animated hover className="text-left border-[var(--border-color)] h-full overflow-hidden">
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-6">
                    <span className="text-2xl">{stat.icon}</span>
                    <div className={`w-2 h-2 rounded-full bg-gradient-to-br ${stat.color}`}></div>
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-2" style={{ color: 'var(--text-tertiary)' }}>{stat.label}</p>
                  <p className={`text-3xl font-black bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-2`}>
                    {stat.value}
                  </p>
                  <div className="h-1 w-full bg-[var(--bg-tertiary)] rounded-full overflow-hidden mb-2">
                    <div className={`h-full bg-gradient-to-r ${stat.color} w-2/3`}></div>
                  </div>
                  <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--text-tertiary)' }}>{stat.subtext}</p>
                </div>
              </Card>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-12 gap-6 md:gap-10 animate-fadeIn">
          {/* Productivity Chart */}
          <div className="lg:col-span-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-black tracking-tighter uppercase" style={{ color: 'var(--text-primary)' }}>
                Activity_Architecture
              </h2>
              <span className="text-[10px] font-black uppercase tracking-widest text-blue-500">Real-Time Sync</span>
            </div>
            <Card className="p-8 border-[var(--border-color)] bg-[var(--bg-secondary)]/30 backdrop-blur-sm">
              {hourlyData.length > 0 ? (
                <div className="flex items-end justify-between h-64 gap-3 md:gap-6">
                  {hourlyData.map((data, idx) => (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-4 group h-full">
                      <div className="relative w-full flex flex-col items-center justify-end h-full">
                        <div className="absolute inset-0 w-px bg-[var(--border-color)] left-1/2 -translate-x-1/2 opacity-20"></div>
                        <div 
                          className="w-full max-w-[2.5rem] rounded-t-xl bg-gradient-to-t from-blue-600 to-indigo-400 transition-all duration-1000 group-hover:brightness-125 relative z-10 shadow-lg shadow-blue-500/10"
                          style={{ height: `${data.productivity}%` }}
                        >
                          <div className="opacity-0 group-hover:opacity-100 absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-black px-3 py-2 rounded-lg shadow-2xl transition-all scale-90 group-hover:scale-100 pointer-events-none z-50 whitespace-nowrap">
                            LOAD: {data.productivity}%
                          </div>
                        </div>
                      </div>
                      <span className="text-[9px] font-black uppercase tracking-tighter opacity-60" style={{ color: 'var(--text-tertiary)' }}>{data.hour}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center h-64 border-2 border-dashed border-[var(--border-color)] rounded-2xl">
                   <p className="text-[10px] font-black uppercase tracking-widest opacity-40">No activity architecture data available</p>
                </div>
              )}
              <div className="mt-10 pt-8 border-t border-dashed border-[var(--border-color)] flex flex-wrap justify-between items-center gap-4">
                <div className="flex gap-6">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                    <span className="text-[9px] font-black uppercase tracking-widest opacity-60">Focus_Level</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-700"></div>
                    <span className="text-[9px] font-black uppercase tracking-widest opacity-60">Idle_Time</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 bg-[var(--bg-tertiary)] px-3 py-1.5 rounded-full border border-[var(--border-color)]">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                  <p className="text-[9px] font-black uppercase tracking-widest">Telemetry_Active</p>
                </div>
              </div>
            </Card>

            <h2 className="text-xl font-black mt-12 mb-6 tracking-tighter uppercase" style={{ color: 'var(--text-primary)' }}>
              Protocol_History
            </h2>
            <div className="space-y-3">
              {filteredTimeline.length === 0 ? (
                <Card padding={true} className="text-center py-16 border-dashed border-2 border-[var(--border-color)]">
                  <p className="text-xs font-black uppercase tracking-[0.2em]" style={{ color: 'var(--text-tertiary)' }}>
                    NO_DATA_AVAILABLE
                  </p>
                </Card>
              ) : (
                filteredTimeline.map((item, idx) => (
                  <Card key={idx} hover className="group border-[var(--border-color)] bg-[var(--bg-secondary)]/50">
                    <div className="flex items-center gap-6">
                      <div className="flex flex-col items-center shrink-0">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center border-2 ${
                            item.type === 'active'
                              ? 'bg-green-500/10 border-green-500/30 text-green-500'
                              : 'bg-blue-500/10 border-blue-500/30 text-blue-500'
                          }`}>
                          <span className="text-xs font-black uppercase">{item.type[0]}</span>
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-1">
                          <p className="font-bold tracking-tight text-lg group-hover:text-blue-500 transition-colors" style={{ color: 'var(--text-primary)' }}>
                            {item.activity}
                          </p>
                          <span className="text-[9px] font-black uppercase tracking-widest px-2 py-1 bg-[var(--bg-tertiary)] rounded-lg border border-[var(--border-color)]">
                            {item.time}
                          </span>
                        </div>
                        <div className="flex items-center gap-4">
                          <p className="text-[10px] font-black uppercase tracking-widest opacity-60 flex items-center gap-1.5">
                            <span className="w-1 h-1 bg-current rounded-full"></span>
                            {item.duration} Session
                          </p>
                          <p className="text-[10px] font-black uppercase tracking-widest opacity-60 flex items-center gap-1.5">
                            <span className="w-1 h-1 bg-current rounded-full"></span>
                            {item.originalType}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </div>

          {/* Sidebar Section */}
          <div className="lg:col-span-4 space-y-8">
            <div>
              <h2 className="text-xl font-black mb-6 tracking-tighter uppercase" style={{ color: 'var(--text-primary)' }}>
                Weekly_Pulse
              </h2>
              <div className="space-y-4">
                {[
                  { day: 'MON', hours: 3.5, color: 'from-blue-500 to-cyan-400' },
                  { day: 'TUE', hours: 4.2, color: 'from-green-500 to-emerald-400' },
                  { day: 'WED', hours: 3.8, color: 'from-purple-500 to-pink-400' },
                  { day: 'THU', hours: 2.5, color: 'from-orange-500 to-red-400' },
                  { day: 'FRI', hours: 2.1, color: 'from-yellow-500 to-orange-400' },
                ].map((item, idx) => (
                  <Card key={idx} hover className="border-[var(--border-color)] bg-[var(--bg-secondary)]/50 group">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: 'var(--text-primary)' }}>
                        {item.day}
                      </span>
                      <span className="text-[10px] font-black tracking-widest">
                        {item.hours}H <span className="opacity-40 ml-1">LOGGED</span>
                      </span>
                    </div>
                    <div className="w-full bg-[var(--bg-tertiary)] rounded-full h-1.5 overflow-hidden">
                      <div
                        className={`h-full bg-gradient-to-r ${item.color} transition-all duration-1000 group-hover:brightness-110 shadow-[0_0_8px_rgba(59,130,246,0.3)]`}
                        style={{ width: `${(item.hours / 5) * 100}%` }}
                      ></div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            <Card className="border-2 border-dashed border-blue-500/30 bg-blue-500/5 p-6">
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-500 mb-6">Efficiency_Metrics</h3>
              <div className="grid grid-cols-2 gap-6">
                <div className="p-4 bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-color)]">
                  <p className="text-[9px] font-black uppercase tracking-widest opacity-40 mb-1">Peak_Flow</p>
                  <p className="text-xl font-black text-blue-500">MORNING</p>
                </div>
                <div className="p-4 bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-color)]">
                  <p className="text-[9px] font-black uppercase tracking-widest opacity-40 mb-1">Top_Activity</p>
                  <p className="text-xl font-black text-indigo-500">CODING</p>
                </div>
                <div className="p-4 bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-color)]">
                  <p className="text-[9px] font-black uppercase tracking-widest opacity-40 mb-1">Consistency</p>
                  <p className="text-xl font-black text-green-500">92%</p>
                </div>
                <div className="p-4 bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-color)]">
                  <p className="text-[9px] font-black uppercase tracking-widest opacity-40 mb-1">Squad_Rank</p>
                  <p className="text-xl font-black text-purple-500">#04</p>
                </div>
              </div>
              
              <div className="mt-8 pt-6 border-t border-[var(--border-color)] text-center">
                <button className="text-[10px] font-black uppercase tracking-widest text-blue-500 hover:text-blue-400 transition-colors">
                  Generate Full Report →
                </button>
              </div>
            </Card>

            <div className="p-6 rounded-3xl bg-slate-900 text-white relative overflow-hidden group border border-slate-800">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                <svg className="w-20 h-20" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L1 21h22L12 2zm0 3.45l8.1 14.1H3.9L12 5.45zM11 11v4h2v-4h-2zm0 6v2h2v-2h-2z"/></svg>
              </div>
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-400 mb-4 relative z-10">System_Alert</h3>
              <p className="text-sm font-bold leading-relaxed relative z-10">
                Cognitive load detected as &quot;High&quot; during last session. Suggesting 15-minute cool down protocol.
              </p>
              <button className="mt-6 w-full py-3 bg-blue-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 transition-colors relative z-10">
                Initiate Break
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
