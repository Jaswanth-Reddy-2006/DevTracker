# DevTracker - Application Preview Guide

## 🚀 Quick Start

**Dev Server URL**: http://localhost:5174  
**Status**: ✅ Running and Ready

---

## 📋 What You're Looking At

### App Architecture

```
App.jsx (Router)
├── / (Landing Page)
│   └── LandingPage.jsx
│       ├── Hero Section (Animated Title)
│       └── Features Grid (3 Cards)
│
└── /dashboard (Dashboard + Layout)
    ├── Layout.jsx
    │   ├── Sidebar.jsx
    │   │   ├── Logo: "DevTracker"
    │   │   ├── Nav Buttons: Dashboard, Tasks, Groups, Insights
    │   │   └── Status Indicator: "Intelligence Engine Online"
    │   │
    │   ├── TopBar.jsx
    │   │   ├── User Avatar (Circle with initials)
    │   │   ├── Username: "Student Developer"
    │   │   ├── Badge: "Developer Score: 742"
    │   │   └── Status Dot: "Tracking Active" (pulsing)
    │   │
    │   └── Dashboard.jsx
    │       ├── Focus Overview Card
    │       │   ├── Educational Time: 2h 20m (70% progress)
    │       │   ├── Entertainment Time: 35m (30% progress)
    │       │   └── Focus Ratio: 87% (auto-incrementing)
    │       │
    │       ├── Developer Growth Score Card
    │       │   ├── Circular Progress Ring (SVG)
    │       │   ├── Score Display: 742+ (auto-incrementing)
    │       │   └── Subtitle: "Calculated from verified actions"
    │       │
    │       ├── Active Tasks Card
    │       │   ├── Task 1: "Solve 10 LeetCode problems" (Coding)
    │       │   ├── Task 2: "Watch DSA videos" (Video)
    │       │   ├── Task 3: "Read System Design notes" (Reading)
    │       │   └── Each with progress bar (auto-incrementing)
    │       │
    │       └── Activity Detection Card
    │           ├── Live feed entries (4 max)
    │           ├── Color-coded: Green (Active), Blue (Educational), Red (Distraction)
    │           └── Pulsing animation on latest entry
```

---

## 🎨 Visual Design Elements

### Color Scheme
- **Background**: Deep dark (`#0f0f14`)
- **Primary Gradient**: Blue → Purple (`from-blue-500 to-purple-600`)
- **Accent Colors**: 
  - Green: Active/Coding (`#10b981`)
  - Blue: Educational (`#3b82f6`)
  - Red: Distraction (`#ef4444`)

### Components

#### Cards
- Glassmorphism effect (backdrop blur + transparency)
- Semi-transparent background with border
- Smooth hover effects (lift + opacity increase)
- Border: `border-white/10` to `border-white/20` on hover

#### Progress Bars
- Gradient backgrounds
- Smooth CSS transitions
- Show percentage label below

#### Buttons
- Gradient backgrounds
- Hover scale effect (105%)
- Shadow animations

#### Sidebar
- Persistent vertical navigation
- Active state with left gradient border
- Navigation items with icons and labels

#### TopBar
- Fixed sticky position
- Gradient background with backdrop blur
- User avatar circle with initials
- Pulsing green dot for "Tracking Active"

---

## 🎬 Animations & Interactions

### Load Animations
- **Landing Page**: Hero fades in (0-1s), features stagger (0.3s-0.7s delays)
- **Dashboard Cards**: Fade in smoothly with border effects

### Auto-Updating Metrics
- **Focus Ratio**: Updates every 5 seconds (+0-2%)
- **Task Progress**: Updates every 2-5 seconds (+5-15%)
- **Developer Score**: Updates every 8-12 seconds (+1-5)
- **Activity Feed**: New entry every 10 seconds

### Interactive Elements
- **Hover on Cards**: Opacity increases, background lightens
- **Hover on Buttons**: Scale effect (1.05x)
- **Sidebar Links**: Active state shows gradient indicator
- **Progress Bars**: Smooth width transitions (duration: 500ms)
- **Pulsing Animation**: Latest activity entry has pulse effect

---

## 🧪 Testing Checklist

### Landing Page Tests
- [ ] Hero section fades in on load
- [ ] Three feature cards appear with staggered delays
- [ ] "Open Dashboard" button is clickable
- [ ] Clicking button navigates to /dashboard
- [ ] Feature cards have hover lift effect
- [ ] Page is responsive (check on mobile, tablet, desktop)

### Dashboard Tests
- [ ] Sidebar appears on left with "DevTracker" logo
- [ ] TopBar appears at top with user info
- [ ] Four main cards are visible:
  - [ ] Focus Overview (Educational + Entertainment time)
  - [ ] Developer Growth Score (circular ring)
  - [ ] Active Tasks (3 tasks with progress)
  - [ ] Activity Detection (live feed)
- [ ] Focus Ratio number increases every 5 seconds
- [ ] Task progress bars move every 2-5 seconds
- [ ] Developer Score number increases every 8-12 seconds
- [ ] Activity entries appear and disappear
- [ ] Cards have glassmorphism effect
- [ ] Cards respond to hover (opacity increases)

### Navigation Tests
- [ ] Sidebar navigation buttons exist
- [ ] Current page is highlighted in sidebar
- [ ] Back to landing page button available
- [ ] URL changes when navigating (/dashboard, /, etc.)

### Browser Console Tests
- [ ] Open DevTools (F12)
- [ ] Check Console tab
- [ ] Verify NO red error messages
- [ ] Verify NO warnings (except React StrictMode dev messages)
- [ ] Check Network tab: All requests successful
- [ ] Check Performance: Smooth animations (60 FPS)

### Responsive Design Tests
- [ ] Mobile (375px width): 
  - [ ] Sidebar collapses or hides
  - [ ] Cards stack vertically
  - [ ] Text remains readable
- [ ] Tablet (768px width):
  - [ ] 2-column grid layout
  - [ ] All cards visible
- [ ] Desktop (1920px width):
  - [ ] 4-column grid layout
  - [ ] All cards properly spaced

---

## 📊 Expected Behavior Timeline

### On Page Load
```
0ms    ↓ Page loads
234ms  ↓ Dev server ready
500ms  ↓ Hero section visible
700ms  ↓ Feature cards visible
       ↓ Dashboard loads (if /dashboard)
       ↓ Sidebar + TopBar render
       ↓ Four dashboard cards render
       ↓ All intervals start
```

### During Viewing
```
Every 5s    → Focus Ratio +0-2%
Every 2-5s  → Task progress +5-15%
Every 8-12s → Developer Score +1-5
Every 10s   → Activity feed updates
Continuous  → Smooth CSS transitions
```

---

## 🔧 Manual Testing Commands

### Check Dev Server Status
```bash
# Dev server should be running
# Expected: http://localhost:5174
```

### Run Linting
```bash
npm run lint
# Expected: ✓ 0 errors, 0 warnings
```

### Build for Production
```bash
npm run build
# Expected: ✓ built in ~600ms
```

### Preview Production Build
```bash
npm run preview
# Then visit http://localhost:4173
```

---

## 🐛 Debugging Tips

### If Something Looks Off
1. **Check Console** (F12): Look for red errors
2. **Check Network**: Verify no failed requests
3. **Hard Refresh** (Ctrl+Shift+R): Clear cache
4. **Restart Dev Server**: Stop and run `npm run dev` again

### Common Issues
| Issue | Solution |
|---|---|
| Sidebar missing | Check Layout component is wrapped around Dashboard |
| Metrics not updating | Check browser console for errors in intervals |
| Animations stuttering | Check Performance tab for dropped frames |
| Progress bars not visible | Check ProgressBar component opacity/background |
| TopBar user not showing | Verify mockUser object passed to Layout |

---

## 📱 Screen Size Breakpoints

| Size | Tailwind | Use Case |
|---|---|---|
| <640px | sm | Mobile phones |
| 640-768px | md | Tablets (portrait) |
| 768-1024px | lg | Tablets (landscape) |
| 1024-1280px | xl | Small laptops |
| >1280px | 2xl | Desktop monitors |

**App Responsive Breakpoints**:
- Grid changes from 2 cols (md) to 4 cols (lg)
- Cards stack on mobile
- Sidebar might hide on very small screens (can be added later)

---

## ✅ Quality Checklist

- ✅ ESLint: 0 errors, 0 warnings
- ✅ Build: Successful in 613ms
- ✅ Dependencies: All installed
- ✅ Imports: All validated
- ✅ File structure: Organized
- ✅ Memory cleanup: useEffect cleanups in place
- ✅ Type safety: React conventions followed
- ✅ Performance: No console errors expected

---

## 🎯 Next Steps

Once you've verified the current state:
1. **Phase 2**: Build remaining dashboard cards
2. **Phase 3**: Tasks page with auto-completion
3. **Phase 4**: Groups page with leaderboard
4. **Phase 5**: Insights page with typing animation
5. **Phase 6**: Polish and final testing

---

**Last Updated**: January 3, 2026  
**Status**: Ready for Testing ✅
