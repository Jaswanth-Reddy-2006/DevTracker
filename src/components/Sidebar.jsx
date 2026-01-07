import { Link, useLocation } from 'react-router-dom'

export default function Sidebar() {
  const location = useLocation()

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg> },
    { path: '/tasks', label: 'Tasks', icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg> },
    { path: '/groups', label: 'Squads', icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg> },
    { path: '/insights', label: 'Insights', icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg> },
    { path: '/tracking', label: 'Tracking', icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg> },
    { path: '/settings', label: 'Config', icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg> },
  ]

  return (
    <div 
      className="w-72 h-screen border-r flex flex-col sticky top-0 z-50 transition-all duration-500 shadow-xl relative overflow-hidden"
      style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}
    >
      <div className="absolute inset-0 mainframe-grid opacity-5 pointer-events-none"></div>
      
      <div className="p-8 flex items-center gap-3 relative z-10">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center shadow-lg shadow-blue-500/30 group cursor-pointer">
          <svg className="w-6 h-6 text-white group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <div>
          <h1 className="text-2xl font-black bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent tracking-tighter uppercase leading-none">DevTracker</h1>
          <p className="text-[8px] font-black text-blue-500/50 uppercase tracking-[0.4em] mt-1">Mainframe_v1.0</p>
        </div>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 group relative ${
                isActive
                  ? 'bg-blue-500 text-white font-black shadow-lg shadow-blue-500/20'
                  : 'hover:bg-blue-500/10 text-[var(--text-secondary)] hover:text-blue-500'
              }`}
            >
              <span className={`transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>{item.icon}</span>
              <span className="text-sm font-bold tracking-wide">{item.label}</span>
              {isActive && (
                <div className="absolute right-4 w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
              )}
            </Link>
          )
        })}
      </nav>

      <div className="p-6 relative z-10">
        <div className="rounded-2xl p-6 bg-[var(--bg-tertiary)] border border-[var(--border-color)] text-[var(--text-primary)] shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl group-hover:bg-blue-500/10 transition-colors"></div>
          <div className="relative z-10">
            <p className="text-[9px] font-black uppercase tracking-[0.3em] mb-3 text-blue-500">System_Status</p>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-[9px] font-bold uppercase tracking-widest text-[var(--text-tertiary)]">Connection</span>
                <span className="text-[9px] font-black uppercase text-green-500">Stable</span>
              </div>
              <div className="h-1 w-full bg-[var(--bg-secondary)] rounded-full overflow-hidden">
                <div className="h-full w-full bg-green-500 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.4)]"></div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[9px] font-bold uppercase tracking-widest text-[var(--text-tertiary)]">Environment</span>
                <span className="text-[9px] font-black uppercase text-blue-500">Production</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
