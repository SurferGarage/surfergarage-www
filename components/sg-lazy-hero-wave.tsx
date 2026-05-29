"use client";

import {
  useEffect,
  useState,
  type ComponentType,
} from "react";

import { useReducedMotion } from "@/lib/sg-reduced-motion";
import {
  shouldMountHeroWebGL,
  useSgWebglTier,
} from "@/lib/sg-webgl-policy";

type HeroWaveProps = {
  hostSelector: string;
  variant?: "embedded" | "global";
};

/**
 * 仅在 WebGL tier 允许时 `import()` Hero 海面，避免 `off` 时仍拉取 three / r3f 整包占满内存。
 */
export function HeroWaveCanvasLazy(props: HeroWaveProps) {
  const reduced = useReducedMotion();
  const tier = useSgWebglTier();
  const [Hero, setHero] = useState<ComponentType<HeroWaveProps> | null>(null);

  const canMount =
    reduced === false &&
    tier !== null &&
    shouldMountHeroWebGL(tier);

  useEffect(() => {
    if (!canMount) return;

    let cancelled = false;
    void import("@/components/hero-wave-canvas").then((m) => {
      if (!cancelled) setHero(() => m.HeroWaveCanvas);
    });

    return () => {
      cancelled = true;
    };
  }, [canMount]);

  if (!canMount || !Hero) return null;
  return <Hero {...props} />;
}
