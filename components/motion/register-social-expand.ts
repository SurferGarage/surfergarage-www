import { gsap } from "@/components/motion/gsap-register";

export function registerSocialExpand(markers: boolean): void {
  const socialSection = document.querySelector<HTMLElement>("#social");
  const socialStage = document.querySelector<HTMLElement>("[data-social-stage]");
  const socialIntro = document.querySelector<HTMLElement>("[data-social-intro]");
  const socialCards = gsap.utils.toArray<HTMLElement>("[data-social-card]");

  if (!socialSection || !socialStage || !socialCards.length) return;

  gsap.set(socialStage, { clipPath: "inset(0 11% 0 11%)" });
  gsap.set(socialCards, { y: 26 });
  if (socialIntro) gsap.set(socialIntro, { y: 24, opacity: 0.84 });

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: socialSection,
      start: "top 82%",
      end: "top 24%",
      scrub: 1,
      invalidateOnRefresh: true,
      markers,
      id: "social-expand",
    },
  });

  if (socialIntro) {
    tl.to(
      socialIntro,
      { y: 0, opacity: 1, ease: "none", duration: 1 },
      0,
    );
  }

  tl.to(
    socialStage,
    {
      clipPath: "inset(0 0% 0 0%)",
      ease: "none",
      duration: 1,
    },
    0,
  ).to(
    socialCards,
    {
      y: 0,
      ease: "none",
      duration: 1,
      stagger: { each: 0.1 },
    },
    0,
  );
}
