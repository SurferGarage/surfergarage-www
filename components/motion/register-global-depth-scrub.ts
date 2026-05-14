import { ScrollTrigger } from "@/components/motion/gsap-register";

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
    scrub: 0.55,
    markers,
    onUpdate(self) {
      root.style.setProperty("--depth-t", self.progress.toFixed(4));
    },
    onRefresh(self) {
      root.style.setProperty("--depth-t", self.progress.toFixed(4));
    },
    onKill: () => {
      root.style.removeProperty("--depth-t");
    },
  });
}
