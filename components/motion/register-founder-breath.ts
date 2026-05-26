import { gsap } from "@/components/motion/gsap-register";
import { motionBreathGlow, type MotionMarkers } from "@/components/motion/sg-motion-primitives";
import { SG_SELECTORS, SG_ST_ID } from "@/lib/sg-motion-system";

export function registerFounderBreath(markers: MotionMarkers): void {
  const zones = gsap.utils.toArray<HTMLElement>(SG_SELECTORS.breathZone);
  zones.forEach((zone, i) => {
    const glow = zone.querySelector<HTMLElement>(SG_SELECTORS.breathGlow);
    if (!glow) return;

    const id = zone.matches("[data-social-founders-trench]")
      ? SG_ST_ID.socialFoundersTrench
      : SG_ST_ID.founderBreath(i);

    motionBreathGlow(glow, zone, markers, id);
  });
}
