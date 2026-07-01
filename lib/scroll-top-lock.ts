import { ScrollTrigger } from "@/components/motion/gsap-register";
import type Lenis from "lenis";

let viewportLocked = false;
let refreshDepth = 0;

/** 视口锁定期间禁止 refresh（pin 垫片会按错误 scrollHeight 膨胀，拖死内存） */
export function isScrollViewportLocked(): boolean {
  return viewportLocked;
}

/**
 * 编排 / ST refresh 期间固定 body，避免 pin + anticipatePin 改写 scroll 时 Lenis 产生可见位移。
 */
export function lockViewportDuringMotionInit(): void {
  if (typeof document === "undefined" || viewportLocked) return;
  viewportLocked = true;

  const y = window.scrollY;
  document.documentElement.setAttribute("data-sg-scroll-lock", "");
  document.body.style.position = "fixed";
  document.body.style.top = y > 0 ? `-${y}px` : "0";
  document.body.style.left = "0";
  document.body.style.right = "0";
  document.body.style.width = "100%";
}

export function unlockViewportAfterMotionInit(lenis: Lenis | null): void {
  if (!viewportLocked) return;
  viewportLocked = false;

  document.body.style.position = "";
  document.body.style.top = "";
  document.body.style.left = "";
  document.body.style.right = "";
  document.body.style.width = "";
  document.documentElement.removeAttribute("data-sg-scroll-lock");

  forceScrollTop(lenis);
}

/** 强制回到页顶（原生 + Lenis），用于 ST refresh / pin 初始化后的回弹 */
export function forceScrollTop(lenis: Lenis | null): void {
  if (typeof window === "undefined") return;

  window.scrollTo(0, 0);
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;

  if (lenis) {
    lenis.scrollTo(0, { immediate: true, lock: true, force: true });
  }
}

/** refresh 后若 scrollHeight 异常膨胀，说明 pin 在错误布局下计算过，须熔断 */
const MAX_SCROLL_HEIGHT_RATIO = 55;

function assertReasonableScrollHeight(): void {
  if (typeof window === "undefined") return;
  const max = Math.max(window.innerHeight, 1) * MAX_SCROLL_HEIGHT_RATIO;
  const h = document.documentElement.scrollHeight;
  if (h <= max) return;

  console.warn(
    `[sg] scrollHeight ${h}px exceeds ${MAX_SCROLL_HEIGHT_RATIO}× viewport; killing ScrollTriggers to avoid freeze.`,
  );
  ScrollTrigger.getAll().forEach((st) => st.kill());
  if (typeof ScrollTrigger.clearScrollMemory === "function") {
    ScrollTrigger.clearScrollMemory();
  }
  if (viewportLocked) {
    unlockViewportAfterMotionInit(null);
  }
  document.documentElement.classList.add("sg-motion-ready");
}

/**
 * ScrollTrigger 在 pin + anticipatePin 下 refresh 常会短暂改写 scroll；
 * **须在 unlock 之后**调用，否则 pin 垫片按锁定视口计算会撑爆 DOM / 内存。
 */
export function refreshScrollTriggersHoldTop(
  lenis: Lenis | null,
  opts?: { preserveScroll?: boolean },
): void {
  if (typeof window === "undefined") return;
  if (viewportLocked || refreshDepth > 0) return;

  const preserve =
    opts?.preserveScroll ??
    (lenis?.scroll ?? window.scrollY) >= 120;

  refreshDepth += 1;
  try {
    ScrollTrigger.refresh();
    if (!preserve) {
      forceScrollTop(lenis);
    }
    assertReasonableScrollHeight();
  } finally {
    refreshDepth -= 1;
  }
}
