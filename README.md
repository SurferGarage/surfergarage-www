# SurferGarage Website (V2)

Official website for SurferGarage, built with a performance-first and readability-first frontend architecture.

## Tech Stack

- Next.js 16 (App Router)
- React 19 + TypeScript
- Tailwind CSS v4
- GSAP + ScrollTrigger
- Lenis smooth scrolling
- CSS/SVG ambient background effects

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

1. `wiki/00-项目总览.md`
2. `wiki/03-性能与自动降级策略.md`
3. `wiki/04-维护与排障手册.md`
