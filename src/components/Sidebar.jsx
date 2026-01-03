import { Link, useLocation } from 'react-router-dom'

export default function Sidebar() {
  const location = useLocation()

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/tasks', label: 'Tasks', icon: '✓' },
    { path: '/groups', label: 'Groups', icon: '👥' },
    { path: '/insights', label: 'Insights', icon: '💡' },
  ]

  return (
    <div 
      className="w-64 h-screen border-r flex flex-col sticky top-0 z-50 transition-colors duration-300 shadow-2xl"
      style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-color)' }}
    >
      <div className="p-8 border-b-2 border-dashed" style={{ borderColor: 'var(--border-color)' }}>
        <h1 className="text-3xl font-black bg-gradient-to-br from-blue-400 via-indigo-500 to-purple-600 bg-clip-text text-transparent tracking-tighter">DevTracker</h1>
      </div>

      <nav className="flex-1 px-4 py-10 space-y-4">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 group relative ${
                isActive
                  ? 'bg-gradient-to-br from-blue-600 to-indigo-700 text-white font-black shadow-[0_10px_20px_rgba(37,99,235,0.2)]'
                  : 'hover:bg-blue-500/10'
              }`}
              style={!isActive ? { color: 'var(--text-secondary)' } : {}}
            >
              <span className={`text-2xl transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>{item.icon}</span>
              <span className="tracking-tight uppercase text-xs font-black">{item.label}</span>
              {isActive && (
                <div className="absolute right-3 w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
              )}
            </Link>
          )
        })}
      </nav>

      <div className="p-6 border-t-2 border-dashed" style={{ borderColor: 'var(--border-color)' }}>
        <div 
          className="rounded-2xl p-5 border-2 border-blue-500/10 transition-all duration-300 hover:border-blue-500/30"
          style={{ backgroundColor: 'var(--bg-tertiary)' }}
        >
          <p className="text-[10px] font-black uppercase tracking-widest mb-2 text-blue-500">Core Status</p>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            <p className="text-xs font-black uppercase" style={{ color: 'var(--text-primary)' }}>System Online</p>
          </div>
        </div>
      </div>
    </div>
  )
}
