import React from 'react'

function Trend({delta}){
  const up = delta >= 0
  return (
    <span className={`inline-flex items-center text-sm ${up ? 'text-green-500' : 'text-red-500'}`}>
      {up ? '▲' : '▼'} {Math.abs(delta)}%
    </span>
  )
}

export default function KPIRow() {
  const kpis = [
    {label: 'Completed Tasks (30d)', value: 42, delta: 12},
    {label: 'Active Days (30d)', value: 18, delta: 4},
    {label: 'Current Streak', value: 5, delta: -1}
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {kpis.map((k) => (
        <div key={k.label} className="bg-[var(--bg-secondary)] border border-[var(--border-color)] p-4 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-medium text-[var(--text-tertiary)]">{k.label}</div>
              <div className="text-2xl font-extrabold text-[var(--text-primary)]">{k.value}</div>
            </div>
            <div className="text-right">
              <Trend delta={k.delta} />
              <div className="text-[10px] text-[var(--text-tertiary)]">vs previous period</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
