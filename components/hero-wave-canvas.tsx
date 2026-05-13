"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

/**
 * Lightweight "Cyber-Ocean" (wireframe + vertex displacement).
 * Not Seascape / raymarching — Harmless Engineering: stable 60fps class budget.
 */
const HERO_BLOOM_INTENSITY = 1.55;
const HERO_BLOOM_THRESHOLD = 0.42;
const HERO_BLOOM_SMOOTHING = 0.14;

const seaVertexShader = `
uniform float uTime;
uniform float uDispAmp;
uniform float uScrollBoost;
varying float vWave;

void main() {
  vec3 p = position;
  float w = sin(p.x * 0.36 + uTime * 0.52) * 0.48;
  w += sin(p.y * 0.3 - uTime * 0.44) * 0.36;
  w += sin((p.x + p.y) * 0.26 + uTime * 0.33) * 0.22;
  w *= (0.88 + uScrollBoost * 0.35);
  p += normal * w * uDispAmp;
  vWave = w;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
}
`;

const seaFragmentShader = `
precision highp float;
uniform float uOpacity;
varying float vWave;

void main() {
  vec3 crest = vec3(39.0 / 255.0, 215.0 / 255.0, 199.0 / 255.0);
  vec3 deep = vec3(0.0, 0.0, 0.22);
  float m = clamp(0.28 + vWave * 1.65, 0.0, 1.0);
  vec3 c = mix(deep, crest, m * m);
  c *= 1.32;
  gl_FragColor = vec4(c, uOpacity);
}
`;

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

function CyberSea({ hostSelector }: { hostSelector: string }) {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const hostRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    hostRef.current = document.querySelector(hostSelector);
  }, [hostSelector]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uDispAmp: { value: 1 },
      uOpacity: { value: 0.86 },
      uScrollBoost: { value: 0 },
    }),
    [],
  );

  useFrame((state) => {
    const mat = materialRef.current;
    if (!mat) return;

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
    mat.uniforms.uScrollBoost.value = Number.isFinite(sv) ? sv : 0;
    mat.uniforms.uTime.value = state.clock.elapsedTime;
    mat.uniforms.uDispAmp.value = Math.max(0.05, distortion) * 0.82;
    mat.uniforms.uOpacity.value = opacity;
  });

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
      <planeGeometry args={[52, 52, 96, 96]} />
      <shaderMaterial
        ref={materialRef}
        fragmentShader={seaFragmentShader}
        transparent
        uniforms={uniforms}
        vertexShader={seaVertexShader}
        wireframe
        depthTest
        depthWrite
      />
    </mesh>
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
        <CyberSea hostSelector={hostSelector} />
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
