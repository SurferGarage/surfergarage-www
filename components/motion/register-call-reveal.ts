import { gsap } from "@/components/motion/gsap-register";
import {
  applyRevealPending,
  motionRevealTimeline,
  type MotionMarkers,
} from "@/components/motion/sg-motion-primitives";
import { SG_CLIP, SG_REVEAL, SG_SELECTORS, SG_ST_ID, SG_TRIGGER } from "@/lib/sg-motion-system";

export function registerCallReveal(
  markers: MotionMarkers,
  callSection: HTMLElement | null,
): void {
  const callIntro = document.querySelector<HTMLElement>(SG_SELECTORS.callIntro);
  const callItems = gsap.utils.toArray<HTMLElement>(SG_SELECTORS.callItem);
  if (!callSection || (!callIntro && !callItems.length)) return;

  if (callIntro) applyRevealPending(callIntro, SG_REVEAL.yFrom);
  if (callItems.length) applyRevealPending(callItems, SG_REVEAL.yFromLift);

  motionRevealTimeline(
    callSection,
    markers,
    SG_ST_ID.callReveal,
    SG_TRIGGER.revealCall,
    (tl) => {
      if (callIntro) {
        tl.fromTo(
          callIntro,
          { clipPath: SG_CLIP.revealFrom, y: SG_REVEAL.yFrom },
          {
            clipPath: SG_CLIP.revealTo,
            y: 0,
            duration: SG_REVEAL.durationTight,
            ease: SG_REVEAL.ease,
            force3D: true,
          },
          0,
        );
      }
      if (callItems.length) {
        tl.fromTo(
          callItems,
          { clipPath: SG_CLIP.revealFrom, y: SG_REVEAL.yFromLift },
          {
            clipPath: SG_CLIP.revealTo,
            y: 0,
            duration: SG_REVEAL.durationStack,
            ease: SG_REVEAL.ease,
            force3D: true,
            stagger: SG_REVEAL.staggerCallRows,
          },
          callIntro ? SG_REVEAL.overlapIntroToMain : 0,
        );
      }
    },
  );
}
