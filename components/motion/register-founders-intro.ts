import { motionRevealToggle, type MotionMarkers } from "@/components/motion/sg-motion-primitives";
import { SG_REVEAL, SG_SECTION, SG_SELECTORS, SG_ST_ID, SG_TRIGGER } from "@/lib/sg-motion-system";

export function registerFoundersIntro(markers: MotionMarkers): void {
  const section = document.querySelector<HTMLElement>(SG_SECTION.founders);
  const intro = document.querySelector<HTMLElement>(SG_SELECTORS.foundersIntro);
  if (!section || !intro) return;

  motionRevealToggle(
    intro,
    SG_REVEAL.yFrom,
    markers,
    SG_ST_ID.foundersIntro,
    section,
    SG_TRIGGER.revealSection,
    SG_REVEAL.duration,
  );
}
