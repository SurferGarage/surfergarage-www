/**
 * L1.5 — cursor-aware magnet hover：桌面 hover 时，指针在元素 bounding rect 内归一化，
 * 写入 CSS 变量 `--mx` / `--my`，由 `.sg-magnet-target`（globals.css）做 6px 内位移。
 *
 * - 仅 `(min-width: md)` + 非 reduced-motion 下注册
 * - 鼠标离开自动复位
 * - 与 GSAP 解耦，避免与 ScrollTrigger 共享 ticker 拥塞
 *
 * 用法：在元素加 `data-magnet` + 内层 `.sg-magnet-target`；本 register 自动接管。
 */

import { SG_SELECTORS } from "@/lib/sg-motion-system";

type Cleanup = () => void;

let attached: Cleanup | null = null;

function attachMagnet(el: HTMLElement): Cleanup {
  el.classList.add("sg-magnet");
  let raf = 0;
  let lastX = 0;
  let lastY = 0;

  const apply = () => {
    raf = 0;
    el.style.setProperty("--mx", lastX.toFixed(3));
    el.style.setProperty("--my", lastY.toFixed(3));
  };

  const onMove = (e: PointerEvent) => {
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / Math.max(1, r.width);
    const py = (e.clientY - r.top) / Math.max(1, r.height);
    lastX = Math.max(-1, Math.min(1, (px - 0.5) * 2));
    lastY = Math.max(-1, Math.min(1, (py - 0.5) * 2));
    if (!raf) raf = requestAnimationFrame(apply);
  };

  const onLeave = () => {
    lastX = 0;
    lastY = 0;
    if (!raf) raf = requestAnimationFrame(apply);
  };

  el.addEventListener("pointermove", onMove);
  el.addEventListener("pointerleave", onLeave);
  el.addEventListener("pointercancel", onLeave);

  return () => {
    el.removeEventListener("pointermove", onMove);
    el.removeEventListener("pointerleave", onLeave);
    el.removeEventListener("pointercancel", onLeave);
    if (raf) cancelAnimationFrame(raf);
    el.style.removeProperty("--mx");
    el.style.removeProperty("--my");
  };
}

/** 进入桌面 matchMedia 时调用；离开时 cleanup */
export function registerMagnetHover(): Cleanup {
  if (attached) attached();
  const els = Array.from(document.querySelectorAll<HTMLElement>(SG_SELECTORS.magnet));
  const cleanups = els.map((el) => attachMagnet(el));
  attached = () => {
    cleanups.forEach((c) => c());
    attached = null;
  };
  return attached;
}

/** HMR / 全局 teardown 时显式释放 magnet 指针监听 */
export function teardownMagnetHover(): void {
  attached?.();
}
