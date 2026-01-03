export default function ProgressBar({ progress = 0, animated = true, color = 'from-blue-500 to-purple-600', showLabel = true }) {
  const clampedProgress = Math.min(Math.max(progress, 0), 100)

  return (
    <div className="w-full">
      <div className="w-full h-2 rounded-full overflow-hidden border" style={{ backgroundColor: 'var(--bg-tertiary)', borderColor: 'var(--border-color)' }}>
        <div
          className={`h-full bg-gradient-to-r ${color} transition-all ${animated ? 'duration-500' : 'duration-200'}`}
          style={{ width: `${clampedProgress}%` }}
        ></div>
      </div>
      {showLabel && (
        <div className="mt-2 text-xs text-gray-400 text-right">
          {clampedProgress}%
        </div>
      )}
    </div>
  )
}
