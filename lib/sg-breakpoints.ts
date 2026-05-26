/**
 * 与 Tailwind CSS v4 默认 `screens` 一致（`app/globals.css` 未覆盖 `@theme --breakpoint-*` 时以此为准）。
 * `gsap.matchMedia`、原生 `matchMedia`、`next/image` 的 `sizes` 等应复用本模块，避免与 `md:` / `lg:` 类名不一致的魔数。
 */

export const SG_BP = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
} as const;

/** 与 Tailwind `md:` 一致，供 `gsap.matchMedia` / `ScrollTrigger` 条件注册 */
export const SG_MEDIA_MD_MIN = `(min-width: ${SG_BP.md}px)` as const;
export const SG_MEDIA_MD_MAX = `(max-width: ${SG_BP.md - 1}px)` as const;

export function sgMediaMinWidth(px: number): string {
  return `(min-width: ${px}px)`;
}

export function sgMediaMaxWidth(px: number): string {
  return `(max-width: ${px}px)`;
}
