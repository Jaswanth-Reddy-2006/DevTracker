import React from 'react';

/**
 * SkillHeatmap
 * Lightweight, accessible heatmap grid for skills x days.
 * Props: { data: [{ skill: string, cells: [{date, count, level}] }], onCellClick }
 */
export default function SkillHeatmap({ data = [], onCellClick }) {
  return (
    <div className="card skill-heatmap" role="region" aria-label="Skill heatmap">
      <div className="insight-headline">Skill Heatmap</div>
      <div className="heat-grid" style={{marginTop: 12}}>
        {data.map((row) => (
          <div className="heat-row" key={row.skill} style={{display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8}}>
            <div className="skill-name" style={{width: 140}}>{row.skill}</div>
            <div className="cells" style={{display: 'flex', gap: 4}}>
              {row.cells.map((c, i) => {
                const level = Math.min(4, Math.max(0, c.level || 0));
                const cls = `heat-cell heat-${level}`;
                return (
                  <button
                    key={i}
                    className={cls}
                    onClick={() => onCellClick && onCellClick(row.skill, c)}
                    aria-label={`${row.skill} ${c.date} ${c.count} sessions`}
                    style={{width: 16, height: 16, borderRadius: 2, border: 'none'}}
                  />
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
