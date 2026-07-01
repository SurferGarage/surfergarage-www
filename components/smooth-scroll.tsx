"use client";

import { useEffect, useRef, useState } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/components/motion/gsap-register";

import "lenis/dist/lenis.css";

import { LenisContext } from "@/components/lenis-context";
import { SgScrollReadyGuard } from "@/components/sg-scroll-ready-guard";
import { WaveScrollVelocityBridge } from "@/components/wave-scroll-velocity-bridge";
import {
  forceScrollTop,
  refreshScrollTriggersHoldTop,
} from "@/lib/scroll-top-lock";
import { readReducedMotion } from "@/lib/sg-reduced-motion";
import { teardownScrollMotion } from "@/lib/sg-scroll-teardown";

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null);
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    if (readReducedMotion()) return;

    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }
    forceScrollTop(null);

    const lenisInstance = new Lenis({
      autoRaf: false,
      lerp: 0.085,
      wheelMultiplier: 0.85,
    });

    lenisRef.current = lenisInstance;

    let stRaf = 0;
    lenisInstance.on("scroll", () => {
      if (stRaf) return;
      stRaf = requestAnimationFrame(() => {
        stRaf = 0;
        ScrollTrigger.update();
      });
    });

    ScrollTrigger.scrollerProxy(document.documentElement, {
      scrollTop(value) {
        if (typeof value === "number") {
          lenisInstance.scrollTo(value, { immediate: true });
        }
        return lenisInstance.animatedScroll;
      },
      getBoundingClientRect() {
        return {
          top: 0,
          left: 0,
          width: window.innerWidth,
          height: window.innerHeight,
        };
      },
    });

    let resizeT: ReturnType<typeof setTimeout> | undefined;
    const onResize = () => {
      if (resizeT) clearTimeout(resizeT);
      resizeT = setTimeout(() => {
        resizeT = undefined;
        lenisInstance.resize();
        refreshScrollTriggersHoldTop(lenisInstance, { preserveScroll: true });
      }, 200);
    };
    window.addEventListener("resize", onResize);

    const ticker = (time: number) => {
      lenisInstance.raf(time * 1000);
    };
    gsap.ticker.add(ticker);
    gsap.ticker.lagSmoothing(0);

    forceScrollTop(lenisInstance);

    queueMicrotask(() => {
      setLenis(lenisInstance);
    });

    return () => {
      if (stRaf) cancelAnimationFrame(stRaf);
      if (resizeT) clearTimeout(resizeT);
      window.removeEventListener("resize", onResize);
      gsap.ticker.remove(ticker);
      ScrollTrigger.scrollerProxy(document.documentElement, {});
      teardownScrollMotion();
      lenisInstance.destroy();
      lenisRef.current = null;
      queueMicrotask(() => {
        setLenis(null);
      });
    };
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => {
      if (!mq.matches) return;
      lenisRef.current?.destroy();
      lenisRef.current = null;
      ScrollTrigger.scrollerProxy(document.documentElement, {});
      teardownScrollMotion();
      setLenis(null);
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return (
    <LenisContext.Provider value={lenis}>
      <SgScrollReadyGuard />
      <WaveScrollVelocityBridge />
      {children}
    </LenisContext.Provider>
  );
}
