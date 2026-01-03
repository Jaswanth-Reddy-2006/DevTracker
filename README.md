# DevTracker

DevTracker is a lightweight task-tracking web application built with React and Vite. It is prepared for judges and easy deployment to Vercel.

## Live Demo
Deploy to Vercel (recommended). After import, use build command `npm run build` and output directory `dist`.

## Highlights
- Group tasks by project
- Dashboard with progress visualization
- Light/dark theme toggling
- Local storage persistence (no backend required)

## Tech Stack
- React 18 + Vite
- Tailwind CSS for styling

## Quick Start (Local)
1. Install dependencies

```bash
npm install
```

2. Run development server

```bash
npm run dev
```

3. Build for production

```bash
npm run build
```

4. Preview production build

```bash
npm run preview
```

## For Judges
- The app runs fully in the browser; no server setup required.
- Build output is placed in `dist/` and ready for static hosting.
- See `vercel.json` for Vercel-ready configuration.

## Project Structure (important files)
- `src/` — application source code
- `index.html` — Vite entry
- `vercel.json` — Vercel build config
- `package.json` — scripts and metadata

## Notes
- CI is configured via GitHub Actions at `.github/workflows/ci.yml` (runs `npm ci` + `npm run build`).

## License
MIT — see `LICENSE`

---
If you'd like, I can add screenshots, a short demo video, or a one-page judging checklist to this repo.

## About this application

DevTracker is a client-side task tracker that helps organize tasks into groups and visualize progress.

- Data model: tasks have a title, description, group, priority, and completion state.
- Storage: all data is stored in the browser's `localStorage` so no backend is required.
- Main UI pieces:
	- `Sidebar` — navigation and group filters
	- `Dashboard` — progress summary and charts
	- `Tasks` — list and task operations (add/edit/complete)
	- `AddTaskModal` — create new tasks
	- `ThemeToggle` — light/dark mode

## How it works (brief)

1. The app initializes state from `localStorage` via a context provider in `src/context/AppContext.jsx`.
2. User actions (add/edit/complete) dispatch actions located in `src/context/actions.js` which update context state.
3. State changes are synchronized back to `localStorage` so data persists across reloads.
4. UI components read context state to render lists, groupings, and progress bars.

## Run locally

## Overview

DevTracker helps users create and manage tasks organized into groups. It emphasizes simplicity and offline-first operation by storing data in the browser, so users can track progress without a backend.

### Key features
- Group tasks into projects or categories
- Create, edit, and complete tasks
- Priority and description fields per task
- Progress visualization on a dashboard
- Light / dark theme toggle

### How it works (brief)
- All application state is managed client-side and persisted to the browser's `localStorage`.
- Components read and update a central context that holds tasks and groups.

### Intended audience
DevTracker is ideal for students, judges, and small teams who want a simple, self-contained demo of a task-tracking app.
