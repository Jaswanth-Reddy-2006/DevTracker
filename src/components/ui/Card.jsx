export default function Card({ children, className = '', animated = false, hover = false, padding = true, glass = false }) {
  return (
    <div
      className={`${glass ? 'glass' : ''} rounded-3xl border transition-all duration-300 ${
        animated ? 'animate-scaleIn' : ''
      } ${
        hover ? 'hover:shadow-xl hover:border-blue-500/30 hover:-translate-y-1' : 'shadow-sm'
      } ${padding ? 'p-6 md:p-8' : ''} ${className}`}
      style={{
        backgroundColor: glass ? undefined : 'var(--bg-secondary)',
        borderColor: 'var(--border-color)',
        color: 'var(--text-primary)'
      }}
    >
      {children}
    </div>
  )
}
