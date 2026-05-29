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
import { ScrollTrigger } from "@/components/motion/gsap-register";
import { SG_MEDIA_MD_MAX, SG_MEDIA_MD_MIN } from "@/lib/sg-breakpoints";
import {
  finishMotionInit,
  primeHeroMotionState,
} from "@/lib/sg-motion-init";
import {
  applyReducedMotionStatic,
  readReducedMotion,
} from "@/lib/sg-reduced-motion";
import gsap from "gsap";

const ST_MARKERS =
  typeof process !== "undefined" &&
  process.env.NEXT_PUBLIC_GSAP_DEBUG === "1";

/**
 * 首页滚动编排唯一 React 挂载点。
 * 须在 Lenis + scrollerProxy 就绪后再注册 ST，避免刷新时二次 layout 与怪动画。
 */
export function HomeScrollChoreography() {
  const lenis = useLenis();

  useLayoutEffect(() => {
    const reduced = readReducedMotion();

    if (reduced) {
      return applyReducedMotionStatic();
    }

    primeHeroMotionState();

    if (lenis === null) {
      return () => {
        document.documentElement.classList.remove("sg-motion-ready");
      };
    }

    const refs = collectHomeMotionDomRefs();

    const ctx = gsap.context(() => {
      registerHomeScrollMotion(ST_MARKERS, refs);
    });

    const mm = gsap.matchMedia();
    mm.add(SG_MEDIA_MD_MAX, () => {
      registerHomeMobileMotion(ST_MARKERS);
    });
    mm.add(SG_MEDIA_MD_MIN, () => {
      registerHomeDesktopMotion(ST_MARKERS, refs);
    });

    let refreshRaf = 0;
    refreshRaf = requestAnimationFrame(() => {
      ScrollTrigger.refresh();
      finishMotionInit();
    });

    let resizeT: ReturnType<typeof setTimeout> | undefined;
    const onResize = () => {
      if (resizeT) clearTimeout(resizeT);
      resizeT = setTimeout(() => {
        resizeT = undefined;
        ScrollTrigger.refresh();
      }, 200);
    };
    window.addEventListener("resize", onResize);

    let fontsCancelled = false;
    void document.fonts?.ready?.then(() => {
      if (!fontsCancelled) ScrollTrigger.refresh();
    });

    return () => {
      fontsCancelled = true;
      if (refreshRaf) cancelAnimationFrame(refreshRaf);
      window.removeEventListener("resize", onResize);
      if (resizeT) clearTimeout(resizeT);
      document.documentElement.classList.remove("sg-motion-ready");
      mm.revert();
      ctx.revert();
    };
  }, [lenis]);

  return null;
}
