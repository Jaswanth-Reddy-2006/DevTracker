import React from 'react';

/**
 * KPICard
 * Minimal, semantic KPI tile for analytics dashboard.
 * Props: { label, value, delta, deltaSign }
 */
export default function KPICard({ label, value, delta, deltaSign = '' }) {
  return (
    <div className="card kpi-card" role="group" aria-label={label}>
      <div className="kpi-meta">
        <div className="kpi-label muted">{label}</div>
      </div>
      <div className="kpi-body" style={{display: 'flex', alignItems: 'baseline', gap: '8px'}}>
        <div className="kpi-value">{value}</div>
        {typeof delta !== 'undefined' && (
          <div className="kpi-delta" aria-hidden>
            {deltaSign}{delta}%
          </div>
        )}
      </div>
    </div>
  );
}
