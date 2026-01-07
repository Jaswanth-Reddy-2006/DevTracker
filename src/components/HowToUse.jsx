import { useNavigate } from 'react-router-dom'
import Card from './ui/Card'

export default function HowToUse() {
  const navigate = useNavigate()

  const steps = [
    {
      id: "01",
      title: "Create Account",
      desc: "Sign up with your email or Google account to start your productivity journey.",
      details: ["Register via Email or Google", "Set up your profile", "Choose your focus area"]
    },
    {
      id: "02",
      title: "Add Your Tasks",
      desc: "Populate your personal task queue. Organize work by difficulty and activity type.",
      details: ["Categorize by task type", "Set difficulty levels", "Define clear objectives"]
    },
    {
      id: "03",
      title: "Collaborate",
      desc: "Join a squad or create your own to collaborate with other developers on shared goals.",
      details: ["Create or join squads", "Share group objectives", "Track team progress"]
    },
    {
      id: "04",
      title: "Track Progress",
      desc: "Monitor your daily achievements and productivity trends through visual charts and scores.",
      details: ["View daily mission logs", "Analyze efficiency index", "Check achievements"]
    }
  ]

  return (
    <div className="min-h-screen transition-colors duration-700 overflow-hidden relative font-sans bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <div className="scanline"></div>
      <div className="absolute inset-0 z-0 mainframe-grid opacity-10 pointer-events-none"></div>

      {/* Navigation */}
      <nav className="relative z-50 flex justify-between items-center px-6 md:px-12 py-6 backdrop-blur-md border-b border-[var(--border-color)] bg-[var(--bg-primary)]/50">
        <div className="flex items-center gap-3 group cursor-pointer" onClick={() => navigate('/')}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:rotate-12 transition-transform">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
          </div>
          <span className="text-2xl font-black tracking-tighter text-gradient uppercase">DevTracker</span>
        </div>
        <button onClick={() => navigate('/login')} className="text-[10px] font-black uppercase tracking-[0.2em] px-6 py-3 rounded-xl bg-blue-600 text-white shadow-xl shadow-blue-500/20 hover:bg-blue-700 transition-all">Login</button>
      </nav>

      <main className="relative z-10 container mx-auto px-6 pt-20 pb-32">
        <header className="max-w-4xl mb-20">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-1 h-8 bg-blue-500 rounded-full"></div>
            <h2 className="text-[10px] font-black text-blue-500 uppercase tracking-[0.4em]">Getting Started</h2>
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-none mb-6">
            HOW IT <br />
            <span className="text-gradient">WORKS.</span>
          </h1>
          <p className="text-xl text-[var(--text-secondary)] font-medium max-w-2xl leading-relaxed">
            Follow these simple steps to start tracking your work and collaborating with your team.
          </p>
        </header>

        <div className="space-y-12">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              {index !== steps.length - 1 && (
                <div className="absolute left-10 top-20 bottom-0 w-0.5 border-l-2 border-dashed border-blue-500/20 hidden md:block"></div>
              )}
              <div className="flex flex-col md:flex-row gap-12 items-start">
                <div className="w-20 h-20 rounded-3xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-2xl font-black text-blue-500 shrink-0 shadow-lg shadow-blue-500/5">
                  {step.id}
                </div>
                <div className="flex-1 pt-4">
                  <h3 className="text-3xl font-black uppercase tracking-tight mb-4">{step.title}</h3>
                  <p className="text-lg text-[var(--text-secondary)] font-medium mb-8 leading-relaxed max-w-3xl">
                    {step.desc}
                  </p>
                  <div className="grid sm:grid-cols-3 gap-6">
                    {step.details.map((detail, i) => (
                      <Card key={i} glass className="p-6 border border-[var(--border-color)]">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                          <span className="text-[9px] font-black uppercase tracking-widest text-blue-500">Step_0{i+1}</span>
                        </div>
                        <p className="text-[11px] font-black uppercase tracking-tight text-[var(--text-primary)]">
                          {detail}
                        </p>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
