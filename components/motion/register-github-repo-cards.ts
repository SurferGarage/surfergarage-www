import { gsap } from "@/components/motion/gsap-register";
import { motionRevealToggle, type MotionMarkers } from "@/components/motion/sg-motion-primitives";
import { SG_REVEAL, SG_SELECTORS, SG_ST_ID, SG_TRIGGER } from "@/lib/sg-motion-system";

export function registerGithubRepoCards(markers: MotionMarkers): void {
  const cards = gsap.utils.toArray<HTMLElement>(SG_SELECTORS.githubRepoCard);
  cards.forEach((card, i) => {
    motionRevealToggle(
      card,
      SG_REVEAL.yFromCard,
      markers,
      SG_ST_ID.githubRepoCard(i),
      card,
      SG_TRIGGER.revealCard,
      SG_REVEAL.duration,
    );
  });
}
