"use client";

import { useFBO } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import {
  useLayoutEffect,
  useMemo,
  useRef,
  type MutableRefObject,
} from "react";
import * as THREE from "three";

import {
  displayFragmentShader,
  displayVertexShader,
  simFragmentShader,
  simVertexShader,
} from "./life-field-shaders";
import type { ShaderRenderProfile } from "./shader-field-root";

const STEP_COST = 1.0;

const FBO_SETTINGS = {
  minFilter: THREE.NearestFilter,
  magFilter: THREE.NearestFilter,
  depthBuffer: false,
  stencilBuffer: false,
  type: THREE.UnsignedByteType,
  format: THREE.RGBAFormat,
};

export function LifeFieldScene({
  scrollRef,
  profile,
}: {
  scrollRef: MutableRefObject<{ scroll: number; velocity: number }>;
  profile: ShaderRenderProfile;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const accRef = useRef(STEP_COST);
  const simGenRef = useRef(0);

  const readRef = useRef<THREE.WebGLRenderTarget | null>(null);
  const writeRef = useRef<THREE.WebGLRenderTarget | null>(null);

  const grid = profile === "high" ? 64 : 48;
  const maxStepsPerFrame = profile === "high" ? 4 : 2;
  const velocityDeadzone = profile === "high" ? 0.02 : 0.04;
  const velocityBoostFactor = profile === "high" ? 1.2 : 0.65;

  const fboA = useFBO(grid, grid, FBO_SETTINGS);
  const fboB = useFBO(grid, grid, FBO_SETTINGS);

  const displayUniforms = useMemo(
    () => ({
      uState: { value: null as THREE.Texture | null },
      uDim: { value: new THREE.Vector2(grid, grid) },
    }),
    [grid],
  );

  // eslint-disable-next-line react-hooks/immutability -- Three.js uniforms are mutable by design in render loops.
  useLayoutEffect(() => {
    readRef.current = fboA;
    writeRef.current = fboB;
    // eslint-disable-next-line react-hooks/immutability -- R3F shader uniform value updates are intentional imperative writes.
    displayUniforms.uState.value = fboA.texture;
    for (const t of [fboA.texture, fboB.texture]) {
      t.wrapS = THREE.RepeatWrapping;
      t.wrapT = THREE.RepeatWrapping;
      t.magFilter = THREE.NearestFilter;
      t.minFilter = THREE.NearestFilter;
      t.needsUpdate = true;
    }
  }, [fboA, fboB, displayUniforms]);

  const { simScene, simCamera, simMaterial } = useMemo(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const material = new THREE.ShaderMaterial({
      uniforms: {
        uState: { value: null },
        uDim: { value: new THREE.Vector2(grid, grid) },
        uSimGen: { value: 0 },
        uVelocity: { value: 0 },
        uScroll: { value: 0 },
        uTime: { value: 0 },
      },
      vertexShader: simVertexShader,
      fragmentShader: simFragmentShader,
      depthTest: false,
      depthWrite: false,
    });
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
    scene.add(mesh);
    return { simScene: scene, simCamera: camera, simMaterial: material };
  }, [grid]);

  const viewport = useThree((s) => s.viewport);

  // eslint-disable-next-line react-hooks/immutability -- WebGL simulation requires imperative uniform updates each frame.
  useFrame((state) => {
    if (!readRef.current || !writeRef.current) return;

    const gl = state.gl;
    const live = scrollRef.current;

    const vel = live.velocity;
    const base = 0;
    const activeVel = Math.max(0, Math.abs(vel) - velocityDeadzone);
    const boost = Math.min(1.8, Math.pow(activeVel, 1.04) * velocityBoostFactor);
    accRef.current += state.clock.getDelta() * (base + boost);

    let steps = 0;
    while (accRef.current >= STEP_COST && steps < maxStepsPerFrame) {
      const read: THREE.WebGLRenderTarget<THREE.Texture> | null = readRef.current;
      const write: THREE.WebGLRenderTarget<THREE.Texture> | null = writeRef.current;
      if (!read || !write) break;

      accRef.current -= STEP_COST;
      steps++;

      // eslint-disable-next-line react-hooks/immutability -- Mutable uniforms are required for ping-pong simulation.
      simMaterial.uniforms.uState.value = read.texture;
      simMaterial.uniforms.uSimGen.value = simGenRef.current;
      simMaterial.uniforms.uVelocity.value = vel;
      simMaterial.uniforms.uScroll.value = live.scroll;
      simMaterial.uniforms.uTime.value = state.clock.elapsedTime;

      gl.setRenderTarget(write);
      gl.setClearColor(0x000000, 1);
      gl.clear(true, true);
      gl.render(simScene, simCamera);

      readRef.current = write;
      writeRef.current = read;
      simGenRef.current += 1;
    }

    gl.setRenderTarget(null);

    const disp = meshRef.current?.material;
    if (disp instanceof THREE.ShaderMaterial) {
      disp.uniforms.uState.value = readRef.current?.texture ?? null;
    }
  }, -1);

  return (
    <mesh ref={meshRef} scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        uniforms={displayUniforms}
        vertexShader={displayVertexShader}
        fragmentShader={displayFragmentShader}
        depthTest={false}
        depthWrite={false}
        transparent
      />
    </mesh>
  );
}
