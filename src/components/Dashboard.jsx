import { useMemo } from 'react'
import Card from './ui/Card'
import ProgressBar from './ui/ProgressBar'
import { useAppData } from '../hooks/useAppData'

export default function Dashboard() {
  const { tasks, focusRatio, activities, developerScore } = useAppData()

  const activeTasks = useMemo(() => {
    return (tasks || []).filter(t => t.status !== 'Completed').slice(0, 3)
  }, [tasks])

  const calculatedScore = useMemo(() => {
    const taskPoints = (tasks || []).reduce((sum, task) => {
      if (task.status !== 'Completed') return sum
      const points = task.difficulty === 'Hard' ? 200 : task.difficulty === 'Medium' ? 100 : 50
      return sum + points
    }, 0)
    return developerScore + taskPoints
  }, [tasks, developerScore])

  const educationalTime = useMemo(() => {
    const total = (tasks || []).reduce((sum, t) => {
      if (t.activityType === 'Reading' || t.activityType === 'Video') {
        return sum + (t.targetDuration * (t.progress / 100))
      }
      return sum
    }, 0)
    return total
  }, [tasks])

  const codingTime = useMemo(() => {
    const total = (tasks || []).reduce((sum, t) => {
      if (t.activityType === 'Coding' || t.activityType === 'Testing') {
        return sum + (t.targetDuration * (t.progress / 100))
      }
      return sum
    }, 0)
    return total
  }, [tasks])

  const formatTime = (minutes) => {
    const h = Math.floor(minutes / 60)
    const m = Math.round(minutes % 60)
    return `${h}h ${m}m`
  }

  return (
    <div className="min-h-screen p-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-black mb-8 animate-slideUp tracking-tight" style={{ color: 'var(--text-primary)' }}>Dashboard</h1>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Focus Overview Card */}
          <Card animated hover className="lg:col-span-2 md:col-span-1 border-t-4 border-t-blue-500">
            <div className="space-y-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Focus Overview</h3>
                  <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>Real-time productivity metrics</p>
                </div>
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <span className="text-xl">🎯</span>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Educational Time</span>
                    <span className="text-sm font-bold" style={{ color: 'var(--info)' }}>{formatTime(educationalTime)}</span>
                  </div>
                  <ProgressBar progress={Math.min((educationalTime / 180) * 100, 100)} color="from-blue-500 to-cyan-400" showLabel={false} />
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Coding Time</span>
                    <span className="text-sm font-bold" style={{ color: 'var(--success)' }}>{formatTime(codingTime)}</span>
                  </div>
                  <ProgressBar progress={Math.min((codingTime / 300) * 100, 100)} color="from-green-500 to-emerald-400" showLabel={false} />
                </div>

                <div className="pt-4 mt-2 border-t" style={{ borderColor: 'var(--border-color)' }}>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>Overall Focus Ratio</span>
                    <span className="text-3xl font-black bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                      {focusRatio}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Developer Score Card */}
          <Card animated hover className="lg:col-span-2 md:col-span-1 border-t-4 border-t-purple-500">
            <div className="flex flex-col items-center justify-center h-full py-2">
              <div className="relative w-32 h-32 mb-6">
                <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                  <circle cx="50" cy="50" r="45" fill="none" stroke="var(--bg-tertiary)" strokeWidth="6" />
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="url(#dashboardGradient)"
                    strokeWidth="8"
                    strokeDasharray={`${(calculatedScore / 2000) * 283} 283`}
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-out"
                  />
                  <defs>
                    <linearGradient id="dashboardGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#3b82f6" />
                      <stop offset="100%" stopColor="#a855f7" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-black" style={{ color: 'var(--text-primary)' }}>{calculatedScore}</span>
                  <span className="text-[10px] uppercase tracking-widest font-bold" style={{ color: 'var(--text-tertiary)' }}>Points</span>
                </div>
              </div>
              <h3 className="text-xl font-bold text-center" style={{ color: 'var(--text-primary)' }}>Developer Growth</h3>
              <p className="text-sm text-center mt-1" style={{ color: 'var(--text-tertiary)' }}>Level 12 • Senior Aspirant</p>
            </div>
          </Card>

          {/* Active Tasks Card */}
          <Card animated hover className="lg:col-span-2 md:col-span-2">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Priority Tasks</h3>
                <span className="text-xs font-bold px-2 py-1 rounded bg-blue-500/10 text-blue-500">Auto-Tracking</span>
              </div>
              <div className="space-y-5">
                {activeTasks && activeTasks.length > 0 ? (
                  activeTasks.map((task) => (
                    <div key={task.id} className="group cursor-pointer">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="text-sm font-bold group-hover:text-blue-500 transition-colors" style={{ color: 'var(--text-primary)' }}>{task.name}</p>
                          <p className="text-xs font-medium" style={{ color: 'var(--text-tertiary)' }}>{task.activityType} • {task.difficulty}</p>
                        </div>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-black uppercase tracking-wider ${
                          task.status === 'Completed'
                            ? 'bg-green-500/20 text-green-500'
                            : 'bg-blue-500/20 text-blue-500'
                        }`}>
                          {task.status}
                        </span>
                      </div>
                      <ProgressBar progress={task.progress} color={task.status === 'Completed' ? 'from-green-500 to-emerald-400' : 'from-blue-500 to-indigo-500'} showLabel={true} />
                    </div>
                  ))
                ) : (
                  <div className="text-center py-10 rounded-xl border-2 border-dashed" style={{ borderColor: 'var(--border-color)' }}>
                    <p className="text-sm font-medium mb-1" style={{ color: 'var(--text-tertiary)' }}>No active tasks found</p>
                    <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Start a new session to begin tracking</p>
                  </div>
                )}
              </div>
            </div>
          </Card>

          {/* Activity Detection Card */}
          <Card animated hover className="lg:col-span-2 md:col-span-2">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Live Activity</h3>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  <span className="text-xs font-bold uppercase tracking-wider text-green-500">Live</span>
                </div>
              </div>
              <div className="space-y-3">
                {activities && activities.length > 0 ? (
                  activities.slice(0, 4).map((activity, idx) => (
                    <div key={activity.id} className="flex items-center gap-4 p-3 rounded-xl transition-all hover:translate-x-1" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${
                          activity.type === 'active'
                            ? 'bg-green-500/20 text-green-500'
                            : activity.type === 'educational'
                            ? 'bg-blue-500/20 text-blue-500'
                            : 'bg-red-500/20 text-red-500'
                        }`}
                      >
                        {activity.type === 'active' ? '💻' : activity.type === 'educational' ? '📚' : '⚠️'}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{activity.activity}</p>
                        <p className="text-[10px] font-medium" style={{ color: 'var(--text-tertiary)' }}>Just now • Verified</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-10" style={{ color: 'var(--text-tertiary)' }}>
                    Waiting for activity...
                  </div>
                )}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
