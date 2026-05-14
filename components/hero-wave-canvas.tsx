"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

/**
 * Topo grid: only horizontal + vertical lines (no triangle wireframe soup).
 * Tuned for calm contrast — brand teal as accent, not full-screen neon.
 */
const GRID_SEG = 30;
const GRID_HALF = 21;
const HERO_BLOOM_INTENSITY = 0.92;
const HERO_BLOOM_THRESHOLD = 0.52;
const HERO_BLOOM_SMOOTHING = 0.11;

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

function buildGridLineGeometry(nx: number, nz: number, half: number) {
  const vx = nx + 1;
  const vz = nz + 1;
  const vertCount = vx * vz;
  const positions = new Float32Array(vertCount * 3);
  const colors = new Float32Array(vertCount * 3);

  const indices: number[] = [];
  for (let j = 0; j < vz; j++) {
    for (let i = 0; i < vx - 1; i++) {
      const a = j * vx + i;
      const b = j * vx + i + 1;
      indices.push(a, b);
    }
  }
  for (let i = 0; i < vx; i++) {
    for (let j = 0; j < vz - 1; j++) {
      const a = j * vx + i;
      const b = (j + 1) * vx + i;
      indices.push(a, b);
    }
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  geo.setIndex(indices);
  geo.computeBoundingSphere();

  const ix = new Float32Array(vertCount);
  const iz = new Float32Array(vertCount);
  for (let j = 0; j < vz; j++) {
    for (let i = 0; i < vx; i++) {
      const k = j * vx + i;
      ix[k] = (i / nx) * 2 * half - half;
      iz[k] = (j / nz) * 2 * half - half;
    }
  }

  return { colors, geo, ix, iz, vertCount };
}

function CameraRig({ hostSelector }: { hostSelector: string }) {
  const hostRef = useRef<HTMLElement | null>(null);
  const look = useMemo(() => new THREE.Vector3(), []);

  useEffect(() => {
    hostRef.current = document.querySelector(hostSelector);
  }, [hostSelector]);

  useFrame((state) => {
    const el = hostRef.current;
    const camera = state.camera;
    if (!el || !(camera instanceof THREE.PerspectiveCamera)) return;
    const cs = getComputedStyle(el);
    const n = (key: string, fallback: number) => {
      const raw = cs.getPropertyValue(key).trim();
      const v = Number.parseFloat(raw);
      return Number.isFinite(v) ? v : fallback;
    };

    camera.position.set(n("--hero-cam-x", 0), n("--hero-cam-y", 3.12), n("--hero-cam-z", 7.6));
    look.set(n("--hero-look-x", 0), n("--hero-look-y", 0.12), n("--hero-look-z", 0));
    camera.lookAt(look);
  });

  return null;
}

function CyberSeaGrid({ hostSelector }: { hostSelector: string }) {
  const lineRef = useRef<THREE.LineSegments>(null);
  const hostRef = useRef<HTMLElement | null>(null);
  const { geo, ix, iz, vertCount } = useMemo(
    () => buildGridLineGeometry(GRID_SEG, GRID_SEG, GRID_HALF),
    [],
  );

  useEffect(() => {
    hostRef.current = document.querySelector(hostSelector);
  }, [hostSelector]);

  const base = useMemo(
    () => ({
      b: new THREE.Color("#050814"),
      t: new THREE.Color("#0d4a42"),
    }),
    [],
  );
  const tmp = useMemo(() => new THREE.Color(), []);

  useFrame((state) => {
    const mesh = lineRef.current;
    if (!mesh) return;

    let distortion = 1;
    let opacity = 0.86;
    const host = hostRef.current;
    if (host) {
      const cs = getComputedStyle(host);
      const d = Number.parseFloat(cs.getPropertyValue("--wave-distortion"));
      const o = Number.parseFloat(cs.getPropertyValue("--wave-opacity"));
      if (Number.isFinite(d)) distortion = d;
      if (Number.isFinite(o)) opacity = o;
    }

    const rootCs = getComputedStyle(document.documentElement);
    const sv = Number.parseFloat(rootCs.getPropertyValue("--wave-scroll-vel"));
    const boost = Number.isFinite(sv) ? sv : 0;
    const dtRaw = Number.parseFloat(rootCs.getPropertyValue("--depth-t"));
    const depthShade = Number.isFinite(dtRaw)
      ? Math.max(0.55, 1 - dtRaw * 0.32)
      : 1;
    const t = state.clock.elapsedTime;
    const amp = Math.max(0.06, distortion) * 0.78;

    const posAttr = mesh.geometry.getAttribute("position") as THREE.BufferAttribute;
    const colAttr = mesh.geometry.getAttribute("color") as THREE.BufferAttribute;
    const arr = posAttr.array as Float32Array;
    const carr = colAttr.array as Float32Array;

    for (let k = 0; k < vertCount; k++) {
      const x = ix[k];
      const z = iz[k];
      const y = waveY(x, z, t, amp, boost);
      arr[k * 3] = x;
      arr[k * 3 + 1] = y;
      arr[k * 3 + 2] = z;

      const crest = (y / (amp + 1e-4) + 1) * 0.5;
      tmp.copy(base.b).lerp(base.t, Math.min(1, crest * 0.85 + boost * 0.12));
      tmp.multiplyScalar((0.35 + opacity * 0.55) * depthShade);
      carr[k * 3] = tmp.r;
      carr[k * 3 + 1] = tmp.g;
      carr[k * 3 + 2] = tmp.b;
    }
    posAttr.needsUpdate = true;
    colAttr.needsUpdate = true;

    const mat = mesh.material as THREE.LineBasicMaterial;
    mat.opacity = Math.min(1, 0.22 + opacity * 0.52);
    mat.transparent = true;
  });

  return (
    <lineSegments geometry={geo} ref={lineRef}>
      <lineBasicMaterial
        depthTest
        depthWrite={false}
        transparent
        vertexColors
      />
    </lineSegments>
  );
}

function HeroWaveCanvasActive({
  hostSelector,
  variant,
}: {
  hostSelector: string;
  variant: "embedded" | "global";
}) {
  const [runLoop, setRunLoop] = useState(true);

  useEffect(() => {
    const host = document.querySelector<HTMLElement>(hostSelector);
    if (!host) return;

    const intersecting = { current: true };
    const apply = () => {
      setRunLoop(intersecting.current && !document.hidden);
    };

    const io = new IntersectionObserver(
      (entries) => {
        const e = entries[0];
        if (!e) return;
        intersecting.current = e.isIntersecting;
        apply();
      },
      { root: null, rootMargin: "0px 0px 12% 0px", threshold: 0 },
    );
    io.observe(host);
    apply();

    const onVisibility = () => {
      apply();
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      io.disconnect();
    };
  }, [hostSelector]);

  const shellClass =
    variant === "global"
      ? "pointer-events-none fixed inset-0 z-0"
      : "absolute inset-0 z-0";

  return (
    <div className={shellClass} aria-hidden>
      <Canvas
        camera={{ far: 140, fov: 50, near: 0.06, position: [0, 3.12, 7.6] }}
        dpr={[1, 1.5]}
        frameloop={runLoop ? "always" : "never"}
        gl={{
          alpha: true,
          antialias: true,
          depth: true,
          powerPreference: "high-performance",
          stencil: false,
        }}
        style={{ width: "100%", height: "100%" }}
      >
        <CameraRig hostSelector={hostSelector} />
        <CyberSeaGrid hostSelector={hostSelector} />
        <EffectComposer>
          <Bloom
            intensity={HERO_BLOOM_INTENSITY}
            luminanceSmoothing={HERO_BLOOM_SMOOTHING}
            luminanceThreshold={HERO_BLOOM_THRESHOLD}
            mipmapBlur
          />
        </EffectComposer>
      </Canvas>
    </div>
  );
}

export function HeroWaveCanvas({
  hostSelector,
  variant = "embedded",
}: {
  hostSelector: string;
  /** `global`: root layout singleton, fixed under content. */
  variant?: "embedded" | "global";
}) {
  const [reduced, setReduced] = useState<boolean | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  if (reduced !== false) return null;

  return <HeroWaveCanvasActive hostSelector={hostSelector} variant={variant} />;
}
