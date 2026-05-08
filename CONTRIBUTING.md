# Contributing to SurferGarage Website

Thanks for helping improve SurferGarage.

## Development Setup

1. Use Node.js 20+.
2. Install dependencies:
   - `npm install`
3. Start local development:
   - `npm run dev`

## Branch Strategy

- Use short-lived feature branches from `main`.
- Recommended naming:
  - `feat/<scope>-<short-desc>`
  - `fix/<scope>-<short-desc>`
  - `chore/<scope>-<short-desc>`

Examples:

- `feat/home-hero-typography`
- `fix/shader-watchdog-regression`

## Commit Message Convention

This repository enforces Conventional Commits with `commitlint`.

Format:

- `<type>(<optional-scope>): <subject>`

Examples:

- `feat(shader): add automatic performance tier selection`
- `fix(scroll): remove opacity scrub from manifesto copy`
- `docs(wiki): add troubleshooting playbook`

Allowed types:

- `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`

## Local Quality Gates

Before opening a PR:

1. `npm run lint`
2. `npm run build`

Git hooks:

- `pre-commit`: runs `npm run lint:staged`
- `commit-msg`: validates commit message with `commitlint`

## Pull Request Requirements

- Keep PR focused and reviewable.
- Explain the "why" in PR description.
- Include a test plan.
- Add screenshots or recordings for UI-impacting changes.
- Update `wiki/` docs when behavior or architecture changes.

## Performance & UX Rules

- Do not introduce text flicker or brightness jumping.
- Respect `prefers-reduced-motion`.
- Prefer graceful degradation over heavy visual effects.
- If background or motion behavior changes, validate low-motion and low-end-device experience.
