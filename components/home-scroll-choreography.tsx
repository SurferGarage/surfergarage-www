"use client";

import "@/components/motion/gsap-register";
import { useLenis } from "@/components/lenis-context";
import {
  collectHomeMotionDomRefs,
  registerHomeDesktopMotion,
  registerHomeMobileMotion,
  registerHomeScrollMotion,
} from "@/components/motion/sg-home-registry";
import { useLayoutEffect } from "react";
import { SG_MEDIA_MD_MAX, SG_MEDIA_MD_MIN } from "@/lib/sg-breakpoints";
import {
  finishMotionInit,
  primeHeroMotionState,
} from "@/lib/sg-motion-init";
import {
  applyReducedMotionStatic,
  readReducedMotion,
} from "@/lib/sg-reduced-motion";
import {
  forceScrollTop,
  isScrollViewportLocked,
  lockViewportDuringMotionInit,
  refreshScrollTriggersHoldTop,
  unlockViewportAfterMotionInit,
} from "@/lib/scroll-top-lock";
import { teardownScrollMotion } from "@/lib/sg-scroll-teardown";
import gsap from "gsap";

const ST_MARKERS =
  typeof process !== "undefined" &&
  process.env.NEXT_PUBLIC_GSAP_DEBUG === "1";

/**
 * 首页滚动编排唯一 React 挂载点。
 * 须在 Lenis + scrollerProxy 就绪后再注册 ST；refresh 后钉回顶部，避免刷新回弹。
 */
export function HomeScrollChoreography() {
  const lenis = useLenis();

  useLayoutEffect(() => {
    const reduced = readReducedMotion();

    if (reduced) {
      return applyReducedMotionStatic();
    }

    primeHeroMotionState();
    forceScrollTop(lenis);

    if (lenis === null) {
      const t = window.setTimeout(() => {
        if (readReducedMotion()) return;
        finishMotionInit();
      }, 2500);
      return () => {
        window.clearTimeout(t);
      };
    }

    const refs = collectHomeMotionDomRefs();

    lockViewportDuringMotionInit();

    const ctx = gsap.context(() => {
      registerHomeScrollMotion(ST_MARKERS, refs);
    });

    const mm = gsap.matchMedia();
    mm.add(SG_MEDIA_MD_MAX, () => {
      registerHomeMobileMotion(ST_MARKERS);
    });
    mm.add(SG_MEDIA_MD_MIN, () => {
      return registerHomeDesktopMotion(ST_MARKERS, refs);
    });

    let refreshCancelled = false;
    let refreshRaf = 0;
    let refreshGeneration = 0;
    const generation = ++refreshGeneration;

    refreshRaf = requestAnimationFrame(() => {
      if (refreshCancelled || generation !== refreshGeneration) return;
      unlockViewportAfterMotionInit(lenis);
      refreshRaf = requestAnimationFrame(() => {
        if (refreshCancelled || generation !== refreshGeneration) return;
        refreshScrollTriggersHoldTop(lenis);
        forceScrollTop(lenis);
        finishMotionInit();
      });
    });

    let fontsCancelled = false;
    void document.fonts?.ready?.then(() => {
      if (fontsCancelled) return;
      if (isScrollViewportLocked()) return;
      const nearTop = (lenis?.scroll ?? window.scrollY) < 120;
      if (!nearTop) return;
      refreshScrollTriggersHoldTop(lenis);
    });

    return () => {
      fontsCancelled = true;
      refreshCancelled = true;
      refreshGeneration += 1;
      if (refreshRaf) cancelAnimationFrame(refreshRaf);
      unlockViewportAfterMotionInit(lenis);
      mm.revert();
      ctx.revert();
      teardownScrollMotion();
      finishMotionInit();
    };
  }, [lenis]);

  return null;
}
