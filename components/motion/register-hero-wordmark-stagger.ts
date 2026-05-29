/**
 * Hero 字标字符级 stagger：把 `[data-hero-letters]` 内的纯文本拆成 `<span class="wordmark-letter">`，
 * 然后用 GSAP 做 y/opacity 入场。一次性，不绑滚动。
 *
 * 与 `register-hero-choreography` 的 `motionLoadStagger`（区块级 reveal）正交：
 * 这里精到「每个字符」，是 L1 的影院级补强。
 */
import { gsap } from "@/components/motion/gsap-register";
import { SG_LOAD } from "@/lib/sg-motion-system";
import { splitWordmarkToLetters } from "@/lib/sg-wordmark-letters";

const HERO_LETTERS_SELECTOR = "[data-hero-letters]";

export function registerHeroWordmarkStagger(): void {
  const host = document.querySelector<HTMLElement>(HERO_LETTERS_SELECTOR);
  if (!host) return;

  if (!host.hasAttribute("aria-label")) {
    host.setAttribute("aria-label", host.textContent ?? "");
  }

  const needsSplit = host.dataset.wordmarkLettersSplit !== "1";
  if (needsSplit) {
    gsap.set(host, { opacity: 0 });
  }

  const letters = splitWordmarkToLetters(host);
  if (!letters.length) return;

  gsap.set(letters, { yPercent: 100, opacity: 0, force3D: true });
  if (needsSplit) {
    gsap.set(host, { opacity: 1 });
  }

  gsap.to(letters, {
    yPercent: 0,
    opacity: 1,
    duration: 0.78,
    ease: "expo.out",
    delay: SG_LOAD.heroRevealDelay + 0.04,
    stagger: { each: 0.028, from: "start" },
    force3D: true,
  });
}
