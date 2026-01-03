export default function Card({ children, className = '', animated = false, hover = false, padding = true }) {
  return (
    <div
      className={`backdrop-blur-md rounded-2xl border transition-all duration-300 ${
        animated ? 'animate-scaleIn' : ''
      } ${
        hover ? 'hover:shadow-2xl hover:border-[var(--accent-primary)]/50 hover:-translate-y-1' : ''
      } ${padding ? 'p-6' : ''} ${className}`}
      style={{
        backgroundColor: 'var(--bg-secondary)',
        borderColor: 'var(--border-color)',
        color: 'var(--text-primary)'
      }}
    >
      {children}
    </div>
  )
}
