import { gsap } from "@/components/motion/gsap-register";
import { SG_LOAD, SG_SCRUB } from "@/lib/sg-motion-system";

export type HeroChoreographyRefs = {
  heroScrub: HTMLElement | null;
  heroWave: HTMLElement | null;
  /** 浪面收束 scrub 的触发区（现为 `#social`） */
  waveCalmTrigger: HTMLElement | null;
};

export function registerHeroChoreography(
  markers: boolean,
  refs: HeroChoreographyRefs,
): void {
  const { heroScrub, heroWave, waveCalmTrigger } = refs;

  gsap.from("[data-hero-reveal]", {
    y: SG_LOAD.heroRevealY,
    duration: SG_LOAD.heroRevealDuration,
    stagger: SG_LOAD.heroRevealStagger,
    ease: SG_LOAD.ease,
    delay: SG_LOAD.heroRevealDelay,
  });

  if (heroScrub) {
    gsap.fromTo(
      heroScrub,
      { y: 8 },
      {
        y: 0,
        ease: "none",
        scrollTrigger: {
          trigger: heroScrub,
          start: "top 88%",
          end: "top 48%",
          scrub: SG_SCRUB.heroParagraph,
          markers,
          id: "manifesto-scrub",
        },
      },
    );
  }

  if (heroWave && waveCalmTrigger) {
    gsap.to(heroWave, {
      "--wave-distortion": 0.06,
      "--wave-opacity": 0.1,
      "--hero-cam-y": 1.05,
      "--hero-cam-z": 3.65,
      "--hero-look-y": -4.35,
      "--hero-look-z": 0.4,
      ease: "none",
      scrollTrigger: {
        trigger: waveCalmTrigger,
        start: "top 95%",
        end: "top 40%",
        scrub: SG_SCRUB.heroWaveCalm,
        markers,
        id: "hero-wave-calm",
      },
    });
  }
}
