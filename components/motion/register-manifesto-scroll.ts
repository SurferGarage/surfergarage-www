import { motionScrubFromTo, type MotionMarkers } from "@/components/motion/sg-motion-primitives";
import { SG_SCRUB, SG_SECTION, SG_SELECTORS, SG_ST_ID, SG_TRIGGER } from "@/lib/sg-motion-system";

export function registerManifestoScroll(markers: MotionMarkers): void {
  const root = document.querySelector<HTMLElement>(SG_SECTION.manifesto);
  const wordmark = document.querySelector<HTMLElement>(SG_SELECTORS.heroWordmark);
  const fade = document.querySelector<HTMLElement>(SG_SELECTORS.manifestoFade);
  if (!root) return;

  if (wordmark) {
    motionScrubFromTo(
      wordmark,
      { scale: 1, y: 0, transformOrigin: "0% 0%" },
      { scale: 0.91, yPercent: -5 },
      markers,
      SG_ST_ID.manifestoWordmark,
      root,
      SG_TRIGGER.manifestoWordmark,
      SG_SCRUB.manifestoWordmark,
    );
  }

  if (fade) {
    motionScrubFromTo(
      fade,
      { opacity: 1 },
      { opacity: 0.92 },
      markers,
      SG_ST_ID.manifestoFade,
      root,
      SG_TRIGGER.manifestoFade,
      SG_SCRUB.manifestoFade,
    );
  }
}
