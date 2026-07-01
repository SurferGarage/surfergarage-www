"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

import { isSgAtmospherePaused } from "@/components/sg-performance-guards";
import { getHeroWaveSignals, getScrollDepthT, getWaveScrollVel } from "@/lib/sg-scroll-signals";
import {
  shouldMountHeroWebGL,
  shouldUseHeroBloom,
  useSgWebglTier,
} from "@/lib/sg-webgl-policy";
import { useReducedMotion } from "@/lib/sg-reduced-motion";

const GRID_HALF = 21;
const GRID_SEG_BY_TIER: Record<"lite" | "full", number> = {
  lite: 40,
  full: 56,
};
const HERO_BLOOM_INTENSITY = 1.05;
const HERO_BLOOM_THRESHOLD = 0.26;
const HERO_BLOOM_SMOOTHING = 0.26;
const FRAME_INTERVAL_MS = 1000 / 30;

/** demand 模式下按固定间隔 invalidate，避免 60fps 空转 */
function DemandTick({ intervalMs }: { intervalMs: number }) {
  const invalidate = useThree((s) => s.invalidate);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const schedule = () => {
      invalidate();
      timer = setTimeout(schedule, intervalMs);
    };
    schedule();
    return () => clearTimeout(timer);
  }, [intervalMs, invalidate]);

  return null;
}

function waveY(
  x: number,
  z: number,
  t: number,
  amp: number,
  scrollBoost: number,
): number {
  let w =
    Math.sin(x * 0.34 + t * 0.48) * 0.42 +
    Math.sin(z * 0.28 - t * 0.4) * 0.32 +
    Math.sin((x + z) * 0.22 + t * 0.3) * 0.18;
  w *= 0.88 + scrollBoost * 0.28;
  return w * amp;
}

function buildSeaSurfaceGeometry(nx: number, half: number) {
  const vx = nx + 1;
  const vz = nx + 1;
  const vertCount = vx * vz;
  const positions = new Float32Array(vertCount * 3);
  const colors = new Float32Array(vertCount * 3);
  const indices: number[] = [];

  for (let j = 0; j < vz; j++) {
    for (let i = 0; i < vx; i++) {
      const k = j * vx + i;
      positions[k * 3] = (i / nx) * 2 * half - half;
      positions[k * 3 + 1] = 0;
      positions[k * 3 + 2] = (j / nx) * 2 * half - half;
    }
  }
  for (let j = 0; j < nx; j++) {
    for (let i = 0; i < nx; i++) {
      const a = j * vx + i;
      const b = j * vx + i + 1;
      const c = (j + 1) * vx + i + 1;
      const d = (j + 1) * vx + i;
      indices.push(a, b, d, b, c, d);
    }
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  geo.setIndex(indices);
  geo.computeBoundingSphere();
  return { geo, vertCount };
}

function CameraRig() {
  const look = useMemo(() => new THREE.Vector3(), []);

  useFrame((state) => {
    const camera = state.camera;
    if (!(camera instanceof THREE.PerspectiveCamera)) return;
    const w = getHeroWaveSignals();
    camera.position.set(w.camX, w.camY, w.camZ);
    look.set(w.lookX, w.lookY, w.lookZ);
    camera.lookAt(look);
  });

  return null;
}

function CyberSeaSurface({ gridSeg }: { gridSeg: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const { geo, vertCount } = useMemo(
    () => buildSeaSurfaceGeometry(gridSeg, GRID_HALF),
    [gridSeg],
  );
  const lastFrameAt = useRef(0);

  useEffect(() => () => geo.dispose(), [geo]);

  const base = useMemo(
    () => ({
      b: new THREE.Color("#050814"),
      t: new THREE.Color("#0d4a42"),
    }),
    [],
  );
  const tmp = useMemo(() => new THREE.Color(), []);

  useFrame((state) => {
    const now = state.clock.elapsedTime * 1000;
    if (now - lastFrameAt.current < FRAME_INTERVAL_MS) return;
    lastFrameAt.current = now;

    const mesh = meshRef.current;
    if (!mesh) return;

    const w = getHeroWaveSignals();
    const distortion = w.distortion;
    const opacity = w.opacity;
    const boost = getWaveScrollVel();
    const depthShade = Math.max(0.55, 1 - getScrollDepthT() * 0.32);
    const t = state.clock.elapsedTime;
    const amp = Math.max(0.06, distortion) * 0.78;

    const posAttr = mesh.geometry.getAttribute("position") as THREE.BufferAttribute;
    const colAttr = mesh.geometry.getAttribute("color") as THREE.BufferAttribute;
    const arr = posAttr.array as Float32Array;
    const carr = colAttr.array as Float32Array;

    for (let k = 0; k < vertCount; k++) {
      const x = arr[k * 3];
      const z = arr[k * 3 + 2];
      const y = waveY(x, z, t, amp, boost);
      arr[k * 3 + 1] = y;

      const crest = (y / (amp + 1e-4) + 1) * 0.5;
      tmp.copy(base.b).lerp(base.t, Math.min(1, crest * 0.85 + boost * 0.12));
      tmp.multiplyScalar((0.48 + opacity * 0.68) * depthShade);
      carr[k * 3] = tmp.r;
      carr[k * 3 + 1] = tmp.g;
      carr[k * 3 + 2] = tmp.b;
    }
    posAttr.needsUpdate = true;
    colAttr.needsUpdate = true;

    const mat = mesh.material as THREE.MeshBasicMaterial;
    mat.opacity = Math.min(1, 0.22 + opacity * 0.55);
    mat.transparent = true;
  });

  return (
    <mesh ref={meshRef} geometry={geo}>
      <meshBasicMaterial
        depthTest
        depthWrite={false}
        transparent
        vertexColors
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

function HeroWaveCanvasActive({
  variant,
  tier,
  hostSelector,
}: {
  variant: "embedded" | "global";
  tier: "lite" | "full";
  hostSelector: string;
}) {
  const [runLoop, setRunLoop] = useState(false);
  const gridSeg = GRID_SEG_BY_TIER[tier];
  const useBloom = shouldUseHeroBloom(tier);
  const dpr: [number, number] = tier === "full" ? [1, 1.25] : [1, 1];

  useEffect(() => {
    const host = document.querySelector<HTMLElement>(hostSelector);
    if (!host) return;

    const intersecting = { current: false };
    const apply = () => {
      setRunLoop(
        intersecting.current && !document.hidden && !isSgAtmospherePaused(),
      );
    };

    const io = new IntersectionObserver(
      (entries) => {
        const e = entries[0];
        if (!e) return;
        intersecting.current =
          e.isIntersecting && e.intersectionRatio >= 0.1;
        apply();
      },
      { root: null, rootMargin: "0px 0px 8% 0px", threshold: [0, 0.1, 0.2] },
    );
    io.observe(host);
    apply();

    const onVisibility = () => apply();
    document.addEventListener("visibilitychange", onVisibility);
    const mo = new MutationObserver(apply);
    mo.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-sg-atmosphere-paused", "data-doc-hidden"],
    });

    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      mo.disconnect();
      io.disconnect();
    };
  }, [hostSelector]);

  const shellClass =
    variant === "global"
      ? "pointer-events-none fixed inset-0 z-0"
      : "absolute inset-0 z-0";

  return (
    <div className={shellClass} aria-hidden>
      {runLoop ? (
        <Canvas
          camera={{ far: 140, fov: 50, near: 0.06, position: [0, 3.12, 7.6] }}
          dpr={dpr}
          frameloop="demand"
          gl={{
            alpha: true,
            antialias: false,
            depth: true,
            powerPreference: "default",
            stencil: false,
          }}
          style={{ width: "100%", height: "100%" }}
        >
          <DemandTick intervalMs={FRAME_INTERVAL_MS} />
          <CameraRig />
          <CyberSeaSurface gridSeg={gridSeg} />
          {useBloom ? (
            <EffectComposer>
              <Bloom
                intensity={HERO_BLOOM_INTENSITY}
                luminanceSmoothing={HERO_BLOOM_SMOOTHING}
                luminanceThreshold={HERO_BLOOM_THRESHOLD}
                mipmapBlur
              />
            </EffectComposer>
          ) : null}
        </Canvas>
      ) : null}
    </div>
  );
}

export function HeroWaveCanvas({
  hostSelector,
  variant = "embedded",
}: {
  hostSelector: string;
  variant?: "embedded" | "global";
}) {
  const reduced = useReducedMotion();
  const tier = useSgWebglTier();

  if (reduced !== false || tier === null || !shouldMountHeroWebGL(tier)) {
    return null;
  }

  const activeTier: "lite" | "full" = tier === "full" ? "full" : "lite";

  return (
    <HeroWaveCanvasActive
      hostSelector={hostSelector}
      variant={variant}
      tier={activeTier}
    />
  );
}
