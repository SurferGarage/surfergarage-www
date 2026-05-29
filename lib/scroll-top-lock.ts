import { ScrollTrigger } from "@/components/motion/gsap-register";
import type Lenis from "lenis";

let viewportLocked = false;

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

/**
 * ScrollTrigger 在 pin + anticipatePin 下 refresh 常会短暂改写 scroll；
 * refresh 后立刻钉回顶部并再 update 一次。
 */
export function refreshScrollTriggersHoldTop(lenis: Lenis | null): void {
  ScrollTrigger.refresh();
  forceScrollTop(lenis);
  ScrollTrigger.update();
  forceScrollTop(lenis);
}
