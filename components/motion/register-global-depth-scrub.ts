import { ScrollTrigger } from "@/components/motion/gsap-register";
import { SG_SCRUB } from "@/lib/sg-motion-system";

/** 避免 `self.progress` 非有限或越界时写出非法字符串，导致 `:root` `--sg-dt` / `color-mix` 整条失效。 */
function formatSafeDepthProgress(progress: number): string {
  if (!Number.isFinite(progress)) return "0";
  return Math.min(1, Math.max(0, progress)).toFixed(4);
}

/**
 * 整页滚动进度 → `:root` 上的 `--depth-t`（0 海面 … 1 海底），供 `.sg-main-depth` 等背景渐变使用。
 * 须放在 `gsap.context` 内，以便路由/编排卸载时随 `ctx.revert()` 一并 kill。
 * `trigger` 使用 `layout` 内 `[data-scroll-depth-root]`，保证高度与可滚内容一致。
 */
export function registerGlobalDepthScrub(markers: boolean): void {
  const root = document.documentElement;
  const scrollRoot = document.querySelector<HTMLElement>(
    "[data-scroll-depth-root]",
  );
  if (!scrollRoot) return;

  ScrollTrigger.create({
    id: "global-depth-t",
    trigger: scrollRoot,
    start: "top top",
    end: "bottom bottom",
    scrub: SG_SCRUB.globalDepth,
    markers,
    onUpdate(self) {
      root.style.setProperty("--depth-t", formatSafeDepthProgress(self.progress));
    },
    onRefresh(self) {
      root.style.setProperty("--depth-t", formatSafeDepthProgress(self.progress));
    },
    onKill: () => {
      root.style.removeProperty("--depth-t");
    },
  });
}
