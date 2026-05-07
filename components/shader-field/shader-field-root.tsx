"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { ShaderFieldCanvas } from "./shader-field-canvas";

const LOW_FPS_THRESHOLD = 28;
const LOW_FPS_WINDOW_MS = 2800;
const FORCE_DISABLE_WEBGL_BG = process.env.NEXT_PUBLIC_DISABLE_WEBGL_BG === "1";
export type ShaderRenderProfile = "high" | "balanced" | "safe";

export function ShaderFieldRoot() {
  const [profile, setProfile] = useState<ShaderRenderProfile | null>(null);
  const [disabledByPerf, setDisabledByPerf] = useState(false);
  const calibStartRef = useRef(0);
  const lowFpsAccumRef = useRef(0);
  const highFpsAccumRef = useRef(0);
  const resetCalibration = useCallback(() => {
    calibStartRef.current = performance.now();
    lowFpsAccumRef.current = 0;
    highFpsAccumRef.current = 0;
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => {
      if (FORCE_DISABLE_WEBGL_BG) {
        setProfile("safe");
        setDisabledByPerf(false);
        resetCalibration();
        return;
      }

      const nav = navigator as Navigator & {
        connection?: { saveData?: boolean; effectiveType?: string };
      };
      const prefersReduce = mq.matches;
      const saveData = nav.connection?.saveData === true;
      const weakNetwork = /2g/.test(nav.connection?.effectiveType ?? "");
      const cpuThreads = nav.hardwareConcurrency ?? 8;
      const lowCpu = cpuThreads <= 4;
      const smallTouchScreen =
        window.matchMedia("(max-width: 900px)").matches &&
        window.matchMedia("(pointer: coarse)").matches;

      let nextProfile: ShaderRenderProfile = "high";
      if (prefersReduce || saveData || weakNetwork || (lowCpu && smallTouchScreen)) {
        nextProfile = "safe";
      } else if (lowCpu || smallTouchScreen || cpuThreads <= 6) {
        nextProfile = "balanced";
      }

      setProfile(nextProfile);
      setDisabledByPerf(false);
      resetCalibration();
    };
    sync();

    if ("addEventListener" in mq) {
      mq.addEventListener("change", sync);
      return () => mq.removeEventListener("change", sync);
    }

    const legacyMq = mq as MediaQueryList & {
      addListener: (listener: (this: MediaQueryList, ev: MediaQueryListEvent) => unknown) => void;
      removeListener: (listener: (this: MediaQueryList, ev: MediaQueryListEvent) => unknown) => void;
    };
    legacyMq.addListener(sync);
    return () => legacyMq.removeListener(sync);
  }, [resetCalibration]);

  const onRuntimeFailure = useMemo(
    () => () => {
      setDisabledByPerf(true);
    },
    [],
  );

  const onPerfSample = useCallback(
    (fps: number, dt: number) => {
      if (!profile || profile === "safe") return;
      const elapsed = performance.now() - calibStartRef.current;
      if (elapsed > 3000) return;

      if (fps < 34) {
        lowFpsAccumRef.current += dt;
      } else if (fps > 53) {
        highFpsAccumRef.current += dt;
      }

      if (elapsed < 2900) return;

      const lowRatio = lowFpsAccumRef.current / Math.max(1, elapsed);
      const highRatio = highFpsAccumRef.current / Math.max(1, elapsed);

      if (profile === "high" && lowRatio > 0.32) {
        setProfile("balanced");
        resetCalibration();
      } else if (profile === "balanced" && lowRatio > 0.5) {
        setProfile("safe");
        resetCalibration();
      } else if (profile === "balanced" && highRatio > 0.82) {
        setProfile("high");
        resetCalibration();
      }
    },
    [profile, resetCalibration],
  );

  if (profile === null || profile === "safe" || disabledByPerf) return null;

  return (
    <ShaderFieldCanvas
      lowFpsThreshold={LOW_FPS_THRESHOLD}
      lowFpsWindowMs={LOW_FPS_WINDOW_MS}
      onRuntimeFailure={onRuntimeFailure}
      onPerfSample={onPerfSample}
      profile={profile}
    />
  );
}
