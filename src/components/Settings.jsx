import { useContext } from 'react'
import { AppContext } from '../context/AppContext'
import Card from './ui/Card'
import Button from './ui/Button'
import ThemeToggle from './ThemeToggle'

export default function Settings() {
  const { settings = {}, updateSettings, logout } = useContext(AppContext)

  const handleSettingChange = (key, value) => {
    if (updateSettings) {
      updateSettings({ [key]: value })
    }
  }

  return (
    <div className="min-h-screen p-4 md:p-8 transition-colors duration-300">
      <div className="max-w-5xl mx-auto">
        {/* Header Section */}
        <div className="mb-12 animate-slideUp">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <h1 className="text-4xl font-black tracking-tighter" style={{ color: 'var(--text-primary)' }}>
                SYSTEM_CONFIG
              </h1>
              <p className="text-[10px] font-black uppercase tracking-[0.3em]" style={{ color: 'var(--text-tertiary)' }}>
                Mainframe Protocols & User Preferences
              </p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 animate-fadeIn">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-3 hidden lg:block space-y-2">
            {[
              { label: 'General', color: 'blue' },
              { label: 'Preferences', color: 'indigo' },
            ].map((item, idx) => (
              <button 
                key={idx}
                className={`w-full text-left px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  idx === 0 ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'hover:bg-[var(--bg-tertiary)] opacity-60 hover:opacity-100'
                }`}
              >
                {item.label}_Config
              </button>
            ))}
            
            <div className="mt-12 pt-8 border-t border-[var(--border-color)]">
              <Button 
                variant="secondary" 
                onClick={logout} 
                className="w-full text-red-500 hover:bg-red-500/10 border-red-500/20 text-[10px] font-black uppercase tracking-widest"
              >
                Terminate_Session
              </Button>
            </div>
          </div>

          <div className="lg:col-span-9 space-y-8">
            {/* Preferences Settings */}
            <section id="interface">
              <h2 className="text-sm font-black mb-4 uppercase tracking-[0.3em] text-indigo-500 flex items-center gap-2">
                <span className="w-8 h-px bg-indigo-500"></span> Preferences
              </h2>
              <Card padding={true} className="space-y-0 border-[var(--border-color)] divide-y divide-dashed divide-[var(--border-color)]">
                <div className="py-6 first:pt-0">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-black text-sm uppercase tracking-tight" style={{ color: 'var(--text-primary)' }}>Visual Theme</h4>
                      <p className="text-xs font-bold mt-1" style={{ color: 'var(--text-tertiary)' }}>Toggle between light and dark modes</p>
                    </div>
                    <div className="p-1.5 bg-[var(--bg-tertiary)] rounded-2xl border border-[var(--border-color)] shadow-inner">
                      <ThemeToggle />
                    </div>
                  </div>
                </div>

                <div className="py-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-black text-sm uppercase tracking-tight" style={{ color: 'var(--text-primary)' }}>System Language</h4>
                      <p className="text-xs font-bold mt-1" style={{ color: 'var(--text-tertiary)' }}>Primary display language</p>
                    </div>
                    <select 
                      value={settings?.language || 'English'}
                      onChange={(e) => handleSettingChange('language', e.target.value)}
                      className="bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded-xl px-6 py-3 text-[10px] font-black uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-blue-500/30 text-[var(--text-primary)] cursor-pointer hover:border-blue-500/50 transition-all"
                    >
                      <option>English</option>
                      <option>Spanish</option>
                      <option>French</option>
                      <option>German</option>
                      <option>Japanese</option>
                    </select>
                  </div>
                </div>
              </Card>
            </section>

            <section id="feedback">
              <h2 className="text-sm font-black mb-4 uppercase tracking-[0.3em] text-rose-500 flex items-center gap-2">
                <span className="w-8 h-px bg-rose-500"></span> Signal_Report
              </h2>
              <Card padding={true} className="border-[var(--border-color)]">
                <textarea 
                  placeholder="Submit system feedback..."
                  className="w-full bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded-xl p-4 text-[11px] font-bold focus:outline-none focus:ring-2 focus:ring-rose-500/30 text-[var(--text-primary)] min-h-[100px] mb-4 hover:border-rose-500/50 transition-all"
                ></textarea>
                <Button variant="primary" className="w-full bg-rose-600 hover:bg-rose-700 shadow-lg shadow-rose-500/20 text-[10px] font-black uppercase tracking-widest">Transmit_Signal</Button>
              </Card>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
