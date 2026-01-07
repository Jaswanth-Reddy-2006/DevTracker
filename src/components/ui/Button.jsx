export default function Button({ children, variant = 'primary', className = '', ...props }) {
  const baseStyles = 'px-6 py-3 rounded-xl font-black transition-all duration-300 flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-widest text-[10px]'

  const variants = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 transform hover:-translate-y-0.5',
    secondary: 'bg-[var(--bg-tertiary)] border border-[var(--border-color)] text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] hover:border-blue-500/50 shadow-sm',
    danger: 'bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-500/20 hover:shadow-red-500/40 transform hover:-translate-y-0.5',
    ghost: 'bg-transparent text-[var(--text-secondary)] hover:text-blue-500 hover:bg-blue-500/5',
    outline: 'bg-transparent border-2 border-[var(--border-color)] text-[var(--text-primary)] hover:border-blue-500 hover:text-blue-500 hover:bg-blue-500/5',
  }

  return (
    <button className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  )
}
