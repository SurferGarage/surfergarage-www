"use client";

import { usePathname } from "next/navigation";
import { useLayoutEffect } from "react";

import { finishMotionInit } from "@/lib/sg-motion-init";
import { readReducedMotion } from "@/lib/sg-reduced-motion";

/**
 * 首页编排独占 `sg-motion-ready`；非首页 / 直达子路由须自行解锁 html 滚动。
 */
export function SgScrollReadyGuard() {
  const pathname = usePathname();

  useLayoutEffect(() => {
    if (readReducedMotion()) return;
    if (pathname !== "/") {
      finishMotionInit();
    }
  }, [pathname]);

  return null;
}
