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
    void import("@/components/water-volume-fx").then((m) => {
      if (!cancelled) setFx(() => m.WaterVolumeFx);
    });

    return () => {
      cancelled = true;
    };
  }, [canMount]);

  if (!canMount || !Fx) return null;
  return <Fx />;
}
