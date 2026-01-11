import React from 'react'
import KPIRow from './KPIRow'
import SkillTable from './SkillTable'
import KPICard from '../ui/KPICard'
import InsightCard from '../ui/InsightCard'
import SkillHeatmap from '../ui/SkillHeatmap'
import '../../styles/analytics.css'

export default function AnalyticsMock(){
  return (
    <div className="min-h-screen p-6 md:p-10 bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <div className="max-w-[1500px] mx-auto">
        <header className="flex items-center justify-between mb-6">
          <div>
            <div className="text-2xl font-bold">Analytics — DevTracker</div>
            <div className="text-sm text-[var(--text-tertiary)]">Analysis-first dashboard • Last 30 days</div>
          </div>
        </header>

        <div className="kpi-row">
          <KPICard label="Completed Tasks" value={124} delta={5} deltaSign="+" />
          <KPICard label="Active Days" value={18} delta={-2} deltaSign="" />
          <KPICard label="Current Streak" value={5} />
        </div>

        <div style={{display: 'flex', gap: 12, marginBottom: 12}}>
          <div style={{flex: 1}}>
            <InsightCard headline={'DSA progress down 18% this week'} delta={-18} severity={'negative'} actionLabel={'Drill'} onAction={() => alert('Open DSA drill')} />
          </div>
          <div style={{width: 320}}>
            <InsightCard headline={'Overall velocity up 5% vs last month'} delta={5} severity={'positive'} actionLabel={'View trend'} onAction={() => alert('Open velocity')} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <SkillHeatmap data={[
              { skill: 'Algorithms', cells: new Array(14).fill(0).map((_,i)=>({date: `D${i+1}`, count: Math.round(Math.random()*2), level: Math.floor(Math.random()*5)})) },
              { skill: 'System Design', cells: new Array(14).fill(0).map((_,i)=>({date: `D${i+1}`, count: Math.round(Math.random()*2), level: Math.floor(Math.random()*5)})) },
              { skill: 'Databases', cells: new Array(14).fill(0).map((_,i)=>({date: `D${i+1}`, count: Math.round(Math.random()*2), level: Math.floor(Math.random()*5)})) },
            ]} onCellClick={(skill, cell)=> alert(`${skill} ${cell.date} sessions:${cell.count}`)} />

            <SkillTable />

            <div className="mt-6 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg p-4">
              <h3 className="text-lg font-bold mb-2">Weekly Velocity</h3>
              <div className="h-40 flex items-end gap-2">
                {[3,5,6,4,7,6,8].map((v,i)=> (
                  <div key={i} className="flex-1">
                    <div className="bg-blue-600 rounded-t-md" style={{height: `${v*10}px`}}></div>
                    <div className="text-[10px] text-center mt-1">W{i+1}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <aside className="space-y-4">
            <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg p-4">
              <h4 className="font-bold">Neglected Skills</h4>
              <div className="mt-3 text-sm text-[var(--text-tertiary)]">Algorithms — last active 12 days ago</div>
              <div className="mt-2 text-sm text-[var(--text-tertiary)]">System Design — last active 9 days ago</div>
              <button className="mt-4 w-full bg-blue-600 text-white py-2 rounded-md">Create Focus Task</button>
            </div>

            <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg p-4">
              <h4 className="font-bold">Consistency</h4>
              <div className="text-sm text-[var(--text-tertiary)] mt-2">Current streak: <strong>5</strong> days</div>
              <div className="mt-3 text-sm">Active days this month: <strong>18</strong> / 30</div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
