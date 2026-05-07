"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useRef } from "react";

import {
  LENIS_SCROLL_EVENT,
  type LenisScrollDetail,
} from "@/lib/lenis-scroll-event";

import { LifeFieldScene } from "./life-field-scene";
import type { ShaderRenderProfile } from "./shader-field-root";

type ShaderFieldCanvasProps = {
  lowFpsThreshold: number;
  lowFpsWindowMs: number;
  onRuntimeFailure: () => void;
  onPerfSample: (fps: number, dt: number) => void;
  profile: ShaderRenderProfile;
};

export function ShaderFieldCanvas({
  lowFpsThreshold,
  lowFpsWindowMs,
  onRuntimeFailure,
  onPerfSample,
  profile,
}: ShaderFieldCanvasProps) {
  const SAMPLE_INTERVAL_MS = 220;
  const scrollRef = useRef({ scroll: 0, velocity: 0 });
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const onContextLostRef = useRef<((ev: Event) => void) | null>(null);

  useEffect(() => {
    const onLenis = (ev: WindowEventMap["lenis-scroll"]) => {
      const d: LenisScrollDetail = ev.detail;
      scrollRef.current.scroll = d.scroll;
      scrollRef.current.velocity = d.velocity;
    };
    window.addEventListener(LENIS_SCROLL_EVENT, onLenis);
    return () => window.removeEventListener(LENIS_SCROLL_EVENT, onLenis);
  }, []);

  useEffect(() => {
    let rafId = 0;
    let sampleLast = performance.now();
    let frameLast = performance.now();
    let sampleElapsed = 0;
    let sampleFrameCount = 0;
    let lowAccum = 0;

    const tick = (now: number) => {
      if (document.hidden) {
        sampleLast = now;
        frameLast = now;
        sampleElapsed = 0;
        sampleFrameCount = 0;
        lowAccum = 0;
        rafId = window.requestAnimationFrame(tick);
        return;
      }

      const frameDt = now - frameLast;
      frameLast = now;

      // Ignore abnormal gaps after tab switch / lock screen.
      if (frameDt > 250) {
        sampleLast = now;
        sampleElapsed = 0;
        sampleFrameCount = 0;
        lowAccum = 0;
        rafId = window.requestAnimationFrame(tick);
        return;
      }

      sampleFrameCount += 1;
      sampleElapsed = now - sampleLast;

      if (sampleElapsed >= SAMPLE_INTERVAL_MS) {
        const avgFps = sampleFrameCount > 0 ? (sampleFrameCount * 1000) / sampleElapsed : 60;
        onPerfSample(avgFps, sampleElapsed);
        if (avgFps < lowFpsThreshold) {
          lowAccum += sampleElapsed;
        } else {
          lowAccum = Math.max(0, lowAccum - sampleElapsed * 0.7);
        }
        sampleLast = now;
        sampleElapsed = 0;
        sampleFrameCount = 0;
      }

      if (lowAccum >= lowFpsWindowMs) {
        onRuntimeFailure();
        return;
      }

      rafId = window.requestAnimationFrame(tick);
    };

    rafId = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(rafId);
  }, [lowFpsThreshold, lowFpsWindowMs, onPerfSample, onRuntimeFailure]);

  useEffect(() => {
    return () => {
      const canvas = canvasRef.current;
      const onContextLost = onContextLostRef.current;
      if (canvas && onContextLost) {
        canvas.removeEventListener("webglcontextlost", onContextLost);
      }
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-[-1]" aria-hidden>
      <Canvas
        frameloop="always"
        dpr={profile === "high" ? [1, 1.5] : [1, 1.1]}
        gl={{
          alpha: true,
          antialias: false,
          powerPreference: profile === "high" ? "high-performance" : "default",
          stencil: false,
          depth: false,
        }}
        onCreated={({ gl }) => {
          const canvas = gl.domElement;
          canvasRef.current = canvas;

          const onContextLost = (ev: Event) => {
            ev.preventDefault();
            onRuntimeFailure();
          };
          onContextLostRef.current = onContextLost;

          canvas.addEventListener("webglcontextlost", onContextLost, {
            passive: false,
          });
        }}
        style={{ width: "100%", height: "100%" }}
      >
        <Suspense fallback={null}>
          <LifeFieldScene scrollRef={scrollRef} profile={profile} />
        </Suspense>
      </Canvas>
    </div>
  );
}
