import Sidebar from './Sidebar'
import TopBar from './TopBar'

export default function Layout({ children, user }) {
  return (
    <div className="flex h-screen transition-colors duration-300" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar user={user} />
        <div className="flex-1 overflow-auto">
          <div className="transition-colors duration-300 min-h-full" style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
