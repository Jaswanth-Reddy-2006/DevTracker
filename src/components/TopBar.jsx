import { useAppData } from '../hooks/useAppData'
import { useMemo, useContext } from 'react'
import { AppContext } from '../context/AppContext'

export default function TopBar({ user }) {
  const { developerScore, tasks } = useAppData()
  const { theme, toggleTheme } = useContext(AppContext)

  const calculatedScore = useMemo(() => {
    const taskPoints = (tasks || []).reduce((sum, task) => {
      if (task.status !== 'Completed') return sum
      const points = task.difficulty === 'Hard' ? 200 : task.difficulty === 'Medium' ? 100 : 50
      return sum + points
    }, 0)
    return developerScore + taskPoints
  }, [tasks, developerScore])

  return (
    <header 
      className="h-24 backdrop-blur-xl border-b flex items-center justify-between px-10 sticky top-0 z-40 transition-all duration-500"
      style={{ 
        backgroundColor: 'rgba(var(--bg-secondary-rgb), 0.8)', 
        borderColor: 'var(--border-color)',
      }}
    >
      <div className="flex items-center gap-6">
        <div className="flex flex-col">
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-500 mb-0.5 opacity-70">Workspace</span>
          <div className="flex items-center gap-2">
            <span className="text-sm font-black text-[var(--text-primary)] uppercase tracking-tighter">Main Terminal</span>
            <div className="px-1.5 py-0.5 rounded bg-blue-500/10 border border-blue-500/20">
              <span className="text-[8px] font-black text-blue-500 tabular-nums">NODE_ID: {Math.floor(Math.random() * 9000) + 1000}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-6">
        <button 
          onClick={toggleTheme}
          className="p-3 rounded-2xl bg-[var(--bg-tertiary)]/50 border border-[var(--border-color)] text-[var(--text-primary)] hover:border-blue-500/50 transition-all shadow-sm group"
        >
          {theme === 'light' ? (
            <svg className="w-5 h-5 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
          ) : (
            <svg className="w-5 h-5 group-hover:rotate-90 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.364l-.707.707M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
          )}
        </button>

        <div className="hidden md:flex items-center gap-4 pl-6 border-l border-[var(--border-color)]">
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-black uppercase tracking-widest text-[var(--text-tertiary)] mb-0.5 opacity-70">Experience</span>
            <div className="flex items-center gap-2">
              <span className="text-xl font-black text-blue-500 tabular-nums leading-none">{calculatedScore}</span>
              <div className="flex flex-col gap-0.5">
                <div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce"></div>
                <div className="w-1 h-1 bg-blue-500/50 rounded-full"></div>
              </div>
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center shadow-lg shadow-blue-500/20 relative overflow-hidden group">
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <svg className="w-6 h-6 text-white relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
          </div>
        </div>

        <div className="flex items-center gap-4 pl-6 border-l border-[var(--border-color)]">
          <div className="text-right hidden sm:block">
            <div className="font-black text-sm text-[var(--text-primary)] tracking-tight">{user?.name || 'Guest Developer'}</div>
            <div className="text-[10px] font-black uppercase tracking-widest text-green-500 flex items-center justify-end gap-1.5 opacity-80">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
              Connected
            </div>
          </div>
          <div className="w-14 h-14 rounded-[var(--radius-xl)] overflow-hidden shadow-xl ring-2 ring-blue-500/20 hover:ring-blue-500/50 transition-all duration-300 cursor-pointer">
            <img 
              src={user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.uid || 'Guest'}`} 
              alt={user?.name} 
              className="w-full h-full object-cover" 
            />
          </div>
        </div>
      </div>
    </header>
  )
}
