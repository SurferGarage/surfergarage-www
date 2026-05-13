"use client";

import gsap from "gsap";
import { useEffect, useRef } from "react";

import { useLenis } from "@/components/lenis-context";

const VELOCITY_DIVISOR = 2800;

/**
 * Lenis velocity → GSAP quickTo (power2.out ~0.5s) → :root --wave-scroll-vel for shader uniform.
 * No React state on scroll; ticker pushes CSS only.
 */
export function WaveScrollVelocityBridge() {
  const lenis = useLenis();
  const store = useRef({ n: 0 });
  const quickRef = useRef<((value: number) => void) | null>(null);

  useEffect(() => {
    if (!lenis) return;

    const storeObj = store.current;
    quickRef.current = gsap.quickTo(storeObj, "n", {
      duration: 0.5,
      ease: "power2.out",
    });

    const onScroll = () => {
      const capped = Math.min(1, Math.abs(lenis.velocity) / VELOCITY_DIVISOR);
      quickRef.current?.(capped);
    };

    lenis.on("scroll", onScroll);

    const pushToRoot = () => {
      document.documentElement.style.setProperty(
        "--wave-scroll-vel",
        String(storeObj.n),
      );
    };
    gsap.ticker.add(pushToRoot);

    return () => {
      lenis.off("scroll", onScroll);
      gsap.ticker.remove(pushToRoot);
      document.documentElement.style.removeProperty("--wave-scroll-vel");
      storeObj.n = 0;
    };
  }, [lenis]);

  return null;
}
