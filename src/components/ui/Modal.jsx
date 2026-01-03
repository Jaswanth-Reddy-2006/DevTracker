export default function Modal({ isOpen = true, onClose, title, children }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-all duration-300">
      <div 
        className="rounded-xl border w-full max-w-md shadow-2xl animate-fadeIn overflow-hidden flex flex-col"
        style={{ 
          backgroundColor: 'var(--bg-primary)', 
          borderColor: 'var(--border-color)',
          maxHeight: '90vh'
        }}
      >
        {title && (
          <div className="flex items-center justify-between p-6 border-b" style={{ borderColor: 'var(--border-color)' }}>
            <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>{title}</h2>
            {onClose && (
              <button
                onClick={onClose}
                className="hover:opacity-70 transition-colors"
                style={{ color: 'var(--text-secondary)' }}
              >
                ✕
              </button>
            )}
          </div>
        )}
        <div className="p-6 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  )
}
