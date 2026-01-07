import { useNavigate } from 'react-router-dom'
import { useState, useEffect, useContext } from 'react'
import { AppContext } from '../context/AppContext'

export default function LandingPage() {
  const [isVisible, setIsVisible] = useState(false)
  const navigate = useNavigate()
  const { isAuthenticated } = useContext(AppContext)

  useEffect(() => {
    setIsVisible(true)
    if (isAuthenticated) {
      const timer = setTimeout(() => navigate('/dashboard'), 500)
      return () => clearTimeout(timer)
    }
  }, [isAuthenticated, navigate])

  return (
    <div 
      className="min-h-screen transition-colors duration-700 overflow-hidden relative font-sans"
      style={{ 
        backgroundColor: 'var(--bg-primary)',
        color: 'var(--text-primary)'
      }}
    >
      <div className="scanline"></div>
      {/* Mainframe Grid Overlay */}
      <div className="absolute inset-0 z-0 mainframe-grid opacity-10 pointer-events-none"></div>
      
      {/* Ambient Glows */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute -top-[10%] -left-[5%] w-[40rem] h-[40rem] bg-blue-500/20 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute -bottom-[10%] -right-[5%] w-[45rem] h-[45rem] bg-indigo-500/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-50 flex justify-between items-center px-6 md:px-12 py-6 backdrop-blur-md border-b border-[var(--border-color)] bg-[var(--bg-primary)]/50">
        <div className="flex items-center gap-3 group cursor-pointer" onClick={() => navigate('/')}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:rotate-12 transition-transform">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
          </div>
          <span className="text-2xl font-black tracking-tighter text-gradient">DEVTRACKER</span>
        </div>
        <div className="flex items-center gap-4 md:gap-8">
          <button onClick={() => navigate('/how-to-use')} className="text-[10px] font-black uppercase tracking-[0.2em] hover:text-blue-500 transition-colors hidden lg:block">How it Works</button>
          <button onClick={() => navigate('/about')} className="text-[10px] font-black uppercase tracking-[0.2em] hover:text-blue-500 transition-colors hidden lg:block">About</button>
          <button onClick={() => navigate('/login')} className="text-[10px] font-black uppercase tracking-[0.2em] hover:text-blue-500 transition-colors hidden md:block">Login</button>
          <button onClick={() => navigate('/signup')} className="text-[10px] font-black uppercase tracking-[0.2em] px-6 py-3 rounded-xl bg-blue-600 text-white shadow-xl shadow-blue-500/20 hover:bg-blue-700 transition-all transform hover:-translate-y-1">Get Started</button>
        </div>
      </nav>

      <main className="relative z-10 container mx-auto px-6 pt-24 pb-32">
        <div className={`text-center max-w-5xl mx-auto ${isVisible ? 'animate-slideUp' : 'opacity-0'}`}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 mb-8 backdrop-blur-xl">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-500">Productivity Ecosystem Active</span>
          </div>
          
          <h1 className="text-5xl md:text-8xl font-black mb-8 tracking-tighter leading-[0.95] text-[var(--text-primary)]">
            TRACK WORK. <br />
            <span className="text-gradient">BOOST FOCUS.</span>
          </h1>
          
          <p className="text-lg md:text-xl mb-12 max-w-2xl mx-auto font-medium leading-relaxed text-[var(--text-secondary)]">
            A minimalist productivity ecosystem for developers. Track your tasks, collaborate with your squad, and get detailed insights into your daily workflow.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={() => navigate('/signup')}
              className="group relative bg-blue-600 text-white font-black py-5 px-10 rounded-2xl text-[11px] uppercase tracking-[0.2em] transition-all duration-300 transform hover:scale-105 shadow-2xl shadow-blue-500/40 hover:bg-blue-700 flex items-center gap-3 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              Start Tracking
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
            </button>
            <button
              onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })}
              className="py-5 px-10 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] transition-all duration-300 border-2 border-[var(--border-color)] hover:border-blue-500/30 backdrop-blur-xl bg-[var(--bg-secondary)]/30 hover:bg-[var(--bg-secondary)]/50"
            >
              View Features
            </button>
          </div>
        </div>

      </main>

      <section id="features" className="relative z-10 container mx-auto px-6 py-20">
        <div className="grid md:grid-cols-3 gap-6 md:gap-10">
          {[
            {
              title: "Task Management",
              desc: "Organize your workflow with a powerful, minimalist task queue designed for developer focus.",
              icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />,
              accent: "blue"
            },
            {
              title: "Squad Collaboration",
              desc: "Join forces with your team. Create squads, share objectives, and track collective progress.",
              icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />,
              accent: "indigo"
            },
            {
              title: "Data Insights",
              desc: "Gain deep insights into your productivity with automated charts and performance metrics.",
              icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />,
              accent: "purple"
            }
          ].map((feature, i) => (
            <div 
              key={i}
              className={`group rounded-3xl p-10 border border-[var(--border-color)] transition-all duration-500 hover:translate-y-[-8px] hover:shadow-3xl bg-[var(--bg-secondary)]/40 backdrop-blur-xl relative overflow-hidden ${isVisible ? 'animate-slideUp' : 'opacity-0'}`}
              style={{ animationDelay: `${i * 0.15}s` }}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-blue-500/10 transition-colors"></div>
              
              <div className={`w-14 h-14 bg-${feature.accent}-500 flex items-center justify-center rounded-2xl mb-8 shadow-lg shadow-${feature.accent}-500/20 group-hover:rotate-6 transition-transform`}>
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">{feature.icon}</svg>
              </div>
              
              <h3 className="text-xl font-black uppercase tracking-tight mb-4" style={{ color: 'var(--text-primary)' }}>{feature.title}</h3>
              <p className="leading-relaxed font-medium text-base opacity-80" style={{ color: 'var(--text-secondary)' }}>{feature.desc}</p>
              
              <div className="mt-8 pt-6 border-t border-[var(--border-color)] opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-500">Learn More →</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <footer className="relative z-10 container mx-auto px-6 py-24 border-t border-[var(--border-color)]">
        <div className="flex flex-col md:flex-row justify-between items-start gap-12">
          <div className="max-w-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-lg">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </div>
              <span className="text-xl font-black tracking-tighter text-gradient">DEVTRACKER</span>
            </div>
            <p className="text-xs font-bold uppercase tracking-widest text-[var(--text-tertiary)] leading-loose">
              Setting the gold standard for engineering metrics and decentralized accountability.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-12 md:gap-24">
            <div className="flex flex-col gap-4">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-500">Resources</span>
              <button onClick={() => navigate('/how-to-use')} className="text-left text-[10px] font-black uppercase tracking-widest opacity-60 hover:opacity-100 hover:text-blue-500 transition-all">How it Works</button>
              <button onClick={() => navigate('/about')} className="text-left text-[10px] font-black uppercase tracking-widest opacity-60 hover:opacity-100 hover:text-blue-500 transition-all">About Us</button>
              <button onClick={() => navigate('/feedback')} className="text-left text-[10px] font-black uppercase tracking-widest opacity-60 hover:opacity-100 hover:text-blue-500 transition-all">Feedback</button>
            </div>
            <div className="flex flex-col gap-4">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-500">Support</span>
              <button onClick={() => navigate('/contact')} className="text-left text-[10px] font-black uppercase tracking-widest opacity-60 hover:opacity-100 hover:text-blue-500 transition-all">Contact Us</button>
              <a href="#" className="text-left text-[10px] font-black uppercase tracking-widest opacity-60 hover:opacity-100 hover:text-blue-500 transition-all">Help Center</a>
            </div>
            <div className="flex flex-col gap-4">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-500">Connect</span>
              <a href="#" className="text-left text-[10px] font-black uppercase tracking-widest opacity-60 hover:opacity-100 hover:text-blue-500 transition-all">Twitter / X</a>
              <a href="#" className="text-left text-[10px] font-black uppercase tracking-widest opacity-60 hover:opacity-100 hover:text-blue-500 transition-all">GitHub</a>
            </div>
          </div>
        </div>
        
        <div className="mt-24 pt-12 border-t border-dashed border-[var(--border-color)] flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[9px] font-black uppercase tracking-[0.4em] text-[var(--text-tertiary)]">
            &copy; {new Date().getFullYear()} DEVTRACKER. ALL RIGHTS RESERVED.
          </p>
          <div className="flex gap-4">
            <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]"></div>
            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-green-500">System Online</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
