import { gsap } from "@/components/motion/gsap-register";
import { stBase, type MotionMarkers } from "@/components/motion/sg-motion-primitives";
import { SG_SCRUB, SG_SECTION, SG_SELECTORS, SG_SOCIAL, SG_ST_ID, SG_TRIGGER } from "@/lib/sg-motion-system";

export function registerSocialExpand(markers: MotionMarkers): void {
  const socialSection = document.querySelector<HTMLElement>(SG_SECTION.social);
  const socialStage = document.querySelector<HTMLElement>(SG_SELECTORS.socialStage);
  const socialIntro = document.querySelector<HTMLElement>(SG_SELECTORS.socialIntro);
  const socialCards = gsap.utils.toArray<HTMLElement>(SG_SELECTORS.socialCard);

  if (!socialSection || !socialStage || !socialCards.length) return;

  /** V3：去掉 stage clipPath（之前的 inset(0 10% 0 10%) 在 scrub 未满时会把卡左右各裁掉一块）。
   * 仅保留：intro fade-in、卡 y stagger reveal — 不再切割边缘容器宽度。 */
  gsap.set(socialCards, { y: SG_SOCIAL.cardYFrom, force3D: true });
  if (socialIntro) {
    gsap.set(socialIntro, {
      y: SG_SOCIAL.introYFrom,
      opacity: SG_SOCIAL.introOpacityFrom,
      force3D: true,
    });
  }

  const tl = gsap.timeline({
    scrollTrigger: {
      ...stBase(markers, SG_ST_ID.socialExpand, socialSection, SG_TRIGGER.socialExpand),
      scrub: SG_SCRUB.socialExpand,
    },
  });

  if (socialIntro) {
    tl.to(
      socialIntro,
      { y: 0, opacity: 1, ease: "none", duration: 1, force3D: true },
      SG_SOCIAL.timelineIntroAt,
    );
  }

  tl.to(
    socialCards,
    {
      y: 0,
      ease: "none",
      duration: 1,
      force3D: true,
      stagger: { each: SG_SOCIAL.timelineCardStaggerEach },
    },
    SG_SOCIAL.timelineCardsAt,
  );
}
