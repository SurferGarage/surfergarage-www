/** 全屏四边形：模拟与显示共用（clip space） */
export const simVertexShader = /* glsl */ `
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`;

/**
 * Ping-pong 推演：输入 uState（NEAREST + Repeat），输出 R 通道 0/1。
 * gl_FragCoord 对齐 FBO 像素；环面邻域借助 Repeat 采样。
 */
export const simFragmentShader = /* glsl */ `
precision highp float;

uniform sampler2D uState;
uniform vec2 uDim;
uniform float uSimGen;
uniform float uVelocity;
uniform float uScroll;
uniform float uTime;

varying vec2 vUv;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

void main() {
  vec2 dim = uDim;
  vec2 coord = floor(gl_FragCoord.xy);
  coord.x = clamp(coord.x, 0.0, dim.x - 1.0);
  coord.y = clamp(coord.y, 0.0, dim.y - 1.0);
  vec2 texel = 1.0 / dim;
  vec2 uv = (coord + 0.5) * texel;

  if (uSimGen < 0.5) {
    // Deterministic seed: same initial state across refreshes.
    float h = hash(coord * 0.071 + vec2(13.1, 7.9));
    float sparse = step(0.52, h) * step(h, 0.68);
    gl_FragColor = vec4(sparse, 0.0, 0.0, 1.0);
    return;
  }

  float alive = step(0.5, texture2D(uState, uv).r);
  int count = 0;
  for (int dy = -1; dy <= 1; dy++) {
    for (int dx = -1; dx <= 1; dx++) {
      if (dx == 0 && dy == 0) continue;
      vec2 suv = uv + vec2(float(dx), float(dy)) * texel;
      count += int(step(0.5, texture2D(uState, suv).r));
    }
  }

  float next = 0.0;
  if (alive > 0.5) {
    if (count == 2 || count == 3) next = 1.0;
  } else {
    if (count == 3) next = 1.0;
  }

  float fury = smoothstep(0.38, 1.9, abs(uVelocity));
  vec2 stirSeed = coord * 0.11 + uSimGen * 0.37 + vec2(uScroll * 0.0011, uTime * 1.4);
  float hA = hash(stirSeed);
  float hB = hash(stirSeed * 1.7 + vec2(41.2, 19.9));

  if (fury > 0.06) {
    float birthProb = 0.012 + fury * 0.052;
    float killProb = 0.994 - fury * 0.022;
    if (hA < birthProb) {
      next = 1.0;
    } else if (hB > killProb) {
      next = 0.0;
    }
  }

  gl_FragColor = vec4(next, 0.0, 0.0, 1.0);
}
`;

export const displayVertexShader = /* glsl */ `
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

/** 粗野像素块 + 3×3 极轻邻域累加（廉价拖尾 / 微辉光） */
export const displayFragmentShader = /* glsl */ `
precision highp float;

uniform sampler2D uState;
uniform vec2 uDim;

varying vec2 vUv;

void main() {
  vec2 dim = uDim;
  vec2 p = vUv * dim;
  vec2 cell = (floor(p) + 0.5) / dim;
  vec2 texel = 1.0 / dim;

  float acc = 0.0;
  for (int dy = -1; dy <= 1; dy++) {
    for (int dx = -1; dx <= 1; dx++) {
      vec2 suv = cell + vec2(float(dx), float(dy)) * texel;
      float v = step(0.5, texture2D(uState, suv).r);
      float w = (dx == 0 && dy == 0) ? 1.0 : 0.11;
      acc += v * w;
    }
  }
  acc = clamp(acc, 0.0, 1.0);

  vec3 rgb = vec3(1.0);
  float a = acc * 0.088;
  gl_FragColor = vec4(rgb * a, a);
}
`;
