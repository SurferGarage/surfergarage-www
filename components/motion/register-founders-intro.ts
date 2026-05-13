import { gsap } from "@/components/motion/gsap-register";

/** Founders 叠卡区上方栏目说明：入场 reveal，与叠卡 pin/scrub 分层，避免抢戏。 */
export function registerFoundersIntro(markers: boolean): void {
  const section = document.querySelector<HTMLElement>("#founders");
  const intro = document.querySelector<HTMLElement>("[data-founders-intro]");
  if (!section || !intro) return;

  gsap.fromTo(
    intro,
    {
      clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
      y: 36,
    },
    {
      clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
      y: 0,
      duration: 1.05,
      ease: "expo.out",
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
