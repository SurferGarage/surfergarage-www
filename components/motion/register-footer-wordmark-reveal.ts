/**
 * Footer 巨型字标 — 滚动驱动的字符级 stagger 揭示。
 * Fit 区块 pin 结束后继续下滑，字标从下方逐字升起。
 */
import { gsap } from "@/components/motion/gsap-register";
import { stBase, type MotionMarkers } from "@/components/motion/sg-motion-primitives";
import {
  SG_FOOTER_WORDMARK,
  SG_SCRUB,
  SG_SELECTORS,
  SG_ST_ID,
  SG_TRIGGER,
} from "@/lib/sg-motion-system";
import { splitWordmarkToLetters } from "@/lib/sg-wordmark-letters";

export function registerFooterWordmarkReveal(markers: MotionMarkers): void {
  const host = document.querySelector<HTMLElement>(SG_SELECTORS.footerWordmarkLetters);
  const zone = document.querySelector<HTMLElement>(SG_SELECTORS.footerWordmark);
  if (!host || !zone) return;

  if (!host.hasAttribute("aria-label")) {
    host.setAttribute("aria-label", host.textContent ?? "Surfer Garage");
  }

  const letters = splitWordmarkToLetters(host);
  if (!letters.length) return;

  gsap.set(letters, {
    yPercent: SG_FOOTER_WORDMARK.yFrom,
    opacity: 0,
    force3D: true,
  });

  gsap.to(letters, {
    yPercent: 0,
    opacity: 1,
    ease: "none",
    force3D: true,
    stagger: { each: SG_FOOTER_WORDMARK.letterStagger },
    scrollTrigger: {
      ...stBase(markers, SG_ST_ID.footerWordmark, zone, SG_TRIGGER.footerWordmark),
      scrub: SG_SCRUB.footerWordmark,
    },
  });
}
