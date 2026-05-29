import { ScrollTrigger } from "@/components/motion/gsap-register";

/**
 * Lenis / 首页编排卸载时调用，避免 HMR 或重复挂载后 ScrollTrigger 与 pin 垫片残留占内存。
 */
export function teardownScrollMotion(): void {
  const triggers = ScrollTrigger.getAll();
  if (triggers.length) {
    triggers.forEach((st) => st.kill());
  }
  if (typeof ScrollTrigger.clearScrollMemory === "function") {
    ScrollTrigger.clearScrollMemory();
  }
}
