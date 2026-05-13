import { gsap } from "@/components/motion/gsap-register";

const revealFrom = {
  clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
  y: 40,
} as const;

const revealTo = {
  clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
  y: 0,
} as const;

export function registerCallReveal(
  markers: boolean,
  callSection: HTMLElement | null,
): void {
  const callIntro = document.querySelector<HTMLElement>("[data-call-intro]");
  const callItems = gsap.utils.toArray<HTMLElement>("[data-call-item]");
  if (!callSection || (!callIntro && !callItems.length)) return;

  const st = {
    trigger: callSection,
    start: "top 85%",
    toggleActions: "play none none reverse" as const,
    markers,
    id: "call-reveal",
  };

  const tl = gsap.timeline({ scrollTrigger: st });

  if (callIntro) {
    tl.fromTo(
      callIntro,
      revealFrom,
      {
        ...revealTo,
        duration: 0.95,
        ease: "expo.out",
      },
      0,
    );
  }

  if (callItems.length) {
    tl.fromTo(
      callItems,
      revealFrom,
      {
        ...revealTo,
        duration: 1.2,
        ease: "expo.out",
        stagger: 0.15,
      },
      callIntro ? 0.1 : 0,
    );
  }
}
