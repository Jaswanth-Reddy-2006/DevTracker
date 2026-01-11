import React from 'react';

/**
 * InsightCard
 * Heads-up single-line insight component with delta and action.
 * Props: { headline, delta, severity, actionLabel, onAction }
 */
export default function InsightCard({ headline, delta, severity = 'neutral', actionLabel = 'View', onAction }) {
  const severityClass = `insight-delta ${severity}`;
  return (
    <div className="card insight-card" role="article">
      <div className="insight-headline">{headline}</div>
      <div style={{display: 'flex', alignItems: 'center', gap: 12, marginTop: 8}}>
        <div className={severityClass}>{delta}%</div>
        <button className="btn btn-link" onClick={onAction}>{actionLabel}</button>
      </div>
    </div>
  );
}
