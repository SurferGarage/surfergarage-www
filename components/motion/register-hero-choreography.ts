import {
  motionLoadStagger,
  motionScrubCssVars,
  motionScrubFromTo,
  type MotionMarkers,
} from "@/components/motion/sg-motion-primitives";
import { syncHeroWaveFromElement } from "@/lib/sg-scroll-signals";
import {
  SG_HERO_WAVE_CALM,
  SG_SCRUB,
  SG_SELECTORS,
  SG_ST_ID,
  SG_TRIGGER,
} from "@/lib/sg-motion-system";

export type HeroChoreographyRefs = {
  heroScrub: HTMLElement | null;
  heroWave: HTMLElement | null;
  waveCalmTrigger: HTMLElement | null;
};

export function registerHeroChoreography(
  markers: MotionMarkers,
  refs: HeroChoreographyRefs,
): void {
  const { heroScrub, heroWave, waveCalmTrigger } = refs;

  motionLoadStagger(SG_SELECTORS.heroReveal);

  if (heroScrub) {
    motionScrubFromTo(
      heroScrub,
      { y: 8 },
      { y: 0 },
      markers,
      SG_ST_ID.heroParagraph,
      heroScrub,
      SG_TRIGGER.heroParagraph,
      SG_SCRUB.heroParagraph,
    );
  }

  if (heroWave && waveCalmTrigger) {
    syncHeroWaveFromElement(heroWave);
    motionScrubCssVars(
      heroWave,
      SG_HERO_WAVE_CALM,
      markers,
      SG_ST_ID.heroWaveCalm,
      waveCalmTrigger,
      SG_TRIGGER.heroWaveCalm,
      SG_SCRUB.heroWaveCalm,
      (el) => {
        if (el instanceof HTMLElement) syncHeroWaveFromElement(el);
      },
    );
  }
}
