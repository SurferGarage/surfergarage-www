"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";

import { useLenis } from "@/components/lenis-context";
import { isSgAtmospherePaused } from "@/components/sg-performance-guards";
import { useReducedMotion } from "@/lib/sg-reduced-motion";
import { getScrollDepthT, getWaveScrollVel } from "@/lib/sg-scroll-signals";

function clamp(n: number, a: number, b: number): number {
  return Math.max(a, Math.min(b, n));
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/** 光球主色：浅海青 → 水中亮黄（由 depth / 滚动进度驱动） */
function setOrbColors(root: HTMLElement, colorT: number): void {
  const t = clamp(colorT, 0, 1);
  const r0 = 72;
  const g0 = 232;
  const b0 = 218;
  const r1 = 255;
  const g1 = 244;
  const b1 = 118;
  const r = lerp(r0, r1, t) | 0;
  const g = lerp(g0, g1, t) | 0;
  const b = lerp(b0, b1, t) | 0;
  root.style.setProperty("--uwl-orb-mid", `rgb(${r}, ${g}, ${b})`);
  root.style.setProperty(
    "--uwl-orb-soft",
    `rgba(${lerp(24, 255, t * 0.55) | 0}, ${lerp(120, 230, t * 0.5) | 0}, ${lerp(140, 120, t * 0.35) | 0}, ${lerp(0.22, 0.38, t).toFixed(3)})`,
  );
  root.style.setProperty("--uwl-color-t", t.toFixed(4));
}

/**
 * 首页背景栈内氛围层：顶区「颠倒」水面高光 + 随滚动下沉的光球（青→黄）。
 */
export function UnderwaterLightStage(): ReactNode {
  const lenis = useLenis();
  const reduced = useReducedMotion();
  const lastScrollRef = useRef(0);
  const impulseRef = useRef(0);

  useEffect(() => {
    if (reduced !== false) return;

    const root = document.documentElement;
    const scrollRoot = document.querySelector<HTMLElement>(
      "[data-scroll-depth-root]",
    );

    const maxScroll = (): number => {
      const el = scrollRoot ?? document.documentElement;
      return Math.max(1, el.scrollHeight - window.innerHeight);
    };

    const readScroll = (): number => {
      if (lenis) return lenis.animatedScroll;
      return window.scrollY;
    };

    lastScrollRef.current = readScroll();

    const tick = (): void => {
      if (isSgAtmospherePaused()) return;

      const scroll = readScroll();
      const max = maxScroll();
      const p = clamp(scroll / max, 0, 1);

      const dtRaw = getScrollDepthT();
      const depthOk = Number.isFinite(dtRaw);
      const yProg = depthOk ? clamp(dtRaw, 0, 1) : p;
      const orbY = 0.07 + yProg * 0.78;
      root.style.setProperty("--uwl-orb-y", orbY.toFixed(4));

      const delta = scroll - lastScrollRef.current;
      lastScrollRef.current = scroll;
      impulseRef.current =
        impulseRef.current * 0.88 + clamp(delta, -120, 120) * 0.00035;

      const vel = getWaveScrollVel();

      const wander = Math.sin(scroll * 0.0018) * 0.04;
      const baseX = 0.36 + wander + impulseRef.current + (vel - 0.5) * 0.05;
      root.style.setProperty("--uwl-orb-x", clamp(baseX, 0.26, 0.5).toFixed(4));

      const colorT = depthOk ? clamp(dtRaw, 0, 1) : p;
      setOrbColors(root, colorT);
      const tyndall = 1 - clamp(colorT, 0, 1) * 0.82;
      root.style.setProperty("--uwl-tyndall", tyndall.toFixed(4));
    };

    let raf = 0;
    const schedule = (): void => {
      if (isSgAtmospherePaused()) return;
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        tick();
      });
    };

    tick();

    const onLenisScroll = (): void => {
      schedule();
    };

    if (lenis) {
      lenis.on("scroll", onLenisScroll);
    } else {
      window.addEventListener("scroll", schedule, { passive: true });
    }
    window.addEventListener("resize", schedule);

    return () => {
      if (lenis) lenis.off("scroll", onLenisScroll);
      else window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (raf) cancelAnimationFrame(raf);
      root.style.removeProperty("--uwl-orb-y");
      root.style.removeProperty("--uwl-orb-x");
      root.style.removeProperty("--uwl-orb-mid");
      root.style.removeProperty("--uwl-orb-soft");
      root.style.removeProperty("--uwl-color-t");
      root.style.removeProperty("--uwl-tyndall");
    };
  }, [lenis, reduced]);

  if (reduced !== false) return null;

  return (
    <div className="uwl-stage" aria-hidden>
      <div className="uwl-surface" />
      <div className="uwl-aperture" />
      <div className="uwl-godrays">
        {[-28, -18, -9, 2, 12, 22, 32].map((deg) => (
          <span
            key={deg}
            className="uwl-ray"
            style={{ "--uwl-ray-deg": `${deg}deg` } as CSSProperties}
          />
        ))}
      </div>
      <div className="uwl-orb-shell">
        <div className="uwl-orb-glow" />
        <div className="uwl-orb-hot" />
      </div>
    </div>
  );
}
