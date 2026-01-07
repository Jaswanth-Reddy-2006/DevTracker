export default function Modal({ isOpen = true, onClose, title, children }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-md z-[100] flex items-center justify-center p-4 transition-all duration-300">
      <div 
        className="rounded-[2.5rem] border w-full max-w-lg shadow-2xl animate-fadeIn overflow-hidden flex flex-col relative"
        style={{ 
          backgroundColor: 'var(--bg-primary)', 
          borderColor: 'var(--border-color)',
          maxHeight: '90vh'
        }}
      >
        <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-blue-600 to-indigo-600"></div>
        
        {title && (
          <div className="flex items-center justify-between p-8 border-b border-dashed" style={{ borderColor: 'var(--border-color)' }}>
            <div>
              <h2 className="text-xl font-black tracking-tighter uppercase" style={{ color: 'var(--text-primary)' }}>{title}</h2>
              <div className="flex gap-2 mt-1">
                <div className="w-8 h-1 rounded-full bg-blue-600/20"></div>
                <div className="w-4 h-1 rounded-full bg-blue-600/10"></div>
              </div>
            </div>
            {onClose && (
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-xl bg-[var(--bg-tertiary)] flex items-center justify-center hover:bg-red-500/10 hover:text-red-500 transition-all border border-[var(--border-color)]"
                style={{ color: 'var(--text-secondary)' }}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            )}
          </div>
        )}
        <div className="p-8 overflow-y-auto custom-scrollbar">
          {children}
        </div>
      </div>
    </div>
  )
}
