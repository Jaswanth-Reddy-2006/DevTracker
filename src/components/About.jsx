import { useNavigate } from 'react-router-dom'
import Card from './ui/Card'

export default function About() {
  const navigate = useNavigate()

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
        <header className="max-w-4xl mb-16">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-1 h-8 bg-blue-500 rounded-full"></div>
            <h2 className="text-[10px] font-black text-blue-500 uppercase tracking-[0.4em]">Our Mission</h2>
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-none mb-6">
            EMPOWERING <br />
            <span className="text-gradient">DEVELOPERS.</span>
          </h1>
          <p className="text-xl text-[var(--text-secondary)] font-medium leading-relaxed max-w-2xl">
            DevTracker provides a streamlined experience for developers to manage tasks, collaborate with teams, and understand their productivity.
          </p>
        </header>

        <div className="grid md:grid-cols-2 gap-8">
          <Card glass className="p-10 border border-[var(--border-color)]">
            <h3 className="text-2xl font-black uppercase tracking-tight mb-6 text-blue-500">The Vision</h3>
            <p className="text-lg leading-relaxed text-[var(--text-secondary)] font-medium">
              We believe in a workflow that is transparent and data-driven. Our goal is to create a platform that helps developers focus on what matters most—writing great code.
            </p>
          </Card>

          <Card glass className="p-10 border border-[var(--border-color)]">
            <h3 className="text-2xl font-black uppercase tracking-tight mb-6 text-indigo-500">Core Values</h3>
            <p className="text-lg leading-relaxed text-[var(--text-secondary)] font-medium">
              Simplicity, efficiency, and collaboration. We design every feature with these principles in mind, ensuring a seamless experience for individual developers and large squads alike.
            </p>
          </Card>
        </div>

        <section className="mt-20">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
            <h2 className="text-[10px] font-black uppercase tracking-[0.3em]">Our Principles</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: "Simplicity", desc: "Minimalist design that focuses on the core developer experience." },
              { title: "Privacy", desc: "Your data is yours. We prioritize security and privacy in everything we build." },
              { title: "Collaboration", desc: "Built for teams to work together effectively and transparently." }
            ].map((item, i) => (
              <div key={i} className="p-8 rounded-2xl bg-[var(--bg-secondary)]/30 border border-[var(--border-color)] backdrop-blur-sm">
                <div className="text-blue-500 font-black text-3xl mb-4">0{i+1}</div>
                <h4 className="text-lg font-black uppercase tracking-tight mb-2">{item.title}</h4>
                <p className="text-sm text-[var(--text-secondary)] font-medium leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
