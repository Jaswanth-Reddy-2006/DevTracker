import Sidebar from './Sidebar'
import TopBar from './TopBar'

export default function Layout({ children, user }) {
  return (
    <div className="flex h-screen transition-colors duration-500 bg-[var(--bg-primary)] overflow-hidden font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden relative">
        <div className="scanline"></div>
        {/* Mainframe background grid */}
        <div className="absolute inset-0 mainframe-grid opacity-10 pointer-events-none"></div>
        
        <TopBar user={user} />
        <main className="flex-1 overflow-auto flex flex-col relative z-0 custom-scrollbar">
          <div className="p-4 md:p-8 lg:p-12 transition-all duration-500 flex-1 relative z-10">
            <div className="max-w-[1600px] mx-auto animate-fadeIn">
              {children}
            </div>
          </div>
          
          <footer className="py-4 px-8 border-t border-[var(--border-color)] bg-[var(--bg-secondary)]/30 backdrop-blur-xl flex flex-col sm:flex-row justify-between items-center gap-4 relative z-20">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-600 shadow-[0_0_8px_rgba(37,99,235,0.4)]"></div>
                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[var(--text-tertiary)]">
                  DevTrack • v1.0.4
                </p>
              </div>
              <div className="h-4 w-px bg-[var(--border-color)] hidden sm:block"></div>
              <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[var(--text-tertiary)] hidden sm:block">
                System Health: 99.9%
              </p>
            </div>
            
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-color)]">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                <p className="text-[9px] font-black uppercase tracking-widest text-green-500">System Online</p>
              </div>
              <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[var(--text-tertiary)] opacity-40">
                &copy; {new Date().getFullYear()}
              </p>
            </div>
          </footer>
        </main>
      </div>
    </div>
  )
}
