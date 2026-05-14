import { gsap } from "@/components/motion/gsap-register";
import { SG_CLIP, SG_REVEAL } from "@/lib/sg-motion-system";

/** Founders 叠卡区上方栏目说明：入场 reveal，与叠卡 pin/scrub 分层，避免抢戏。 */
export function registerFoundersIntro(markers: boolean): void {
  const section = document.querySelector<HTMLElement>("#founders");
  const intro = document.querySelector<HTMLElement>("[data-founders-intro]");
  if (!section || !intro) return;

  gsap.fromTo(
    intro,
    {
      clipPath: SG_CLIP.revealFrom,
      y: SG_REVEAL.yFrom,
    },
    {
      clipPath: SG_CLIP.revealTo,
      y: 0,
      duration: SG_REVEAL.duration,
      ease: SG_REVEAL.ease,
      scrollTrigger: {
        trigger: section,
        start: "top 86%",
        toggleActions: "play none none reverse",
        markers,
        id: "founders-intro",
      },
    },
  );
}
