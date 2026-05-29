/**
 * 全站 GSAP 原语：各 `register-*` 只组合本文件 API，不写魔法数。
 */
import {
  gsap,
  ScrollTrigger,
} from "@/components/motion/gsap-register";
import {
  SG_CLIP,
  SG_LOAD,
  SG_REVEAL,
  SG_SCRUB,
  SG_TOGGLE,
  SG_TRIGGER,
} from "@/lib/sg-motion-system";
import { setScrollDepthT } from "@/lib/sg-scroll-signals";

export type MotionMarkers = boolean;

type StRange = { start: string; end?: string };

export function formatSafeDepthProgress(progress: number): string {
  if (!Number.isFinite(progress)) return "0";
  return Math.min(1, Math.max(0, progress)).toFixed(4);
}

export function writeScrollDepth(progress: number): void {
  const t = formatSafeDepthProgress(progress);
  setScrollDepthT(Number.parseFloat(t));
  document.documentElement.style.setProperty("--depth-t", t);
}

export function clearScrollDepth(): void {
  setScrollDepthT(0);
  document.documentElement.style.removeProperty("--depth-t");
}

export function stBase(
  markers: MotionMarkers,
  id: string,
  trigger: Element,
  range: StRange,
  extra?: ScrollTrigger.Vars,
): ScrollTrigger.Vars {
  return {
    trigger,
    start: range.start,
    end: range.end,
    markers,
    id,
    invalidateOnRefresh: true,
    ...extra,
  };
}

/** 注册 ScrollTrigger 前锁定 clip + y，避免首帧闪动 */
export function applyRevealPending(
  targets: gsap.TweenTarget,
  yFrom: number,
): void {
  gsap.set(targets, {
    clipPath: SG_CLIP.revealFrom,
    y: yFrom,
    force3D: true,
  });
}

/** L0：整页深度 → `--depth-t` */
export function motionGlobalDepthScrub(
  markers: MotionMarkers,
  scrollRoot: HTMLElement,
  id: string,
): void {
  ScrollTrigger.create({
    ...stBase(markers, id, scrollRoot, SG_TRIGGER.depthFull),
    scrub: SG_SCRUB.globalDepth,
    onUpdate(self) {
      writeScrollDepth(self.progress);
    },
    onRefresh(self) {
      writeScrollDepth(self.progress);
    },
    onKill: clearScrollDepth,
  });
}

/** L1：首屏 load 入场（无 ScrollTrigger）；先 set 再 to，避免 `from` 首帧闪动 */
export function motionLoadStagger(
  selector: string,
  opts?: { y?: number; delay?: number },
): void {
  const targets = gsap.utils.toArray<HTMLElement>(selector);
  if (!targets.length) return;

  const y = opts?.y ?? SG_LOAD.heroRevealY;
  gsap.set(targets, { y, force3D: true });
  gsap.to(targets, {
    y: 0,
    duration: SG_LOAD.heroRevealDuration,
    stagger: SG_LOAD.heroRevealStagger,
    ease: SG_LOAD.ease,
    delay: opts?.delay ?? SG_LOAD.heroRevealDelay,
    force3D: true,
    clearProps: "y",
  });
}

/** scrub：位移 / transform */
export function motionScrubFromTo(
  target: gsap.TweenTarget,
  fromVars: gsap.TweenVars,
  toVars: gsap.TweenVars,
  markers: MotionMarkers,
  id: string,
  trigger: Element,
  range: StRange,
  scrub: number,
): void {
  gsap.fromTo(target, fromVars, {
    ...toVars,
    ease: toVars.ease ?? "none",
    force3D: true,
    scrollTrigger: {
      ...stBase(markers, id, trigger, range),
      scrub,
    },
  });
}

/** scrub：CSS 变量（如 Hero 浪面） */
export function motionScrubCssVars(
  target: Element,
  toVars: Record<string, number | string>,
  markers: MotionMarkers,
  id: string,
  trigger: Element,
  range: StRange,
  scrub: number,
  onScrubUpdate?: (target: Element) => void,
): void {
  gsap.to(target, {
    ...toVars,
    ease: "none",
    scrollTrigger: {
      ...stBase(markers, id, trigger, range),
      scrub,
      onUpdate: () => onScrubUpdate?.(target),
    },
  });
}

/** L2：单次 toggle + clip 揭示 */
export function motionRevealToggle(
  target: gsap.TweenTarget,
  yFrom: number,
  markers: MotionMarkers,
  id: string,
  trigger: Element,
  range: StRange,
  duration = SG_REVEAL.duration,
): void {
  applyRevealPending(target, yFrom);
  gsap.fromTo(
    target,
    { clipPath: SG_CLIP.revealFrom, y: yFrom },
    {
      clipPath: SG_CLIP.revealTo,
      y: 0,
      duration,
      ease: SG_REVEAL.ease,
      force3D: true,
      scrollTrigger: {
        ...stBase(markers, id, trigger, range),
        toggleActions: SG_TOGGLE.reveal,
      },
    },
  );
}

/** L2：多条 clip 揭示共用一个 ScrollTrigger */
export function motionRevealTimeline(
  trigger: Element,
  markers: MotionMarkers,
  id: string,
  range: StRange,
  build: (tl: gsap.core.Timeline) => void,
): void {
  const tl = gsap.timeline({
    scrollTrigger: {
      ...stBase(markers, id, trigger, range),
      toggleActions: SG_TOGGLE.reveal,
    },
  });
  build(tl);
}

/** 呼吸带光晕 opacity scrub */
export function motionBreathGlow(
  glow: HTMLElement,
  zone: HTMLElement,
  markers: MotionMarkers,
  id: string,
  scrub = SG_SCRUB.founderBreath,
): void {
  motionScrubFromTo(
    glow,
    { opacity: 0.06 },
    { opacity: 0.34 },
    markers,
    id,
    zone,
    SG_TRIGGER.breath,
    scrub,
  );
}

/** L3：纯 pin（无 scrub tween） */
export function motionPin(
  pinEl: HTMLElement,
  trigger: HTMLElement,
  markers: MotionMarkers,
  id: string,
  range: StRange,
): void {
  ScrollTrigger.create({
    ...stBase(markers, id, trigger, range),
    pin: pinEl,
    pinSpacing: true,
  });
}

/** L3：pin + scale/y scrub */
export function motionPinScrub(
  card: HTMLElement,
  panel: HTMLElement,
  markers: MotionMarkers,
  id: string,
  end: string,
  scaleTo: number,
  yTo: number,
): void {
  gsap.fromTo(
    card,
    { scale: 1, y: 0 },
    {
      scale: scaleTo,
      y: yTo,
      force3D: true,
      ease: "none",
      scrollTrigger: {
        ...stBase(markers, id, panel, {
          start: SG_TRIGGER.founderPin.start,
          end,
        }),
        pin: true,
        scrub: SG_SCRUB.founderPin,
        anticipatePin: 1,
        fastScrollEnd: true,
      },
    },
  );
}
