import { useState, useContext } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { auth, googleProvider } from '../firebase'
import { createUserWithEmailAndPassword, updateProfile, signInWithPopup } from 'firebase/auth'
import Button from './ui/Button'
import Card from './ui/Card'

export default function SignUp() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [error, setError] = useState('')
  const { login } = useContext(AppContext)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password)
      const user = userCredential.user
      
      await updateProfile(user, { displayName: formData.name })
      
      login({
        uid: user.uid,
        name: formData.name,
        email: user.email,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.name}`,
      })
      navigate('/dashboard')
    } catch (err) {
      console.error('Signup error:', err)
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
    <div className="min-h-screen flex items-center justify-center p-6 bg-[var(--bg-primary)]">
      <div className="w-full max-w-md animate-fadeIn">
        <div className="text-center mb-10">
          <div className="inline-block p-4 rounded-3xl bg-indigo-500/10 mb-6">
            <svg className="w-12 h-12 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <h1 className="text-5xl font-black text-gradient tracking-tighter mb-3 uppercase">Squad_Grid</h1>
          <p className="text-[10px] font-black uppercase tracking-[0.3em]" style={{ color: 'var(--text-tertiary)' }}>Collective_Intelligence_Network</p>
        </div>
        
        <Card padding={true} className="border border-[var(--border-color)] shadow-2xl backdrop-blur-xl bg-[var(--bg-secondary)]/40 relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-indigo-600 to-purple-600"></div>
          
          {error && <p className="mb-6 text-[10px] text-red-500 font-black uppercase tracking-widest bg-red-500/10 p-4 rounded-2xl border border-red-500/20 animate-shake">{error}</p>}
          
          <Button 
            onClick={handleGoogleLogin} 
            variant="secondary" 
            className="w-full py-4 flex items-center justify-center gap-3 border-[var(--border-color)] hover:border-indigo-500/50 transition-all mb-8 bg-white dark:bg-slate-900"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            <span className="font-black text-[10px] uppercase tracking-[0.2em]">Sync with Google_Auth</span>
          </Button>

          <div className="relative mb-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-dashed border-[var(--border-color)]"></div>
            </div>
            <div className="relative flex justify-center text-[9px] uppercase tracking-[0.3em] font-black">
              <span className="px-4 bg-[var(--bg-secondary)] text-[var(--text-tertiary)]">Manual_Link_Required</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[9px] font-black uppercase tracking-[0.3em] mb-2 px-1 text-indigo-500">Legal_Identity</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50 transition-all text-[var(--text-primary)] font-bold text-sm tracking-tight"
                placeholder="OPERATOR_NAME"
                required
              />
            </div>
            <div>
              <label className="block text-[9px] font-black uppercase tracking-[0.3em] mb-2 px-1 text-indigo-500">Email_Identity</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50 transition-all text-[var(--text-primary)] font-bold text-sm tracking-tight"
                placeholder="USER_ID@MAINFRAME.IO"
                required
              />
            </div>
            <div>
              <label className="block text-[9px] font-black uppercase tracking-[0.3em] mb-2 px-1 text-indigo-500">Secure_Access_Key</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className="w-full bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50 transition-all text-[var(--text-primary)] font-bold text-sm tracking-tight"
                placeholder="••••••••"
                required
              />
            </div>
            <Button type="submit" variant="primary" className="w-full py-5 text-[11px] font-black uppercase tracking-[0.3em] bg-gradient-to-r from-indigo-600 to-purple-600 border-none mt-6 shadow-xl shadow-indigo-500/20 hover:scale-[1.02] active:scale-[0.98]">Initialize_Identity</Button>
          </form>
          
          <div className="mt-10 pt-8 border-t border-dashed border-[var(--border-color)] text-center">
            <p className="text-[10px] font-black uppercase tracking-widest" style={{ color: 'var(--text-secondary)' }}>
              Already registered? <Link to="/login" className="text-indigo-500 font-black hover:text-indigo-600 transition-colors">Return_to_Base</Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  )
}
