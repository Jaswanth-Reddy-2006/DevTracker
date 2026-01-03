import ThemeToggle from './ThemeToggle'
import { useAppData } from '../hooks/useAppData'
import { useMemo } from 'react'

export default function TopBar({ user }) {
  const { developerScore, tasks } = useAppData()

  const calculatedScore = useMemo(() => {
    const taskPoints = (tasks || []).reduce((sum, task) => {
      if (task.status !== 'Completed') return sum
      const points = task.difficulty === 'Hard' ? 200 : task.difficulty === 'Medium' ? 100 : 50
      return sum + points
    }, 0)
    return developerScore + taskPoints
  }, [tasks, developerScore])

  return (
    <div 
      className="h-20 backdrop-blur-xl border-b flex items-center justify-between px-8 sticky top-0 z-40 transition-colors duration-300"
      style={{ 
        backgroundColor: 'rgba(var(--bg-primary-rgb), 0.8)', 
        borderColor: 'var(--border-color)',
      }}
    >
      <div className="flex items-center gap-2">
        <span className="text-xs font-black uppercase tracking-[0.2em]" style={{ color: 'var(--text-tertiary)' }}>verified session</span>
      </div>
      
      <div className="flex items-center gap-8">
        <div 
          className="hidden md:flex items-center gap-4 px-5 py-2 rounded-2xl border-2 border-blue-500/10"
          style={{ backgroundColor: 'var(--bg-tertiary)' }}
        >
          <div className="flex flex-col items-end">
            <span className="text-[9px] font-black uppercase tracking-widest" style={{ color: 'var(--text-tertiary)' }}>Developer Score</span>
            <span className="text-sm font-black text-blue-500">{calculatedScore}</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
            <span className="text-xl">🏆</span>
          </div>
        </div>

        <ThemeToggle />

        <div className="flex items-center gap-4 pl-8 border-l-2 border-dashed" style={{ borderColor: 'var(--border-color)' }}>
          <div className="text-right hidden sm:block">
            <div className="font-black text-xs uppercase tracking-tight" style={{ color: 'var(--text-primary)' }}>{user.name}</div>
            <div className="text-[10px] flex items-center gap-1.5 justify-end font-bold uppercase tracking-widest text-green-500">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
              Live
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-black text-xl shadow-lg transform hover:rotate-6 transition-transform cursor-pointer">
            {user.name.charAt(0)}
          </div>
        </div>
      </div>
    </div>
  )
}
