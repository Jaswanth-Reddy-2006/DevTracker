import React from 'react'

function Sparkline({points = [2,4,3,6,5,6,7]}){
  const max = Math.max(...points)
  const d = points.map((p,i)=>`${i*10},${100 - (p/max)*80}`).join(' ')
  return (
    <svg className="w-24 h-6" viewBox="0 0 70 24" preserveAspectRatio="none">
      <polyline fill="none" stroke="#60A5FA" strokeWidth="2" points={d} />
    </svg>
  )
}

export default function SkillTable(){
  const skills = [
    {name: 'Data Structures', mastery: 72, lastActive: '2 days ago', trend: 3},
    {name: 'Algorithms', mastery: 58, lastActive: '12 days ago', trend: -18},
    {name: 'System Design', mastery: 40, lastActive: '9 days ago', trend: 5},
    {name: 'Databases', mastery: 64, lastActive: '4 days ago', trend: 2},
  ]

  return (
    <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold">Skill Overview</h3>
        <div className="text-sm text-[var(--text-tertiary)]">Sorted by weakness</div>
      </div>

      <div className="space-y-3">
        {skills.map(s=> (
          <div key={s.name} className="flex items-center justify-between p-3 bg-[var(--bg-primary)]/0 rounded-md">
            <div className="flex items-center gap-4">
              <div className="w-48">
                <div className="text-sm font-semibold">{s.name}</div>
                <div className="text-[11px] text-[var(--text-tertiary)]">Last active: {s.lastActive}</div>
              </div>
              <Sparkline />
            </div>

            <div className="text-right">
              <div className="text-xl font-extrabold">{s.mastery}%</div>
              <div className={`text-sm ${s.trend >= 0 ? 'text-green-500' : 'text-red-500'}`}>{s.trend >=0 ? '▲' : '▼'} {Math.abs(s.trend)}%</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
