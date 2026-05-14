import { gsap, ScrollTrigger } from "@/components/motion/gsap-register";
import { FOUNDER_WECHAT_PIN_END } from "@/lib/founder-wechat-pin-end";
import { SG_FOUNDER_PIN, SG_SCRUB } from "@/lib/sg-motion-system";

export type DesktopPinsRefs = {
  manifestoPin: HTMLElement | null;
  manifestoRight: HTMLElement | null;
};

export function registerDesktopPins(
  markers: boolean,
  refs: DesktopPinsRefs,
): void {
  const { manifestoPin, manifestoRight } = refs;

  if (manifestoPin && manifestoRight) {
    ScrollTrigger.create({
      trigger: manifestoRight,
      start: "top 10%",
      end: "bottom bottom",
      pin: manifestoPin,
      pinSpacing: true,
      markers,
      id: "manifesto-pin",
    });
  }

  const founderPanels = gsap.utils.toArray<HTMLElement>("[data-founder-panel]");
  founderPanels.forEach((panel, i) => {
    const card = panel.querySelector<HTMLElement>("[data-founder-card]");
    if (!card) return;
    const isWechat = panel.dataset.founderModule === "wechat_oa";
    /** 公众号首屏：更长 pin/scrub，便于在中央多滚一段再进入视频号 */
    const endScroll = isWechat ? FOUNDER_WECHAT_PIN_END : "+=115%";
    gsap.fromTo(
      card,
      { scale: 1, y: 0 },
      {
        scale: SG_FOUNDER_PIN.scaleTo,
        y: SG_FOUNDER_PIN.yTo,
        ease: "none",
        scrollTrigger: {
          trigger: panel,
          start: "top top",
          end: endScroll,
          pin: true,
          scrub: SG_SCRUB.founderPin,
          anticipatePin: 1,
          markers,
          id: `founder-stack-${i}`,
        },
      },
    );
  });
}
