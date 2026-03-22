# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Personal portfolio website for Ala NAJAR — React SPA with 3D graphics, deployed to GitHub Pages.

## Commands

- `npm run dev` — Start Vite dev server with HMR
- `npm run build` — Production build (outputs to `dist/`)
- `npm run lint` — ESLint checks
- `npm run preview` — Preview production build locally
- `npm run deploy` — Build + deploy to GitHub Pages via gh-pages

## Architecture

**Stack:** React 19 + Vite 8 + Tailwind CSS 4 + Three.js + Framer Motion

All content lives in `src/components/` as section components rendered sequentially in `App.jsx`:
`LoadingScreen → Navbar → Hero → About → Skills → Projects → Associations → Languages → Contact → Footer`

**Key patterns:**
- `HeroScene.jsx` is lazy-loaded (`React.lazy` + `Suspense`) — it contains the Three.js 3D scene (torus, spheres, particles) via `@react-three/fiber`
- `Projects.jsx` fetches live data from `api.github.com/users/alanajar/repos`
- Custom cursor (`Cursor.jsx`) uses `requestAnimationFrame` with lerp — body has `cursor: none`
- All scroll animations use Framer Motion's `useInView` with `{ once: true }`

**Styling:** Tailwind v4 (imported via `@import "tailwindcss"` in `index.css`, plugin in vite.config). Custom utility classes defined in `index.css`: `.glass-card`, `.gradient-text`, `.btn-primary`, `.btn-outline`, `.skill-card-*` (3D flip), `.project-card` (3D hover), `.form-input`.

**Design tokens:** Background `#0a0a0f`, indigo `#4f46e5`, cyan `#06b6d4`, violet `#7c3aed`. Fonts: Inter + Space Grotesk.

## Build Notes

- `base: '/portfolio/'` in vite.config.js (GitHub Pages subdirectory)
- `chunkSizeWarningLimit: 1500` — Three.js makes bundles large, this is intentional
- Vite 8 uses rolldown — `manualChunks` as object is not supported (use function or omit)
- No test framework configured
- Content is in French
