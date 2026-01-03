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
