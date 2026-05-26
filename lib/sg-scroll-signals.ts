/**
 * Lenis / ScrollTrigger / GSAP 写入的滚动旁路信号（避免每帧 getComputedStyle）。
 */

let depthT = 0;
let waveScrollVel = 0;

export type HeroWaveSignals = {
  distortion: number;
  opacity: number;
  camX: number;
  camY: number;
  camZ: number;
  lookX: number;
  lookY: number;
  lookZ: number;
};

const HERO_WAVE_DEFAULT: HeroWaveSignals = {
  distortion: 1,
  opacity: 0.86,
  camX: 0,
  camY: 3.12,
  camZ: 7.6,
  lookX: 0,
  lookY: 0.12,
  lookZ: 0,
};

let heroWave: HeroWaveSignals = { ...HERO_WAVE_DEFAULT };

export function setScrollDepthT(value: number): void {
  depthT = Number.isFinite(value) ? Math.min(1, Math.max(0, value)) : 0;
}

export function getScrollDepthT(): number {
  return depthT;
}

export function setWaveScrollVel(value: number): void {
  waveScrollVel = Number.isFinite(value) ? Math.min(1, Math.max(0, value)) : 0;
}

export function getWaveScrollVel(): number {
  return waveScrollVel;
}

export function getHeroWaveSignals(): Readonly<HeroWaveSignals> {
  return heroWave;
}

export function setHeroWaveSignals(partial: Partial<HeroWaveSignals>): void {
  heroWave = { ...heroWave, ...partial };
}

export function resetHeroWaveSignals(): void {
  heroWave = { ...HERO_WAVE_DEFAULT };
}

/** ScrollTrigger scrub 后同步一次（勿在 R3F useFrame 里调用） */
export function syncHeroWaveFromElement(el: HTMLElement): void {
  const cs = getComputedStyle(el);
  const n = (key: string, fallback: number) => {
    const v = Number.parseFloat(cs.getPropertyValue(key));
    return Number.isFinite(v) ? v : fallback;
  };
  setHeroWaveSignals({
    distortion: n("--wave-distortion", HERO_WAVE_DEFAULT.distortion),
    opacity: n("--wave-opacity", HERO_WAVE_DEFAULT.opacity),
    camX: n("--hero-cam-x", HERO_WAVE_DEFAULT.camX),
    camY: n("--hero-cam-y", HERO_WAVE_DEFAULT.camY),
    camZ: n("--hero-cam-z", HERO_WAVE_DEFAULT.camZ),
    lookX: n("--hero-look-x", HERO_WAVE_DEFAULT.lookX),
    lookY: n("--hero-look-y", HERO_WAVE_DEFAULT.lookY),
    lookZ: n("--hero-look-z", HERO_WAVE_DEFAULT.lookZ),
  });
}
