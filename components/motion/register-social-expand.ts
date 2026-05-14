import { gsap } from "@/components/motion/gsap-register";
import { SG_SCRUB, SG_SOCIAL } from "@/lib/sg-motion-system";

export function registerSocialExpand(markers: boolean): void {
  const socialSection = document.querySelector<HTMLElement>("#social");
  const socialStage = document.querySelector<HTMLElement>("[data-social-stage]");
  const socialIntro = document.querySelector<HTMLElement>("[data-social-intro]");
  const socialCards = gsap.utils.toArray<HTMLElement>("[data-social-card]");

  if (!socialSection || !socialStage || !socialCards.length) return;

  gsap.set(socialStage, {
    clipPath: `inset(0 ${SG_SOCIAL.stageClipInset} 0 ${SG_SOCIAL.stageClipInset})`,
  });
  gsap.set(socialCards, { y: SG_SOCIAL.cardYFrom });
  if (socialIntro) {
    gsap.set(socialIntro, {
      y: SG_SOCIAL.introYFrom,
      opacity: SG_SOCIAL.introOpacityFrom,
    });
  }

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: socialSection,
      start: "top 80%",
      end: "top 26%",
      scrub: SG_SCRUB.socialExpand,
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
      stagger: { each: SG_SOCIAL.timelineCardStaggerEach },
    },
    0,
  );
}
