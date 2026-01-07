import { useNavigate } from 'react-router-dom'
import Card from './ui/Card'
import Button from './ui/Button'
import { useState } from 'react'

export default function Contact() {
  const navigate = useNavigate()
  const [sent, setSent] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setSent(true)
  }

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
        <div className="max-w-4xl mx-auto">
          <header className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
              <span className="text-[9px] font-black text-blue-500 uppercase tracking-[0.3em]">Channel_Open</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-none mb-6">
              CONTACT <br />
              <span className="text-gradient">OUR TEAM.</span>
            </h1>
            <p className="text-lg text-[var(--text-secondary)] font-medium max-w-xl mx-auto leading-relaxed">
              Have questions or feedback? Reach out to us and we&apos;ll get back to you as soon as possible.
            </p>
          </header>

          {sent ? (
            <Card glass className="p-16 text-center border-2 border-green-500/20 animate-fadeIn">
              <div className="w-20 h-20 bg-green-500/10 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-green-500/20">
                <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
              </div>
              <h3 className="text-3xl font-black uppercase tracking-tight mb-4">Message Sent</h3>
              <p className="text-[var(--text-secondary)] font-medium mb-8">We&apos;ve received your message. Our team will review it and get back to you shortly.</p>
              <Button onClick={() => setSent(false)} variant="secondary" className="px-10 py-4 text-[10px] uppercase tracking-widest">Send Another</Button>
            </Card>
          ) : (
            <div className="grid md:grid-cols-3 gap-8">
              <div className="md:col-span-2">
                <Card glass className="p-10 border border-[var(--border-color)]">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[9px] font-black uppercase tracking-[0.3em] text-blue-500 ml-1">Name</label>
                        <input type="text" placeholder="Your Name" className="w-full bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-bold text-sm" required />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[9px] font-black uppercase tracking-[0.3em] text-blue-500 ml-1">Email</label>
                        <input type="email" placeholder="email@example.com" className="w-full bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-bold text-sm" required />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase tracking-[0.3em] text-blue-500 ml-1">Subject</label>
                      <select className="w-full bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-bold text-sm appearance-none">
                        <option>General Inquiry</option>
                        <option>Technical Support</option>
                        <option>Collaboration</option>
                        <option>Other</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase tracking-[0.3em] text-blue-500 ml-1">Message</label>
                      <textarea placeholder="How can we help you?" rows="5" className="w-full bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-bold text-sm resize-none" required></textarea>
                    </div>
                    <Button type="submit" variant="primary" className="w-full py-5 text-[11px] font-black uppercase tracking-[0.3em] shadow-xl shadow-blue-500/20">Send Message</Button>
                  </form>
                </Card>
              </div>

              <div className="space-y-6">
                <Card glass className="p-8 border border-[var(--border-color)]">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-500 mb-4">Direct Contact</h4>
                  <p className="text-sm font-bold text-[var(--text-secondary)] mb-1 uppercase tracking-tighter">Email</p>
                  <p className="text-sm font-black text-blue-500 uppercase tracking-tighter mb-4">hello@devtracker.io</p>
                  
                  <p className="text-sm font-bold text-[var(--text-secondary)] mb-1 uppercase tracking-tighter">Office</p>
                  <p className="text-sm font-black text-blue-500 uppercase tracking-tighter">+1 (888) 010-3388</p>
                </Card>

                <Card glass className="p-8 border border-[var(--border-color)]">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-500 mb-4">Location</h4>
                  <p className="text-xs font-bold leading-relaxed text-[var(--text-secondary)] uppercase tracking-tight">
                    Mainframe Avenue<br />
                    Palo Alto, CA 94301
                  </p>
                </Card>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
