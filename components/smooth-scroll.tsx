"use client";

import { useEffect, useState } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import "lenis/dist/lenis.css";

import { LenisContext } from "@/components/lenis-context";
import { WaveScrollVelocityBridge } from "@/components/wave-scroll-velocity-bridge";

gsap.registerPlugin(ScrollTrigger);

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const [reduced, setReduced] = useState<boolean | null>(null);
  const [lenis, setLenis] = useState<Lenis | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (reduced === null) return;

    if (reduced) {
      queueMicrotask(() => {
        setLenis(null);
      });
      return;
    }

    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }
    window.scrollTo(0, 0);

    const lenisInstance = new Lenis({
      autoRaf: false,
      lerp: 0.085,
      wheelMultiplier: 0.85,
    });

    queueMicrotask(() => {
      setLenis(lenisInstance);
    });

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

    const onResize = () => {
      lenisInstance.resize();
      ScrollTrigger.refresh();
    };
    window.addEventListener("resize", onResize);

    const ticker = (time: number) => {
      lenisInstance.raf(time * 1000);
    };
    gsap.ticker.add(ticker);
    gsap.ticker.lagSmoothing(0);

    lenisInstance.scrollTo(0, { immediate: true });

    return () => {
      if (stRaf) cancelAnimationFrame(stRaf);
      window.removeEventListener("resize", onResize);
      gsap.ticker.remove(ticker);
      lenisInstance.destroy();
      queueMicrotask(() => {
        setLenis(null);
      });
    };
  }, [reduced]);

  return (
    <LenisContext.Provider value={lenis}>
      <WaveScrollVelocityBridge />
      {children}
    </LenisContext.Provider>
  );
}
