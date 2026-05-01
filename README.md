# Meridian Mastery

An interactive Progressive Web App for learning Korean meridian pressure points through flashcards, body maps, quizzes, and progress tracking. Built for Kuk Sool Won practitioners and students of traditional Korean medicine.

**Live App:** [merdianmastery.netlify.app](https://merdianmastery.netlify.app)

---

## Features

**Flashcard System** — 400+ meridian points with Korean names (Hangul), romanized pronunciation, English translations, healing functions, and martial applications. Tap-to-flip cards with element-based color coding (Fire, Earth, Metal, Water, Wood).

**Interactive Body Map** — Front, back, and side anatomical views with clickable acupuncture points. Select a meridian to see its pathway and tap individual points for detail cards.

**Quiz System** — Multiple quiz types covering Korean translations, healing properties, martial applications, and meridian identification. Adaptive difficulty with progress-based question selection.

**Progress Tracking** — Session history, per-point success rates, flagging system for difficult points, and performance analytics.

**Study Modes** — Study by individual meridian channel, by Maek pressure point sets (Chi Ki and Cha Ki), or shuffle all points for comprehensive review.

**Offline Support** — Full PWA with service worker caching. Install on any device and study without internet.

## Currently Implemented Meridians

| Meridian | Element | Points |
|----------|---------|--------|
| Lung (LU) | Metal | 11 |
| Large Intestine (LI) | Metal | 20 |
| Heart (HT) | Fire | 9 |
| Stomach (ST) | Earth | 45 |

The data architecture supports all 12 primary meridians plus extraordinary vessels. Additional meridians are added by creating JSON data files in `public/improved/`.

## Tech Stack

- **React 18** with hooks-based component architecture
- **Vite 4** for development and production builds
- **Tailwind CSS** for responsive, mobile-first design
- **PWA** with service worker for offline functionality

## Project Structure

```
src/
├── main.jsx              # App entry point
├── App.jsx               # Root component and routing
├── index.css             # Global styles
├── components/           # React components
│   ├── Flashcard.jsx     # Flashcard with pronunciation guide
│   ├── Quiz.jsx          # Quiz engine
│   ├── QuizSelection.jsx # Quiz type selector
│   ├── BodyMapInteractiveNew.jsx  # Body map with point overlay
│   ├── Header.jsx        # App header
│   ├── Navigation.jsx    # Navigation controls
│   ├── ProgressDashboard.jsx  # Progress analytics
│   ├── SettingsModal.jsx # User settings
│   └── ...
├── utils/                # Helper functions
│   ├── pronunciationHelper.js
│   ├── progressTracker.js
│   └── dataLoaderOptimized.js
└── data/                 # Static data files
    ├── flashcards.js
    ├── acupuncturePoints.js
    └── quizzes.js

public/
└── improved/             # Meridian JSON data and body map images
    ├── lung_meridian_with_regions.json
    ├── lung_meridian_mobile.json
    ├── large_intestine_meridian_with_regions.json
    ├── heart_meridian_with_regions.json
    └── [body map images]
```

## Setup

```bash
# Clone
git clone https://github.com/pizzachris/Meridian-Mastery.git
cd Meridian-Mastery

# Install dependencies
npm install

# Development server
npm run dev

# Production build
npm run build
npm run preview
```

Requires Node.js 18+.

## Deployment

Auto-deploys to Netlify from the `main` branch. Also compatible with Vercel, GitHub Pages, or any static host.

## Data Format

Each meridian is defined as a JSON file with point coordinates, Korean names, English translations, healing functions, and martial applications. See existing files in `public/improved/` for the structure.

## License

MIT
