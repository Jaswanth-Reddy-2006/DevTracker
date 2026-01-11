import { useState, useContext } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { auth, googleProvider } from '../firebase'
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth'
import Button from './ui/Button'
import Card from './ui/Card'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { login } = useContext(AppContext)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      const user = userCredential.user
      login({
        uid: user.uid,
        name: user.displayName || email.split('@')[0],
        email: user.email,
        avatar: user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.uid}`
      })
      navigate('/dashboard')
    } catch (err) {
      console.error('Login error:', err)
      setError(err.message)
    }
  }

  const handleGoogleLogin = async () => {
    setError('')
    try {
      const result = await signInWithPopup(auth, googleProvider)
      const user = result.user
      login({
        uid: user.uid,
        name: user.displayName,
        email: user.email,
        avatar: user.photoURL
      })
      navigate('/dashboard')
    } catch (err) {
      console.error('Google login error:', err)
      setError(err.message)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[var(--bg-primary)] relative overflow-hidden">
      <div className="scanline"></div>
      <div className="absolute inset-0 mainframe-grid opacity-20 pointer-events-none"></div>
      
      <div className="w-full max-w-md animate-fadeIn relative z-10">
        <div className="text-center mb-10">
          <div className="inline-block p-4 rounded-3xl bg-blue-500/10 mb-6 border border-blue-500/20 relative">
            <div className="absolute inset-0 rounded-3xl bg-blue-500/5 animate-pulse"></div>
            <svg className="w-12 h-12 text-blue-500 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h1 className="text-5xl font-black text-gradient tracking-tighter mb-3 uppercase">DevTracker</h1>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-70" style={{ color: 'var(--text-tertiary)' }}>Team Collaboration Platform</p>
        </div>
        
        <Card padding={true} className="border border-[var(--border-color)] shadow-2xl backdrop-blur-xl bg-[var(--bg-secondary)]/60 relative overflow-hidden group">
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-500"></div>
          
          <div className="mb-8 flex items-center justify-between">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/40"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/40"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-green-500/40"></div>
            </div>
            <div className="text-[9px] font-black text-blue-500 uppercase tracking-widest opacity-50">Secure Authentication</div>
          </div>

          {error && (
            <div className="mb-6 animate-shake bg-red-500/10 border border-red-500/20 p-4 rounded-2xl">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                <span className="text-[9px] font-black text-red-500 uppercase tracking-widest">Error</span>
              </div>
              <p className="text-[10px] text-red-500/80 font-bold uppercase tracking-tighter leading-tight">{error}</p>
            </div>
          )}
          
          <Button 
            onClick={handleGoogleLogin} 
            variant="secondary" 
            className="w-full py-4 flex items-center justify-center gap-3 border-[var(--border-color)] hover:border-blue-500/50 transition-all mb-8 bg-blue-500/5 hover:bg-blue-500/10 group/btn"
          >
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 group-hover/btn:scale-110 transition-transform" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              <span className="font-black text-[10px] uppercase tracking-[0.2em] group-hover/btn:tracking-[0.25em] transition-all text-[var(--text-primary)]">Continue with Google</span>
            </div>
          </Button>

          <div className="relative mb-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[var(--border-color)] opacity-50"></div>
            </div>
            <div className="relative flex justify-center text-[9px] uppercase tracking-[0.3em] font-black">
              <span className="px-4 bg-[var(--bg-secondary)] text-[var(--text-tertiary)] rounded-full">Or use email</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-[9px] font-black uppercase tracking-[0.3em] mb-2 px-1 text-[var(--text-secondary)]">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[var(--bg-tertiary)]/50 border border-[var(--border-color)] rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all text-[var(--text-primary)] font-bold text-sm tracking-tight"
                placeholder="name@example.com"
                required
              />
            </div>
            <div>
              <label className="block text-[9px] font-black uppercase tracking-[0.3em] mb-2 px-1 text-[var(--text-secondary)]">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[var(--bg-tertiary)]/50 border border-[var(--border-color)] rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all text-[var(--text-primary)] font-bold text-sm tracking-tight"
                placeholder="••••••••"
                required
              />
            </div>
            <Button type="submit" variant="primary" className="w-full py-5 text-[11px] font-black uppercase tracking-[0.3em] shadow-xl shadow-blue-500/20 hover:scale-[1.02] active:scale-[0.98] bg-gradient-to-r from-blue-600 to-indigo-600 border-none">Sign In</Button>
          </form>
          
          <div className="mt-10 pt-8 border-t border-[var(--border-color)] text-center">
            <p className="text-[10px] font-black uppercase tracking-widest opacity-70" style={{ color: 'var(--text-secondary)' }}>
              Don't have an account? <Link to="/signup" className="text-blue-500 font-black hover:text-blue-600 transition-colors">Create Account</Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  )
}
