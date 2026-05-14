import { gsap } from "@/components/motion/gsap-register";
import { SG_CLIP, SG_REVEAL } from "@/lib/sg-motion-system";

/** Founders 区内嵌 GitHub 仓库卡片：与 `call-reveal` 同气质的入场，避免与叠卡 pin scrub 抢 transform。 */
export function registerGithubRepoCards(markers: boolean): void {
  const cards = gsap.utils.toArray<HTMLElement>("[data-github-repo-card]");
  if (!cards.length) return;

  cards.forEach((card, i) => {
    gsap.fromTo(
      card,
      {
        clipPath: SG_CLIP.revealFrom,
        y: SG_REVEAL.yFromCard,
      },
      {
        clipPath: SG_CLIP.revealTo,
        y: 0,
        duration: SG_REVEAL.duration,
        ease: SG_REVEAL.ease,
        scrollTrigger: {
          trigger: card,
          start: "top 90%",
          toggleActions: "play none none reverse",
          markers,
          id: `github-repo-card-${i}`,
        },
      },
    );
  });
}
