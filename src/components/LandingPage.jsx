import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useTheme } from '../hooks/useTheme'

export default function LandingPage() {
  const [isVisible, setIsVisible] = useState(false)
  const navigate = useNavigate()
  const { theme } = useTheme()

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <div 
      className="min-h-screen transition-colors duration-500 overflow-hidden"
      style={{ 
        background: theme === 'dark' 
          ? 'linear-gradient(to bottom right, #0f0f14, #1a1a2e, #16213e)' 
          : 'linear-gradient(to bottom right, #f8f9fa, #e9ecef, #dee2e6)',
        color: 'var(--text-primary)'
      }}
    >
      {/* Decorative background elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[100px] animate-pulse-slow"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 rounded-full blur-[100px] animate-pulse-slow"></div>

      <div className="container mx-auto px-6 py-24 relative z-10">
        <div className={`text-center ${isVisible ? 'animate-slideUp' : 'opacity-0'}`}>
          <h1 className="text-5xl md:text-8xl font-black mb-8 bg-gradient-to-r from-blue-400 via-purple-500 to-indigo-600 bg-clip-text text-transparent tracking-tight leading-tight">
            Your skills are built by actions.<br />
            <span className="text-primary italic">DevTracker</span> tracks them.
          </h1>
          <p className="text-xl md:text-2xl mb-12 max-w-3xl mx-auto font-medium" style={{ color: 'var(--text-secondary)' }}>
            An intelligent productivity ecosystem that automatically validates real-world learning activity for modern developers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={() => navigate('/dashboard')}
              className="group relative bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-4 px-10 rounded-2xl text-lg transition-all duration-300 transform hover:scale-105 shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:shadow-[0_0_30px_rgba(37,99,235,0.6)] flex items-center gap-2"
            >
              Get Started Free
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
            <button
              onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })}
              className="py-4 px-10 rounded-2xl text-lg font-bold transition-all duration-300 border border-transparent hover:border-blue-500/30 backdrop-blur-md"
              style={{ backgroundColor: 'rgba(var(--bg-secondary-rgb), 0.5)', color: 'var(--text-primary)' }}
            >
              Learn More
            </button>
          </div>
        </div>
      </div>

      <div id="features" className="container mx-auto px-6 py-20 relative z-10">
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              title: "Auto-Verified Tasks",
              desc: "Deep integration with VS Code and browser activity to verify your real learning progress.",
              icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />,
              delay: "delay-100"
            },
            {
              title: "Focus Intelligence",
              desc: "AI-driven activity classification distinguishes between distraction and deep educational work.",
              icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />,
              delay: "delay-300"
            },
            {
              title: "Group Accountability",
              desc: "Join squads to compete on leaderboards and collaborate on collective learning goals.",
              icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />,
              delay: "delay-500"
            }
          ].map((feature, i) => (
            <div 
              key={i}
              className={`group rounded-3xl p-10 border transition-all duration-500 ${isVisible ? 'animate-fadeIn' : 'opacity-0'} ${feature.delay} hover:translate-y-[-8px] hover:shadow-2xl backdrop-blur-xl`}
              style={{ 
                backgroundColor: theme === 'dark' ? 'rgba(26, 26, 46, 0.4)' : 'rgba(255, 255, 255, 0.4)', 
                borderColor: 'var(--border-color)' 
              }}
            >
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl mb-8 flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {feature.icon}
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>{feature.title}</h3>
              <p className="leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="container mx-auto px-6 py-12 text-center">
        <p className="text-lg" style={{ color: 'var(--text-tertiary)' }}>
          Built for students preparing for real-world engineering.
        </p>
      </div>
    </div>
  )
}
