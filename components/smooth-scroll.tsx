"use client";

import { useEffect, useState } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import "lenis/dist/lenis.css";

import { LENIS_SCROLL_EVENT } from "@/lib/lenis-scroll-event";

gsap.registerPlugin(ScrollTrigger);

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const [reduced, setReduced] = useState<boolean | null>(null);

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
      return;
    }

    const lenis = new Lenis({
      autoRaf: false,
      lerp: 0.085,
      wheelMultiplier: 0.85,
    });

    lenis.on("scroll", () => {
      ScrollTrigger.update();
      window.dispatchEvent(
        new CustomEvent(LENIS_SCROLL_EVENT, {
          detail: { scroll: lenis.scroll, velocity: lenis.velocity },
        }),
      );
    });

    ScrollTrigger.scrollerProxy(document.documentElement, {
      scrollTop(value) {
        if (typeof value === "number") {
          lenis.scrollTo(value, { immediate: true });
        }
        return lenis.animatedScroll;
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
      lenis.resize();
      ScrollTrigger.refresh();
    };
    window.addEventListener("resize", onResize);

    const ticker = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(ticker);
    gsap.ticker.lagSmoothing(0);

    ScrollTrigger.refresh();

    return () => {
      window.removeEventListener("resize", onResize);
      gsap.ticker.remove(ticker);
      ScrollTrigger.getAll().forEach((t) => t.kill());
      lenis.destroy();
    };
  }, [reduced]);

  return children;
}
