"use client";

import "@/components/motion/gsap-register";
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
  applyReducedMotionStatic,
  useReducedMotion,
} from "@/lib/sg-reduced-motion";
import gsap from "gsap";

const ST_MARKERS =
  typeof process !== "undefined" &&
  process.env.NEXT_PUBLIC_GSAP_DEBUG === "1";

/**
 * 首页滚动编排唯一 React 挂载点。
 * 注册顺序与分层见 `sg-home-registry.ts` / `wiki/动效.md`。
 */
export function HomeScrollChoreography() {
  const reduced = useReducedMotion();

  useLayoutEffect(() => {
    if (reduced === null) return;

    if (reduced) {
      return applyReducedMotionStatic();
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

    ScrollTrigger.refresh();

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
      window.removeEventListener("resize", onResize);
      if (resizeT) clearTimeout(resizeT);
      mm.revert();
      ctx.revert();
    };
  }, [reduced]);

  return null;
}
