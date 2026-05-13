import { gsap } from "@/components/motion/gsap-register";

/**
 * Manifesto 首屏：随首屏滚动推进的「景深」scrub，与 load 态 `data-hero-reveal` 互补（字标 scale + y%；正文区 wrapper 仅极轻 opacity，见 `06` 红线脚注）。
 */
export function registerManifestoScroll(markers: boolean): void {
  const root = document.querySelector<HTMLElement>("#manifesto");
  const wordmark = document.querySelector<HTMLElement>("[data-hero-wordmark]");
  const fade = document.querySelector<HTMLElement>("[data-manifesto-fade]");
  if (!root) return;

  if (wordmark) {
    gsap.fromTo(
      wordmark,
      { scale: 1, y: 0, transformOrigin: "0% 0%" },
      {
        scale: 0.9,
        yPercent: -6,
        ease: "none",
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: "bottom 42%",
          scrub: 0.65,
          invalidateOnRefresh: true,
          markers,
          id: "manifesto-wordmark",
        },
      },
    );
  }

  if (fade) {
    gsap.fromTo(
      fade,
      { opacity: 1 },
      {
        opacity: 0.9,
        ease: "none",
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: "bottom 36%",
          scrub: 0.85,
          invalidateOnRefresh: true,
          markers,
          id: "manifesto-fade-depth",
        },
      },
    );
  }
}
