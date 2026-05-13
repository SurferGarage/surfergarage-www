import { gsap } from "@/components/motion/gsap-register";

export type HeroChoreographyRefs = {
  heroScrub: HTMLElement | null;
  heroWave: HTMLElement | null;
  heroMarquee: HTMLElement | null;
  proof: HTMLElement | null;
};

export function registerHeroChoreography(
  markers: boolean,
  refs: HeroChoreographyRefs,
): void {
  const { heroScrub, heroWave, heroMarquee, proof } = refs;

  gsap.from("[data-hero-reveal]", {
    y: 28,
    duration: 0.95,
    stagger: 0.06,
    ease: "power3.out",
    delay: 0.06,
  });

  if (heroScrub) {
    gsap.fromTo(
      heroScrub,
      { y: 10 },
      {
        y: 0,
        ease: "none",
        scrollTrigger: {
          trigger: heroScrub,
          start: "top 88%",
          end: "top 48%",
          scrub: true,
          markers,
          id: "manifesto-scrub",
        },
      },
    );
  }

  if (heroWave && proof) {
    gsap.to(heroWave, {
      "--wave-distortion": 0.06,
      "--wave-opacity": 0.1,
      "--hero-cam-y": 1.05,
      "--hero-cam-z": 3.65,
      "--hero-look-y": -4.35,
      "--hero-look-z": 0.4,
      ease: "none",
      scrollTrigger: {
        trigger: proof,
        start: "top 95%",
        end: "top 40%",
        scrub: true,
        markers,
        id: "hero-wave-calm",
      },
    });
  }

  if (heroMarquee && proof) {
    gsap.to(heroMarquee, {
      yPercent: 115,
      clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
      ease: "none",
      scrollTrigger: {
        trigger: proof,
        start: "top 98%",
        end: "top 45%",
        scrub: true,
        markers,
        id: "hero-marquee-out",
      },
    });
  }
}
