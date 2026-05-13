"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

/** 「深海闪电 / 巨浪」视觉基线（与 wiki/00-Vision 一致；调参请同步文档）。 */
const HERO_WAVE_VERTICAL_AMPLITUDE = 3.1;
const HERO_WAVE_RIBBON_THICKNESS = 8;
const HERO_WAVE_RIBBON_REF = 5;
const HERO_WAVE_BLOOM_INTENSITY = 1.95;
const HERO_WAVE_BLOOM_LUMINANCE_THRESHOLD = 0.58;
const HERO_WAVE_BLOOM_LUMINANCE_SMOOTHING = 0.12;

const vertexShader = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 1.0);
}
`;

const fragmentShader = `
precision highp float;
varying vec2 vUv;

uniform float uTime;
uniform vec2 uResolution;
uniform vec2 uPointer;
uniform float uPointerForce;
uniform float uDistortion;
uniform float uOpacity;
uniform float uScrollVel;

const float VERTICAL_AMPLITUDE = ${HERO_WAVE_VERTICAL_AMPLITUDE.toFixed(2)};
const float RIBBON_EDGE_SCALE = ${(HERO_WAVE_RIBBON_THICKNESS / HERO_WAVE_RIBBON_REF).toFixed(4)};
// Tighter core = smaller lineW (screen-space thickness at sin zero-crossings).
const float LINE_CORE = 0.048 / max(0.85, RIBBON_EDGE_SCALE);

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  float a = hash(i + vec2(0.0, 0.0));
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  mat2 m = mat2(1.6, 1.2, -1.2, 1.6);
  for (int i = 0; i < 5; i++) {
    v += a * noise(p);
    p = m * p;
    a *= 0.52;
  }
  return v;
}

void main() {
  vec2 uv = vUv;
  vec2 p = uv * 2.0 - 1.0;
  p.x *= uResolution.x / max(1.0, uResolution.y);

  float t = uTime * 0.16;
  // Wider, slower fbm so flow undulates like water, not TV static.
  float n = fbm(uv * vec2(0.92, 0.52) + vec2(t * 0.14, -t * 0.11));

  vec2 pointer = vec2(uPointer.x, 1.0 - uPointer.y);
  float dist = distance(uv, pointer);
  // Small radius, violent repulsion.
  float pointerBlast = exp(-dist * 34.0) * uPointerForce;

  float distortion = max(0.02, uDistortion);
  float scrollBoost = 1.0 + uScrollVel * 0.48;
  float flow = p.y;
  flow += n * 0.72 * VERTICAL_AMPLITUDE * distortion * scrollBoost;
  flow += pointerBlast * 2.35 * distortion;
  flow += sin(p.x * 1.35 - t * 1.15) * 0.11 * VERTICAL_AMPLITUDE * distortion * scrollBoost;

  // Sharp parallel ridges: thin bright band at sin zero-crossings (not wide smoothstep on |sin| peaks).
  float k = 2.52;
  float ph = p.x * 0.56 + t * 0.19;
  float lw = LINE_CORE * mix(1.15, 0.82, distortion);
  float r0 = 1.0 - smoothstep(0.0, lw, abs(sin(flow * k + ph)));
  float r1 = 1.0 - smoothstep(0.0, lw, abs(sin(flow * k + ph + 2.094395102)));
  float r2 = 1.0 - smoothstep(0.0, lw, abs(sin(flow * k + ph + 4.188790205)));
  float k2 = 1.88;
  float ph2 = -p.x * 0.4 + t * 0.11;
  float r3 = 1.0 - smoothstep(0.0, lw * 1.08, abs(sin(flow * k2 + ph2 + 1.047197551)));

  float ribbons = max(max(r0, r1), max(r2, r3 * 0.9));

  // Folded parallel harmonics (fract): subtle extra ripple, low weight so it does not re-fog.
  float fold = abs(fract(flow * 0.36 + p.x * 0.2 + n * 0.07 + t * 0.03) - 0.5) * 2.0;
  float rip = (1.0 - smoothstep(0.4, 0.5, fold)) * 0.2;
  ribbons = max(ribbons, rip);

  ribbons = pow(clamp(ribbons, 0.0, 1.0), 0.92);

  // Brand: trough = lightning blue #0000E2, crest = teal #27D7C7 (only where ribbons peak).
  vec3 baseBlue = vec3(0.0, 0.0, 226.0 / 255.0);
  vec3 peakTeal = vec3(39.0 / 255.0, 215.0 / 255.0, 199.0 / 255.0);
  float peak = smoothstep(0.22, 0.98, ribbons);
  vec3 waveColor = mix(baseBlue, peakTeal, peak * 0.94);
  vec3 color = waveColor * (0.42 + ribbons * (2.35 + uScrollVel * 0.42));

  gl_FragColor = vec4(color, ribbons * uOpacity);
}
`;

function WavePlane({
  hostSelector,
  coarsePointer,
}: {
  hostSelector: string;
  coarsePointer: boolean;
}) {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const pointerCurrent = useRef(new THREE.Vector2(0.5, 0.5));
  const pointerTarget = useRef(new THREE.Vector2(0.5, 0.5));
  const pointerForce = useRef(0);
  const hostRef = useRef<HTMLElement | null>(null);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uResolution: { value: new THREE.Vector2(1, 1) },
      uPointer: { value: new THREE.Vector2(0.5, 0.5) },
      uPointerForce: { value: 0 },
      uDistortion: { value: 1.0 },
      uOpacity: { value: 0.8 },
      uScrollVel: { value: 0 },
    }),
    [],
  );

  useEffect(() => {
    hostRef.current = document.querySelector<HTMLElement>(hostSelector);
  }, [hostSelector]);

  useFrame((state) => {
    const material = materialRef.current;
    if (!material) return;

    pointerCurrent.current.lerp(pointerTarget.current, 0.18);
    pointerForce.current *= 0.84;

    let distortion = 1.0;
    let opacity = 0.82;
    const host = hostRef.current;
    if (host) {
      const computed = getComputedStyle(host);
      const d = Number.parseFloat(computed.getPropertyValue("--wave-distortion"));
      const o = Number.parseFloat(computed.getPropertyValue("--wave-opacity"));
      if (Number.isFinite(d)) distortion = d;
      if (Number.isFinite(o)) opacity = o;
    }

    const rootComputed = getComputedStyle(document.documentElement);
    const sv = Number.parseFloat(rootComputed.getPropertyValue("--wave-scroll-vel"));
    material.uniforms.uScrollVel.value = Number.isFinite(sv) ? sv : 0;

    material.uniforms.uTime.value = state.clock.elapsedTime;
    material.uniforms.uResolution.value.set(state.size.width, state.size.height);
    material.uniforms.uPointer.value.copy(pointerCurrent.current);
    material.uniforms.uPointerForce.value = pointerForce.current;
    material.uniforms.uDistortion.value = distortion;
    material.uniforms.uOpacity.value = opacity;
  });

  return (
    <mesh
      onPointerMove={(event) => {
        if (!event.uv) return;
        pointerTarget.current.set(event.uv.x, event.uv.y);
        const bump = coarsePointer ? 0.22 : 0.54;
        pointerForce.current = Math.min(1.6, pointerForce.current + bump);
      }}
      onPointerLeave={() => {
        pointerTarget.current.set(0.5, 0.5);
      }}
    >
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={materialRef}
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent
        depthTest={false}
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
  const [coarsePointer, setCoarsePointer] = useState(false);

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

  useEffect(() => {
    const mq = window.matchMedia("(pointer: coarse)");
    const sync = () => setCoarsePointer(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const shellClass =
    variant === "global"
      ? "pointer-events-none fixed inset-0 z-0"
      : "absolute inset-0 z-0";

  return (
    <div className={shellClass} aria-hidden>
      <Canvas
        frameloop={runLoop ? "always" : "never"}
        gl={{ alpha: true, antialias: false, depth: false, stencil: false }}
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 1], fov: 50 }}
        style={{ width: "100%", height: "100%" }}
      >
        <WavePlane
          coarsePointer={coarsePointer && variant !== "global"}
          hostSelector={hostSelector}
        />
        <EffectComposer>
          <Bloom
            intensity={HERO_WAVE_BLOOM_INTENSITY}
            luminanceThreshold={HERO_WAVE_BLOOM_LUMINANCE_THRESHOLD}
            luminanceSmoothing={HERO_WAVE_BLOOM_LUMINANCE_SMOOTHING}
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
  /** `global`: root layout singleton, fixed under content, no pointer sculpting. */
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
