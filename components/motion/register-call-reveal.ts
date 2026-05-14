import { gsap } from "@/components/motion/gsap-register";
import { SG_CLIP, SG_REVEAL } from "@/lib/sg-motion-system";

export function registerCallReveal(
  markers: boolean,
  callSection: HTMLElement | null,
): void {
  const callIntro = document.querySelector<HTMLElement>("[data-call-intro]");
  const callItems = gsap.utils.toArray<HTMLElement>("[data-call-item]");
  if (!callSection || (!callIntro && !callItems.length)) return;

  const st = {
    trigger: callSection,
    start: "top 84%",
    toggleActions: "play none none reverse" as const,
    markers,
    id: "call-reveal",
  };

  const tl = gsap.timeline({ scrollTrigger: st });

  if (callIntro) {
    tl.fromTo(
      callIntro,
      {
        clipPath: SG_CLIP.revealFrom,
        y: SG_REVEAL.yFrom,
      },
      {
        clipPath: SG_CLIP.revealTo,
        y: 0,
        duration: SG_REVEAL.durationTight,
        ease: SG_REVEAL.ease,
      },
      0,
    );
  }

  if (callItems.length) {
    tl.fromTo(
      callItems,
      {
        clipPath: SG_CLIP.revealFrom,
        y: SG_REVEAL.yFromLift,
      },
      {
        clipPath: SG_CLIP.revealTo,
        y: 0,
        duration: SG_REVEAL.durationStack,
        ease: SG_REVEAL.ease,
        stagger: SG_REVEAL.staggerCallRows,
      },
      callIntro ? SG_REVEAL.overlapIntroToMain : 0,
    );
  }
}
