import { ScrollTrigger } from "@/components/motion/gsap-register";
import { teardownMagnetHover } from "@/components/motion/register-magnet-hover";
import {
  resetHeroWaveSignals,
  setScrollDepthT,
  setWaveScrollVel,
} from "@/lib/sg-scroll-signals";

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
  teardownMagnetHover();
  setScrollDepthT(0);
  setWaveScrollVel(0);
  resetHeroWaveSignals();
  if (typeof document !== "undefined") {
    document.documentElement.style.removeProperty("--wave-scroll-vel");
    document.documentElement.style.removeProperty("--depth-t");
  }
}
