# leo9-py.github.io

Personal resume site for **Leo Dan Peña** — a single-page application with interactive visual effects and a dynamic theming system.

**Live:** [leo9-py.github.io](https://leo9-py.github.io/)

## Features

- **Typewriter subtitle** — cycles through 100 descriptors with highlight-and-replace animation
- **Theme system** — 11 color schemes (blue, yellow, green, pink, purple, cyan, indigo, magenta, orange, brown, red) switchable via settings panel
- **Smooth transitions** — CSS `@property`-registered custom properties enable interpolated color transitions across all theme changes (0.5s)
- **Visual effects** (individually toggleable):
  - Glass blur cards with tilt-on-hover
  - Canvas particle system with HDR flash spikes
  - Pulsating text glow
  - Animated wave effect with foam particles
  - God light radial glow
- **Full-width header & footer** with fading wave/particle effects
- **Dark mode** with GitHub-inspired palette
- **Responsive** layout via MUI breakpoints
- **Open Graph / Twitter Card** meta tags for rich link previews

## Tech Stack

- **React 19** + **TypeScript**
- **Vite 6** — dev server & build
- **MUI v7** (Material UI) — component library & theming
- **Canvas API** — particles, waves, god light (all `requestAnimationFrame`-driven)
- **CSS @property** — registered color properties for smooth browser-interpolated transitions

## Project Structure

```
src/
├── App.tsx                    # Root layout, CSS variable management, theme provider
├── theme.ts                   # MUI theme configuration
├── data/
│   ├── resume.ts              # All resume content (single source of truth)
│   └── colorSchemes.ts        # 11 color scheme definitions
├── context/
│   └── SettingsContext.tsx     # Settings state (dark mode, effects toggles, color scheme)
├── hooks/
│   └── useColorScheme.ts      # Color scheme hook
├── utils/
│   └── color.ts               # Hex/RGB conversion, lighten/darken helpers
├── components/
│   ├── Header.tsx             # Hero section with typewriter, tilt card, contact info
│   ├── Summary.tsx            # Professional summary
│   ├── Experience.tsx         # Work experience timeline
│   ├── OpenSource.tsx         # Open source contributions
│   ├── Skills.tsx             # Technical skills grid
│   ├── Education.tsx          # Education section
│   ├── SectionTitle.tsx       # Reusable section header
│   ├── SettingsPanel.tsx      # Floating settings panel (effects + theme swatches)
│   └── effects/
│       ├── ParticleCanvas.tsx # Rising particle system with flash/glow
│       ├── WaveEffect.tsx     # Animated wave layers with foam
│       ├── GodLight.tsx       # Radial light overlay
│       └── GlassCard.tsx      # Frosted glass card wrapper
```

## Development

```bash
npm install
npm run dev        # starts Vite dev server on port 5173
npm run build      # type-check + production build
npm run preview    # preview production build locally
```

## Deployment

Deployed automatically to GitHub Pages via GitHub Actions on push to `master`. The workflow is defined in `.github/workflows/deploy.yml`.

## Editing Resume Content

All resume data lives in `src/data/resume.ts`. Edit that file to update job history, skills, education, or contact info — the site rebuilds from it.
