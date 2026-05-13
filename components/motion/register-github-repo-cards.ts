import { gsap } from "@/components/motion/gsap-register";

/** Founders 区内嵌 GitHub 仓库卡片：与 `call-reveal` 同气质的入场，避免与叠卡 pin scrub 抢 transform。 */
export function registerGithubRepoCards(markers: boolean): void {
  const cards = gsap.utils.toArray<HTMLElement>("[data-github-repo-card]");
  if (!cards.length) return;

  cards.forEach((card, i) => {
    gsap.fromTo(
      card,
      {
        clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
        y: 32,
      },
      {
        clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
        y: 0,
        duration: 1.05,
        ease: "expo.out",
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
