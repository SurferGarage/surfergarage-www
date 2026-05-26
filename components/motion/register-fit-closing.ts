/**
 * Fit 匹配度区块 — 滚动暂停 + 内容揭示（桌面 pin / 移动 toggle）。
 * 用户滚到「我们在找什么样的人」时短暂停住，两列清单 stagger 入场后再继续往下。
 */
import { gsap } from "@/components/motion/gsap-register";
import {
  applyRevealPending,
  motionRevealTimeline,
  type MotionMarkers,
} from "@/components/motion/sg-motion-primitives";
import {
  SG_CLIP,
  SG_FIT,
  SG_REVEAL,
  SG_SCRUB,
  SG_SECTION,
  SG_SELECTORS,
  SG_ST_ID,
  SG_TRIGGER,
} from "@/lib/sg-motion-system";

function collectFitTargets() {
  const fitPanel = document.querySelector<HTMLElement>(SG_SELECTORS.fitPanel);
  const fitCard = document.querySelector<HTMLElement>(SG_SELECTORS.fitCard);
  const fitIntro = document.querySelector<HTMLElement>(SG_SELECTORS.fitIntro);
  const fitCols = gsap.utils.toArray<HTMLElement>(SG_SELECTORS.fitCol);
  const fitItems = gsap.utils.toArray<HTMLElement>(SG_SELECTORS.fitItem);
  return { fitPanel, fitCard, fitIntro, fitCols, fitItems };
}

/** 移动 / 降级：单次 toggle 揭示，无 pin */
export function registerFitReveal(markers: MotionMarkers): void {
  const fitSection = document.querySelector<HTMLElement>(SG_SECTION.fit);
  const { fitIntro, fitCols, fitItems } = collectFitTargets();
  if (!fitSection || (!fitIntro && !fitCols.length && !fitItems.length)) return;

  if (fitIntro) applyRevealPending(fitIntro, SG_REVEAL.yFrom);
  if (fitCols.length) applyRevealPending(fitCols, SG_REVEAL.yFromCard);
  if (fitItems.length) applyRevealPending(fitItems, SG_REVEAL.yFromLift);

  motionRevealTimeline(
    fitSection,
    markers,
    SG_ST_ID.fitReveal,
    SG_TRIGGER.revealFit,
    (tl) => {
      if (fitIntro) {
        tl.fromTo(
          fitIntro,
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
      if (fitCols.length) {
        tl.fromTo(
          fitCols,
          { clipPath: SG_CLIP.revealFrom, y: SG_REVEAL.yFromCard },
          {
            clipPath: SG_CLIP.revealTo,
            y: 0,
            duration: SG_REVEAL.duration,
            ease: SG_REVEAL.ease,
            force3D: true,
            stagger: SG_REVEAL.staggerCards,
          },
          fitIntro ? 0.06 : 0,
        );
      }
      if (fitItems.length) {
        tl.fromTo(
          fitItems,
          { clipPath: SG_CLIP.revealFrom, y: SG_REVEAL.yFromLift },
          {
            clipPath: SG_CLIP.revealTo,
            y: 0,
            duration: SG_REVEAL.durationStack,
            ease: SG_REVEAL.ease,
            force3D: true,
            stagger: SG_FIT.itemStagger,
          },
          fitCols.length ? 0.14 : fitIntro ? 0.08 : 0,
        );
      }
    },
  );
}

/** 桌面：pin 固定一屏 + scrub 时间轴，制造「停一下再读」的节奏 */
export function registerFitClosingPin(markers: MotionMarkers): void {
  const { fitPanel, fitCard, fitIntro, fitCols, fitItems } = collectFitTargets();
  if (!fitPanel || !fitCard) return;

  if (fitIntro) applyRevealPending(fitIntro, SG_REVEAL.yFrom);
  if (fitCols.length) applyRevealPending(fitCols, SG_REVEAL.yFromCard);
  if (fitItems.length) applyRevealPending(fitItems, SG_REVEAL.yFromLift);

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: fitPanel,
      start: SG_TRIGGER.fitPin.start,
      end: SG_FIT.pinEnd,
      pin: fitCard,
      scrub: SG_SCRUB.fitPin,
      anticipatePin: 1,
      fastScrollEnd: true,
      markers,
      id: SG_ST_ID.fitClosingPin,
      invalidateOnRefresh: true,
    },
  });

  if (fitIntro) {
    tl.fromTo(
      fitIntro,
      { clipPath: SG_CLIP.revealFrom, y: SG_REVEAL.yFrom, opacity: 0.88 },
      {
        clipPath: SG_CLIP.revealTo,
        y: 0,
        opacity: 1,
        ease: "none",
        duration: SG_FIT.phaseIntro,
        force3D: true,
      },
      0,
    );
  }

  if (fitCols.length) {
    tl.fromTo(
      fitCols,
      { clipPath: SG_CLIP.revealFrom, y: SG_REVEAL.yFromCard, opacity: 0.9 },
      {
        clipPath: SG_CLIP.revealTo,
        y: 0,
        opacity: 1,
        ease: "none",
        duration: SG_FIT.phaseCols,
        force3D: true,
        stagger: { each: SG_FIT.colStagger, from: "start" },
      },
      SG_FIT.phaseIntro * 0.55,
    );
  }

  if (fitItems.length) {
    tl.fromTo(
      fitItems,
      { clipPath: SG_CLIP.revealFrom, y: SG_REVEAL.yFromLift, opacity: 0.85 },
      {
        clipPath: SG_CLIP.revealTo,
        y: 0,
        opacity: 1,
        ease: "none",
        duration: SG_FIT.phaseItems,
        force3D: true,
        stagger: { each: SG_FIT.itemStagger, from: "start" },
      },
      SG_FIT.phaseIntro + SG_FIT.phaseCols * 0.35,
    );
  }

  /** 清单读完后短暂 hold，再轻微收束，提示可以继续往下 */
  tl.to(
    fitCard,
    {
      opacity: SG_FIT.holdOpacity,
      y: SG_FIT.holdY,
      ease: "none",
      duration: SG_FIT.phaseHold,
      force3D: true,
    },
    SG_FIT.phaseIntro + SG_FIT.phaseCols + SG_FIT.phaseItems * 0.65,
  );
}
