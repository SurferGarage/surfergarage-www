"use client";

import { useEffect, useState } from "react";

import { readReducedMotion } from "@/lib/sg-reduced-motion";

/**
 * WebGL 分级（默认 **off**，避免打开页面拖死整机）。
 * - `off`：不挂载任何 Canvas（仅 CSS 渐变 / 光河）
 * - `lite`：仅 Hero 海面（低网格、无 Bloom）
 * - `full`：Hero + Bloom + 全屏 WaterVolumeFx
 *
 * 显式开启：`NEXT_PUBLIC_SG_WEBGL=lite` 或 `full`
 */
export type SgWebglTier = "off" | "lite" | "full";

export function detectSgWebglTier(): SgWebglTier {
  if (typeof window === "undefined") return "off";
  if (readReducedMotion()) return "off";

  const forced = process.env.NEXT_PUBLIC_SG_WEBGL?.toLowerCase();
  if (forced === "off" || forced === "0" || forced === "false") return "off";
  if (forced === "lite") return "lite";
  if (forced === "full" || forced === "on" || forced === "1" || forced === "true") {
    return "full";
  }

  return "off";
}

export function useSgWebglTier(): SgWebglTier | null {
  const [tier, setTier] = useState<SgWebglTier | null>(null);

  useEffect(() => {
    const sync = () => setTier(detectSgWebglTier());
    sync();

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    mq.addEventListener("change", sync);
    window.addEventListener("resize", sync);

    return () => {
      mq.removeEventListener("change", sync);
      window.removeEventListener("resize", sync);
    };
  }, []);

  return tier;
}

export function shouldMountHeroWebGL(tier: SgWebglTier): boolean {
  return tier === "lite" || tier === "full";
}

export function shouldMountWaterVolume(tier: SgWebglTier): boolean {
  return tier === "full";
}

export function shouldUseHeroBloom(tier: SgWebglTier): boolean {
  return tier === "full";
}
