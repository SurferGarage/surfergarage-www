"use client";

import {
  useEffect,
  useState,
  type ComponentType,
} from "react";

import { useReducedMotion } from "@/lib/sg-reduced-motion";
import {
  shouldMountWaterVolume,
  useSgWebglTier,
} from "@/lib/sg-webgl-policy";

/**
 * 仅在 `full` tier 时加载全屏 WaterVolumeFx（three Canvas）。
 * idle 后再 import，避免与 Hero WebGL 同时编译 shader。
 */
export function WaterVolumeFxLazy() {
  const reduced = useReducedMotion();
  const tier = useSgWebglTier();
  const [Fx, setFx] = useState<ComponentType | null>(null);

  const canMount =
    reduced === false &&
    tier !== null &&
    shouldMountWaterVolume(tier);

  useEffect(() => {
    if (!canMount) return;

    let cancelled = false;
    let idleId: number | undefined;
    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    const load = () => {
      if (cancelled) return;
      void import("@/components/water-volume-fx").then((m) => {
        if (!cancelled) setFx(() => m.WaterVolumeFx);
      });
    };

    if ("requestIdleCallback" in window) {
      idleId = window.requestIdleCallback(load, { timeout: 2500 });
    } else {
      timeoutId = setTimeout(load, 800);
    }

    return () => {
      cancelled = true;
      if (idleId !== undefined && "cancelIdleCallback" in window) {
        window.cancelIdleCallback(idleId);
      }
      if (timeoutId !== undefined) clearTimeout(timeoutId);
      setFx(null);
    };
  }, [canMount]);

  if (!canMount || !Fx) return null;
  return <Fx />;
}
