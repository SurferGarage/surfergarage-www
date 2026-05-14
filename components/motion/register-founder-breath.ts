import { gsap } from "@/components/motion/gsap-register";
import { SG_SCRUB } from "@/lib/sg-motion-system";

/** 叠卡之间的呼吸带：随滚流轻微「亮起来」，压低信息密度，不抢正文 ST。 */
export function registerFounderBreath(markers: boolean): void {
  const zones = gsap.utils.toArray<HTMLElement>("[data-founder-breath]");
  zones.forEach((zone, i) => {
    const glow = zone.querySelector<HTMLElement>("[data-founder-breath-glow]");
    if (!glow) return;

    gsap.fromTo(
      glow,
      { opacity: 0.06 },
      {
        opacity: 0.34,
        ease: "none",
        scrollTrigger: {
          trigger: zone,
          start: "top 92%",
          end: "bottom 8%",
          scrub: SG_SCRUB.socialExpand * 0.92,
          markers,
          id: `founder-breath-${i}`,
        },
      },
    );
  });
}
