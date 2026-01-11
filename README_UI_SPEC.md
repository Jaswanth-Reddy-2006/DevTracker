# DevTracker — UI Spec (One-page wireframe & component list)

## Purpose
Small, focused UI spec to guide the analytics redesign. Analysis-first, professional, minimal.

## Page Layout
- Header: compact controls (product name, time-range selector, profile)
- KPI Row: Completed Tasks | Active Days | Current Streak
- Top Insights: 2–3 callout cards (alerts + action)
- Main split: Skill Overview (left) + Heatmap / Sidebar (right)
- Trends: Weekly velocity graph + monthly overlay
- Consistency: calendar + streak metric
- Neglected skills + quick remediation

## Component list
- `KPIRow` — big numbers + small delta
- `InsightCard` — headline, short metric, CTA
- `SkillTable` — sortable rows with sparkline + mastery %
- `SkillHeatmap` — matrix with hover details
- `WeeklyVelocity` — bar chart with line overlay
- `ConsistencyCalendar` — calendar cells and streak indicator
- `NeglectedList` — ranked skills with suggested actions

## Color & Typography
- Neutral slate backgrounds, muted blue accent (#2563EB), caution amber (#F59E0B), red for declines (#EF4444)
- Inter or system UI, sizes: H1 28–32px, H2 18–20px, body 13–14px

## Interaction notes
- Time-range in header affects all panels
- Drill: skill row -> detailed pane (tasks + timeline)
- Alerts surface when drop &gt; 10% WoW or last active &gt; 7 days

---

This README is intentionally concise to act as a single-page spec for implementing the analytics UI.
