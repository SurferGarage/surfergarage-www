"use client";

import gsap from "gsap";
import { useEffect, useRef } from "react";

import { useLenis } from "@/components/lenis-context";
import { setWaveScrollVel } from "@/lib/sg-scroll-signals";

const VELOCITY_DIVISOR = 2800;

/**
 * Lenis velocity → quickTo → `--wave-scroll-vel`。
 * 仅在滚动 / quickTo 变化时写 DOM，**不**挂 gsap.ticker（避免 60fps 空转拖死 CPU）。
 */
export function WaveScrollVelocityBridge() {
  const lenis = useLenis();
  const store = useRef({ n: 0 });
  const quickRef = useRef<((value: number) => void) | null>(null);
  const lastWritten = useRef(-1);

  useEffect(() => {
    if (!lenis) return;

    const storeObj = store.current;

    const pushToRoot = () => {
      const v = storeObj.n;
      if (Math.abs(v - lastWritten.current) < 0.002) return;
      lastWritten.current = v;
      setWaveScrollVel(v);
      document.documentElement.style.setProperty("--wave-scroll-vel", String(v));
    };

    quickRef.current = gsap.quickTo(storeObj, "n", {
      duration: 0.5,
      ease: "power2.out",
      onUpdate: pushToRoot,
    });

    const onScroll = () => {
      const capped = Math.min(1, Math.abs(lenis.velocity) / VELOCITY_DIVISOR);
      quickRef.current?.(capped);
      pushToRoot();
    };

    lenis.on("scroll", onScroll);

    return () => {
      lenis.off("scroll", onScroll);
      gsap.killTweensOf(storeObj);
      quickRef.current = null;
      setWaveScrollVel(0);
      lastWritten.current = -1;
      storeObj.n = 0;
      document.documentElement.style.removeProperty("--wave-scroll-vel");
    };
  }, [lenis]);

  return null;
}
