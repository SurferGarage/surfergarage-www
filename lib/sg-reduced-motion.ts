"use client";

import { useEffect, useState } from "react";

import { setScrollDepthT } from "@/lib/sg-scroll-signals";

/** 与全站动效 / WebGL 降级共用 */
export const SG_REDUCED_MOTION_MQ = "(prefers-reduced-motion: reduce)";

export function readReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia(SG_REDUCED_MOTION_MQ).matches;
}

/** `null` = 尚未探测（SSR 首帧） */
export function useReducedMotion(): boolean | null {
  const [reduced, setReduced] = useState<boolean | null>(null);

  useEffect(() => {
    const mq = window.matchMedia(SG_REDUCED_MOTION_MQ);
    const sync = () => setReduced(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  return reduced;
}

/** GSAP / Lenis 不注册时的静态深度；返回 cleanup */
export function applyReducedMotionStatic(): () => void {
  setScrollDepthT(0);
  document.documentElement.style.setProperty("--depth-t", "0");
  return () => {
    setScrollDepthT(0);
    document.documentElement.style.removeProperty("--depth-t");
  };
}
