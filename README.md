# SurferGarage Website (V2)

Official website for SurferGarage, built with a performance-first and readability-first frontend architecture.

## Tech Stack

- Next.js 16 (App Router)
- React 19 + TypeScript
- Tailwind CSS v4
- GSAP + ScrollTrigger
- Lenis smooth scrolling
- CSS/SVG ambient background (Glow River, Call orb)
- Three.js + React Three Fiber + postprocessing (Hero wave + Bloom, gated by motion preference)

## Local Development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Quality Commands

```bash
npm run lint
npm run build
npm run lint:staged
```

## Contribution Standards

- Conventional Commits are enforced via `commitlint`.
- Git hooks are managed by `husky`.
- PRs and Issues use repository templates.

See:

- `CONTRIBUTING.md`
- `wiki/README.md`
- `SECURITY.md`
- `SUPPORT.md`

## Project Documentation

Operational and architecture docs are in `wiki/`.

Recommended start:

1. `wiki/README.md`
2. `wiki/架构.md`
3. `wiki/排障.md`（发布或报错时）
