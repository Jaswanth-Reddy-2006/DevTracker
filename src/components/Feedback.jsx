import { useNavigate } from 'react-router-dom'
import Card from './ui/Card'
import Button from './ui/Button'
import { useState } from 'react'

export default function Feedback() {
  const navigate = useNavigate()
  const [rating, setRating] = useState(0)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
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
        <div className="max-w-3xl mx-auto">
          <header className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce"></span>
              <span className="text-[9px] font-black text-blue-500 uppercase tracking-[0.3em]">Feedback_Channel_Active</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-none mb-6">
              SHARE YOUR <br />
              <span className="text-gradient">THOUGHTS.</span>
            </h1>
            <p className="text-lg text-[var(--text-secondary)] font-medium max-w-xl mx-auto leading-relaxed">
              Help us improve DevTracker. Your feedback is essential for our ongoing updates and feature development.
            </p>
          </header>

          {submitted ? (
            <Card glass className="p-16 text-center border-2 border-blue-500/20 animate-fadeIn relative overflow-hidden">
              <div className="absolute inset-0 bg-blue-500/5 animate-pulse pointer-events-none"></div>
              <div className="w-20 h-20 bg-blue-500/10 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-blue-500/20">
                <svg className="w-10 h-10 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <h3 className="text-3xl font-black uppercase tracking-tight mb-4">Feedback Received</h3>
              <p className="text-[var(--text-secondary)] font-medium mb-8">Thank you for sharing your insights. We&apos;ll use your feedback to make the platform even better.</p>
              <Button onClick={() => navigate('/')} variant="primary" className="px-10 py-4 text-[10px] uppercase tracking-widest">Return Home</Button>
            </Card>
          ) : (
            <Card glass className="p-10 border border-[var(--border-color)]">
              <form onSubmit={handleSubmit} className="space-y-10">
                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-500 block text-center">Satisfaction Level</label>
                  <div className="flex justify-center gap-4">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setRating(i)}
                        className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-black transition-all duration-300 border-2 ${
                          rating >= i 
                            ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-500/20 scale-110' 
                            : 'bg-[var(--bg-tertiary)] border-[var(--border-color)] text-[var(--text-secondary)] hover:border-blue-500/50'
                        }`}
                      >
                        {i}
                      </button>
                    ))}
                  </div>
                  <div className="flex justify-between px-4 text-[8px] font-black text-[var(--text-tertiary)] uppercase tracking-widest">
                    <span>Needs Improvement</span>
                    <span>Excellent</span>
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-dashed border-[var(--border-color)]">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-[0.3em] text-blue-500 ml-1">Category</label>
                    <select className="w-full bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-bold text-sm">
                      <option>Task Management</option>
                      <option>User Interface</option>
                      <option>Squad Features</option>
                      <option>Performance & Speed</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-[0.3em] text-blue-500 ml-1">Comments</label>
                    <textarea 
                      placeholder="Share your experience or suggest improvements..." 
                      rows="6" 
                      className="w-full bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-bold text-sm resize-none"
                      required
                    ></textarea>
                  </div>
                </div>

                <Button type="submit" variant="primary" disabled={rating === 0} className="w-full py-5 text-[11px] font-black uppercase tracking-[0.3em] shadow-xl shadow-blue-500/20 disabled:opacity-50 disabled:grayscale">Submit Feedback</Button>
              </form>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}
