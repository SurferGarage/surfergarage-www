"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

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
  // Low frequency field: only 3-4 massive wave bands on screen.
  float n = fbm(uv * vec2(1.65, 0.92) + vec2(t * 0.22, -t * 0.16));

  vec2 pointer = vec2(uPointer.x, 1.0 - uPointer.y);
  float dist = distance(uv, pointer);
  // Small radius, violent repulsion.
  float pointerBlast = exp(-dist * 34.0) * uPointerForce;

  float distortion = max(0.02, uDistortion);
  float flow = p.y;
  flow += n * 0.72 * distortion;
  flow += pointerBlast * 2.35 * distortion;
  flow += sin(p.x * 2.7 - t * 1.9) * 0.11 * distortion;

  // Thick luminous ribbons (not thin lines).
  float ribbonA = smoothstep(0.22, 0.0, abs(sin(flow * 9.0 + p.x * 1.45) - 0.04));
  float ribbonB = smoothstep(0.26, 0.0, abs(sin(flow * 7.1 - p.x * 1.1 + t * 0.72) + 0.08));
  float ribbons = max(ribbonA * 0.95, ribbonB * 0.78);
  ribbons = pow(ribbons, 0.72);

  vec3 blue = vec3(0.0, 0.0, 0.886);
  vec3 cyan = vec3(0.153, 0.843, 0.78);
  // Favor cyan for stronger emission-like readability.
  float mixV = clamp(0.58 + n * 0.22 + sin(p.x * 1.4 + t) * 0.1, 0.28, 0.95);
  vec3 waveColor = mix(blue, cyan, mixV);
  vec3 color = waveColor * ribbons * 3.4;

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

function HeroWaveCanvasActive({ hostSelector }: { hostSelector: string }) {
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

  return (
    <div className="absolute inset-0 z-0" aria-hidden>
      <Canvas
        frameloop={runLoop ? "always" : "never"}
        gl={{ alpha: true, antialias: false, depth: false, stencil: false }}
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 1], fov: 50 }}
        style={{ width: "100%", height: "100%" }}
      >
        <WavePlane coarsePointer={coarsePointer} hostSelector={hostSelector} />
        <EffectComposer>
          <Bloom
            intensity={1.5}
            luminanceThreshold={0.2}
            luminanceSmoothing={0.16}
            mipmapBlur
          />
        </EffectComposer>
      </Canvas>
    </div>
  );
}

export function HeroWaveCanvas({ hostSelector }: { hostSelector: string }) {
  const [reduced, setReduced] = useState<boolean | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  if (reduced !== false) return null;

  return <HeroWaveCanvasActive hostSelector={hostSelector} />;
}
