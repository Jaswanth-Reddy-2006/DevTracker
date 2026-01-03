import { useState, useEffect, useMemo } from 'react'
import Card from './ui/Card'
import { useAppData } from '../hooks/useAppData'

export default function Insights() {
  const { tasks, insights, focusRatio, updateInsights } = useAppData()
  const [currentInsightIndex, setCurrentInsightIndex] = useState(0)
  const [displayedText, setDisplayedText] = useState('')
  const [isTyping, setIsTyping] = useState(true)
  const [activityFilter, setActivityFilter] = useState('all')
  const [showFilters, setShowFilters] = useState(false)

  // Initialize insights if empty
  useEffect(() => {
    if (insights && insights.length === 0) {
      updateInsights([
        "You planned 3h of coding but lost 42 mins to entertainment.",
        "Your focus peaks between 8 AM and 11 AM.",
        "Group productivity increased by 23% after competitive scoring.",
        "You're 15% ahead of group average on task completion.",
        "Most active learning period: Tuesday evenings.",
        "You completed 12 tasks this week - 40% more than last week.",
      ])
    }
  }, [insights, updateInsights])

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
      value: '12',
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

  return (
    <div className="min-h-screen p-8 transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        <div className="mb-10 animate-slideUp">
          <h1 className="text-4xl font-black mb-2 tracking-tight" style={{ color: 'var(--text-primary)' }}>
            Insights
          </h1>
          <p className="font-medium" style={{ color: 'var(--text-secondary)' }}>
            AI-driven analysis of your engineering habits and focus patterns
          </p>
        </div>

        <div className="space-y-4 mb-10 animate-fadeIn">
          <div className="flex gap-3 flex-wrap items-center">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-5 py-3 rounded-2xl font-bold transition-all duration-300 border flex items-center gap-2 ${
                showFilters || hasActiveFilters
                  ? 'bg-blue-600/20 text-blue-400 border-blue-500/50 shadow-inner'
                  : 'hover:bg-blue-500/5 hover:border-blue-500/30'
              }`}
              style={!(showFilters || hasActiveFilters) ? { backgroundColor: 'var(--bg-tertiary)', borderColor: 'var(--border-color)', color: 'var(--text-secondary)' } : {}}
            >
              <span>⚙️</span> Filters {hasActiveFilters && <span className="ml-1 w-2 h-2 bg-blue-500 rounded-full"></span>}
            </button>
            {hasActiveFilters && (
              <button
                onClick={() => {
                  setActivityFilter('all')
                }}
                className="px-5 py-3 rounded-2xl bg-red-500/10 text-red-500 hover:bg-red-500/20 font-bold transition-all duration-300 border border-red-500/20"
              >
                Reset
              </button>
            )}
          </div>

          {showFilters && (
            <Card animated padding={true} className="border-2 border-blue-500/20">
              <div>
                <label className="block text-xs font-black uppercase tracking-widest mb-3" style={{ color: 'var(--text-tertiary)' }}>
                  Filter by category
                </label>
                <div className="flex gap-1 bg-[var(--bg-tertiary)] p-1 rounded-xl border border-[var(--border-color)]">
                  {['all', 'active', 'educational'].map((opt) => (
                    <button
                      key={opt}
                      onClick={() => setActivityFilter(opt)}
                      className={`flex-1 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                        activityFilter === opt
                          ? 'bg-blue-600 text-white shadow-md'
                          : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                      }`}
                    >
                      {opt.charAt(0).toUpperCase() + opt.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </Card>
          )}
        </div>

        <Card animated padding={true} className="mb-10 border-2 border-blue-500/20 shadow-2xl overflow-hidden relative group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-opacity">
            <span className="text-6xl">💡</span>
          </div>
          <div className="min-h-32 flex flex-col justify-center relative z-10">
            <p className="text-[10px] font-black uppercase tracking-widest mb-4" style={{ color: 'var(--text-tertiary)' }}>Strategy Recommendation</p>
            <p className="text-3xl font-bold leading-tight tracking-tight" style={{ color: 'var(--text-primary)' }}>
              {displayedText}
              {isTyping && (
                <span className="ml-1 inline-block w-2 h-8 bg-blue-500 animate-pulse"></span>
              )}
            </p>
          </div>
        </Card>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10 animate-fadeIn">
          {stats.map((stat, idx) => (
            <Card key={idx} animated hover className="text-center group border-b-4 border-transparent hover:border-blue-500/50">
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">{stat.icon}</div>
              <p className="text-[10px] font-black uppercase tracking-widest mb-2" style={{ color: 'var(--text-tertiary)' }}>{stat.label}</p>
              <p
                className={`text-3xl font-black bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-1`}
              >
                {stat.value}
              </p>
              <p className="text-xs font-medium" style={{ color: 'var(--text-tertiary)' }}>{stat.subtext}</p>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-10 animate-fadeIn">
          <div>
            <h2 className="text-2xl font-black mb-6 tracking-tight" style={{ color: 'var(--text-primary)' }}>
              Session History
            </h2>
            <div className="space-y-4">
              {filteredTimeline.length === 0 ? (
                <Card padding={false}>
                  <div className="text-center py-12">
                    <p style={{ color: 'var(--text-tertiary)' }}>
                      No data matches the current filter
                    </p>
                  </div>
                </Card>
              ) : (
                filteredTimeline.map((item, idx) => (
                  <Card
                    key={idx}
                    hover
                    className="group"
                  >
                    <div className="flex gap-5">
                      <div className="flex flex-col items-center">
                        <div
                          className={`w-4 h-4 rounded-full border-4 border-[var(--bg-secondary)] shadow-lg ${
                            item.type === 'active'
                              ? 'bg-green-500'
                              : 'bg-blue-500'
                          }`}
                        ></div>
                        {idx < filteredTimeline.length - 1 && (
                          <div className="w-0.5 h-full my-1 rounded-full" style={{ backgroundColor: 'var(--border-color)' }}></div>
                        )}
                      </div>
                      <div className="flex-1 pb-4">
                        <div className="flex justify-between items-start">
                          <p className="text-lg font-bold group-hover:text-blue-500 transition-colors" style={{ color: 'var(--text-primary)' }}>
                            {item.activity}
                          </p>
                          <span className="text-[10px] font-black uppercase tracking-widest p-1.5 rounded bg-blue-500/10 text-blue-500" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                            {item.time}
                          </span>
                        </div>
                        <p className="text-xs font-bold mt-2 flex items-center gap-2" style={{ color: 'var(--text-secondary)' }}>
                          <span className="text-sm">⏱️</span> {item.duration} session
                        </p>
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-black mb-6 tracking-tight" style={{ color: 'var(--text-primary)' }}>
              Weekly Pulse
            </h2>
            <div className="space-y-4">
              {[
                { day: 'Monday', hours: 3.5, color: 'from-blue-500 to-cyan-400' },
                {
                  day: 'Tuesday',
                  hours: 4.2,
                  color: 'from-green-500 to-emerald-400',
                },
                {
                  day: 'Wednesday',
                  hours: 3.8,
                  color: 'from-purple-500 to-pink-400',
                },
                {
                  day: 'Thursday',
                  hours: 2.5,
                  color: 'from-orange-500 to-red-400',
                },
                {
                  day: 'Friday',
                  hours: 2.1,
                  color: 'from-yellow-500 to-orange-400',
                },
              ].map((item, idx) => (
                <Card key={idx} hover className="group">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-black uppercase tracking-widest" style={{ color: 'var(--text-primary)' }}>
                      {item.day}
                    </span>
                    <span className="text-sm font-black" style={{ color: 'var(--text-secondary)' }}>
                      {item.hours}h <span className="text-[10px] font-bold text-[var(--text-tertiary)] uppercase ml-1">Detected</span>
                    </span>
                  </div>
                  <div className="w-full rounded-full h-3 overflow-hidden border-2 shadow-inner" style={{ backgroundColor: 'var(--bg-tertiary)', borderColor: 'var(--border-color)' }}>
                    <div
                      className={`h-full bg-gradient-to-r ${item.color} transition-all duration-1000 group-hover:brightness-110`}
                      style={{ width: `${(item.hours / 5) * 100}%` }}
                    ></div>
                  </div>
                </Card>
              ))}
            </div>

            <Card className="mt-10 border-2 border-dashed border-blue-500/30" style={{ backgroundColor: 'transparent' }}>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest mb-2" style={{ color: 'var(--text-tertiary)' }}>Peak Focus</p>
                  <p className="text-xl font-black" style={{ color: 'var(--info)' }}>AM</p>
                </div>
                <div className="border-x" style={{ borderColor: 'var(--border-color)' }}>
                  <p className="text-[10px] font-black uppercase tracking-widest mb-2" style={{ color: 'var(--text-tertiary)' }}>Top Day</p>
                  <p className="text-xl font-black" style={{ color: 'var(--success)' }}>TUE</p>
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest mb-2" style={{ color: 'var(--text-tertiary)' }}>Avg Daily</p>
                  <p className="text-xl font-black" style={{ color: 'var(--accent-secondary)' }}>3.2h</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
