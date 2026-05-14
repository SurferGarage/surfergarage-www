"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useLayoutEffect, useMemo, useRef, useState, type ReactNode } from "react";
import * as THREE from "three";

const VERT = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const FRAG = /* glsl */ `
precision highp float;
uniform float uTime;
uniform float uDepth;
uniform float uVel;
varying vec2 vUv;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}
float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}
float fbm(vec2 p) {
  float s = 0.0;
  float a = 0.52;
  for (int i = 0; i < 6; i++) {
    s += a * noise(p);
    p *= 2.08;
    a *= 0.5;
  }
  return s;
}

void main() {
  vec2 uv = vUv;
  float t = uTime;
  float dep = clamp(uDepth, 0.0, 1.0);
  float mv = clamp(uVel, 0.0, 1.0);

  vec2 sun = vec2(
    0.5 + sin(t * 0.19) * 0.032,
    0.028 + cos(t * 0.15) * 0.018
  );
  vec2 d = uv - sun;
  float toSun = length(d);

  float hole = smoothstep(0.38, 0.0, toSun) * smoothstep(0.0, 0.26, 0.26 - uv.y);
  hole *= (1.0 - dep * 0.88);

  vec2 cuv = uv * vec2(5.2, 6.4) + vec2(t * 0.12, t * 0.095) + mv * vec2(0.1, -0.06);
  float caustRaw = fbm(cuv) * 0.55 + fbm(cuv * 1.75 + vec2(7.2, 3.1)) * 0.45;
  float caust =
    pow(caustRaw, 1.22) * smoothstep(0.72, 0.0, uv.y) * (0.88 + 0.12 * sin(t * 0.7 + caustRaw * 6.283));
  caust *= (1.0 - dep * 0.58);

  float cone =
    exp(-abs(d.x) / (d.y * 0.52 + 0.004)) * smoothstep(1.02, 0.03, uv.y);
  cone *= (0.5 + mv * 0.5) * (1.0 - dep * 0.72);
  cone *= 0.52 + 0.48 * noise(vec2(d.y * 19.0, d.x * 6.5 - t * 1.85));

  vec3 cyan = vec3(0.42, 0.88, 0.96);
  vec3 gold = vec3(1.0, 0.86, 0.48);
  vec3 white = vec3(0.96, 0.99, 1.0);

  float beam = hole * 1.15 + cone * 0.92 + caust * 0.7;
  beam *= 1.0 - dep * 0.22;

  float warm = clamp((hole * 0.95 + cone * 0.55) * (1.0 - dep * 0.85), 0.0, 1.0);
  vec3 lit = mix(mix(cyan, white, hole * 0.75), gold, warm);
  lit *= beam;

  vec3 deepFog = vec3(0.04, 0.1, 0.2) * (0.35 + dep * 0.45) * smoothstep(0.15, 0.95, uv.y);
  vec3 scatterTint = vec3(0.08, 0.22, 0.28) * caust * (1.0 - uv.y) * 0.55;
  vec3 outc = lit + deepFog + scatterTint;
  float lum = dot(outc, vec3(0.299, 0.587, 0.114));
  float a = clamp(lum * 1.25 + length(deepFog) * 2.2, 0.0, 0.86);
  gl_FragColor = vec4(outc, a);
}
`;

function FixedOrthoCamera() {
  const set = useThree((s) => s.set);
  useLayoutEffect(() => {
    const cam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
    cam.position.z = 1;
    set({ camera: cam });
  }, [set]);
  return null;
}

function WaterVolumeQuad() {
  const matRef = useRef<THREE.ShaderMaterial>(null);

  const shader = useMemo(() => {
    return {
      uniforms: {
        uTime: { value: 0 },
        uDepth: { value: 0 },
        uVel: { value: 0 },
      },
      vertexShader: VERT,
      fragmentShader: FRAG,
    };
  }, []);

  useFrame((state) => {
    const mat = matRef.current;
    if (!mat) return;
    mat.uniforms.uTime.value = state.clock.elapsedTime;
    const root = document.documentElement;
    const cs = getComputedStyle(root);
    const d = Number.parseFloat(cs.getPropertyValue("--depth-t"));
    const v = Number.parseFloat(cs.getPropertyValue("--wave-scroll-vel"));
    mat.uniforms.uDepth.value = Number.isFinite(d) ? d : 0;
    mat.uniforms.uVel.value = Number.isFinite(v) ? v : 0;
  });

  return (
    <mesh position={[0, 0, 0]} renderOrder={-2}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={matRef}
        attach="material"
        transparent
        depthTest={false}
        depthWrite={false}
        toneMapped={false}
        {...shader}
      />
    </mesh>
  );
}

/**
 * 全屏水下体积感：焦散 + 丁达尔锥（GLSL），读 `--depth-t` / `--wave-scroll-vel`。
 * 叠在实色渐变之上，与 `UnderwaterLightStage` 的 CSS 光球互补。
 */
export function WaterVolumeFx(): ReactNode {
  const [reduced, setReduced] = useState<boolean | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  if (reduced !== false) return null;

  return (
    <div className="water-volume-fx pointer-events-none absolute inset-0 z-0 mix-blend-screen opacity-[0.94]">
      <Canvas
        className="h-full w-full"
        frameloop="always"
        dpr={[1, 1.5]}
        gl={{
          alpha: true,
          antialias: false,
          powerPreference: "high-performance",
          stencil: false,
        }}
      >
        <FixedOrthoCamera />
        <WaterVolumeQuad />
      </Canvas>
    </div>
  );
}
