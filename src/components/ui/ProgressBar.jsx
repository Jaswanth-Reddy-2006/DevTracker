export default function ProgressBar({ progress = 0, animated = true, color = 'from-blue-600 to-indigo-500', showLabel = true }) {
  const clampedProgress = Math.min(Math.max(progress, 0), 100)

  return (
    <div className="w-full">
      <div className="w-full h-1.5 rounded-full overflow-hidden bg-[var(--bg-tertiary)] border border-[var(--border-color)]">
        <div
          className={`h-full bg-gradient-to-r ${color} transition-all ${animated ? 'duration-1000' : 'duration-200'} shadow-[0_0_8px_rgba(37,99,235,0.3)]`}
          style={{ width: `${clampedProgress}%` }}
        ></div>
      </div>
      {showLabel && (
        <div className="mt-2 flex justify-between items-center">
          <div className="flex gap-1">
            <div className={`w-1 h-1 rounded-full ${clampedProgress === 100 ? 'bg-green-500' : 'bg-blue-500'}`}></div>
            <div className={`w-1 h-1 rounded-full ${clampedProgress > 50 ? 'bg-blue-500' : 'bg-blue-500/20'}`}></div>
            <div className={`w-1 h-1 rounded-full ${clampedProgress > 80 ? 'bg-blue-500' : 'bg-blue-500/20'}`}></div>
          </div>
          <span className="text-[9px] font-black uppercase tracking-widest opacity-60">
            {clampedProgress}% COMPLETE
          </span>
        </div>
      )}
    </div>
  )
}
