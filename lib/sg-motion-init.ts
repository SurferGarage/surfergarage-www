import { gsap } from "@/components/motion/gsap-register";
import { SG_LOAD } from "@/lib/sg-motion-system";

const HERO_REVEAL_SELECTOR = "[data-hero-reveal]";
const HERO_LETTERS_SELECTOR = "[data-hero-letters]";

/** 注册 GSAP 前锁定 Hero 首帧，避免刷新时「先全显再动画」 */
export function primeHeroMotionState(): void {
  if (typeof document === "undefined") return;
  document.documentElement.classList.remove("sg-motion-ready");

  const reveals = gsap.utils.toArray<HTMLElement>(HERO_REVEAL_SELECTOR);
  if (reveals.length) {
    gsap.set(reveals, { y: SG_LOAD.heroRevealY, force3D: true });
  }

  const lettersHost = document.querySelector<HTMLElement>(HERO_LETTERS_SELECTOR);
  if (lettersHost && lettersHost.dataset.wordmarkLettersSplit !== "1") {
    gsap.set(lettersHost, { opacity: 0 });
  }
}

export function finishMotionInit(): void {
  if (typeof document === "undefined") return;
  document.documentElement.classList.add("sg-motion-ready");
}
