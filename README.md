# NEXUS — A Living Digital Playground

An immersive, scroll-controlled 3D website built with React, React Three Fiber, and Three.js.

## Features

- **Scroll-linked cinematic journey** — camera travels through distinct dimensions as you scroll
- **Interactive 3D experiments** — gravity field, drag-rotation, and morph lab
- **Specimen gallery** — four distinct interactive objects with keyboard-accessible detail views
- **Dynamic theme system** — switch between Void, Ember, Ice, and Cosmos color palettes
- **Reduced motion support** — respects both OS-level and user toggled settings
- **Responsive design** — works across desktop, tablet, and mobile
- **WebGL fallback** — gracefully degrades without WebGL
- **Lazy 3D loading** — the background scene, gallery, and lab canvases load independently

## Tech Stack

- React 19 + TypeScript
- Vite 7
- Tailwind CSS v4
- React Three Fiber 9 + Three.js 0.178
- @react-three/drei 10
- Motion 12 (Framer Motion successor)
- Lenis smooth scroll
- Zustand for state management
- Lucide React icons

## Getting Started

```bash
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173) in your browser.

## Commands

- `npm run dev` — start dev server with HMR
- `npm run build` — build for production
- `npm run preview` — preview production build
- `npm run lint` — run ESLint
- `npm run typecheck` — run TypeScript type checking
- `npm run test:e2e` — run Playwright browser checks (Chromium)

Playwright requires its Chromium browser; install it with `npx playwright install chromium`.

## Architecture notes

The background canvas stays mounted while the page scrolls. Lenis, scroll measurement, and the camera share the canvas frame loop; interactive lab and gallery canvases mount only when needed. Settings remain in the Zustand store and are applied to both CSS and scene materials. See [DECISIONS.md](DECISIONS.md) for the tradeoffs and verified limits.

No paid services or external runtime APIs are used.

## Browser targets

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

Only Chromium was exercised in this pass; the other targets are not yet verified.

## Deployment

### Cloudflare Pages

1. Push code to a Git repository
2. Import the repository in Cloudflare Pages
3. Build command: `npm run build`
4. Build output directory: `dist`
5. Deploy

### GitHub Pages

```bash
# After building
npx gh-pages -d dist
```

## Project Structure

```
src/
├── app/                # App entry
├── components/         # Reusable components
│   ├── three/         # 3D scene components
│   ├── ui/            # UI primitives
│   ├── layout/        # Layout components
│   ├── experiments/   # Interactive experiments
│   └── gallery/       # Gallery overlay
├── sections/          # Page sections
├── hooks/             # Custom React hooks
├── state/             # Shared state (Zustand)
├── lib/               # Library wrappers (Lenis)
├── utils/             # Utility functions
├── config/            # Site configuration
└── styles/            # Global styles
```

## License

MIT License — see LICENSE file for details.
