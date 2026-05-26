import { gsap } from "@/components/motion/gsap-register";
import { motionPin, motionPinScrub, type MotionMarkers } from "@/components/motion/sg-motion-primitives";
import { FOUNDER_WECHAT_PIN_END } from "@/lib/founder-wechat-pin-end";
import { SG_FOUNDER_PIN, SG_SELECTORS, SG_ST_ID, SG_TRIGGER } from "@/lib/sg-motion-system";

export type DesktopPinsRefs = {
  manifestoPin: HTMLElement | null;
  manifestoRight: HTMLElement | null;
};

export function registerDesktopPins(
  markers: MotionMarkers,
  refs: DesktopPinsRefs,
): void {
  const { manifestoPin, manifestoRight } = refs;

  if (manifestoPin && manifestoRight) {
    motionPin(
      manifestoPin,
      manifestoRight,
      markers,
      SG_ST_ID.manifestoPin,
      SG_TRIGGER.manifestoPin,
    );
  }

  const founderPanels = gsap.utils.toArray<HTMLElement>(SG_SELECTORS.founderPanel);
  founderPanels.forEach((panel, i) => {
    const card = panel.querySelector<HTMLElement>(SG_SELECTORS.founderCard);
    if (!card) return;
    /** Founder Studio（微信+视频 tab 合并）与原 wechat_oa 共用更长的 pin end，
     * 给 tab 切换 + 横滑 / 视频展台预留观看时间。 */
    const isStudio =
      panel.dataset.founderModule === "founder_studio" ||
      panel.dataset.founderModule === "wechat_oa";
    const endScroll = isStudio ? FOUNDER_WECHAT_PIN_END : SG_FOUNDER_PIN.defaultEnd;

    motionPinScrub(
      card,
      panel,
      markers,
      SG_ST_ID.founderStack(i),
      endScroll,
      SG_FOUNDER_PIN.scaleTo,
      SG_FOUNDER_PIN.yTo,
    );
  });
}
