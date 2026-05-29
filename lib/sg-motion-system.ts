/**
 * 全站动效语言 — **唯一事实源**（数字 / 选择器 / 触发区 / ST id）。
 *
 * | 层 | 含义 | 注册函数 |
 * |----|------|----------|
 * | L0 | 整页 `--depth-t` / Hero 浪面 / 「出水线」 | `registerGlobalDepthScrub`, `registerHeroChoreography` |
 * | L1 | Manifesto scrub / Hero load / 字符级 stagger | `registerManifestoScroll`, `registerHeroWordmarkStagger`, `registerHeroChoreography` |
 * | L1_5 | cursor-aware magnet hover（桌面） | `registerMagnetHover` |
 * | L2 | 揭幕 / 呼吸 / reveal | `registerFoundersIntro` … `registerCallReveal` |
 * | L3 | 桌面 pin（md+） | `registerDesktopPins` |
 *
 * **编排顺序**：`components/motion/sg-home-registry.ts` → `registerHomeScrollMotion` / `registerHomeDesktopMotion`
 * **原语实现**：`components/motion/sg-motion-primitives.ts`
 * **运行时装载**：`wiki/动效.md`
 */

export const SG_LAYER = {
  L0: "L0",
  L1: "L1",
  L1_5: "L1.5",
  L2: "L2",
  L3: "L3",
} as const;

export type SgMotionLayer = (typeof SG_LAYER)[keyof typeof SG_LAYER];

/** DOM 钩子：新增动效只增键，不散落字符串 */
export const SG_SELECTORS = {
  scrollDepthRoot: "[data-scroll-depth-root]",
  heroReveal: "[data-hero-reveal]",
  heroScrub: "[data-hero-scrub]",
  heroWave: "[data-hero-wave]",
  heroWordmark: "[data-hero-wordmark]",
  heroLetters: "[data-hero-letters]",
  manifestoFade: "[data-manifesto-fade]",
  manifestoPin: "[data-manifesto-pin]",
  manifestoRight: "[data-manifesto-right]",
  foundersIntro: "[data-founders-intro]",
  founderPanel: "[data-founder-panel]",
  founderCard: "[data-founder-card]",
  breathZone: "[data-founder-breath], [data-social-founders-trench]",
  breathGlow: "[data-breath-glow]",
  githubRepoCard: "[data-github-repo-card]",
  socialIntro: "[data-social-intro]",
  socialStage: "[data-social-stage]",
  socialCard: "[data-social-card]",
  callIntro: "[data-call-intro]",
  callItem: "[data-call-item]",
  fitPanel: "[data-fit-panel]",
  fitCard: "[data-fit-card]",
  fitIntro: "[data-fit-intro]",
  fitCol: "[data-fit-col]",
  fitItem: "[data-fit-item]",
  footerWordmark: "[data-footer-wordmark]",
  footerWordmarkLetters: "[data-footer-wordmark-letters]",
  magnet: "[data-magnet]",
} as const;

export const SG_SECTION = {
  manifesto: "#manifesto",
  founders: "#founders",
  social: "#social",
  call: "#call",
  fit: "#fit",
} as const;

/** ScrollTrigger 起止（scrub / reveal 共用） */
export const SG_TRIGGER = {
  depthFull: { start: "top top", end: "bottom bottom" },
  manifestoWordmark: { start: "top top", end: "bottom 44%" },
  manifestoFade: { start: "top top", end: "bottom 38%" },
  heroParagraph: { start: "top 88%", end: "top 48%" },
  heroWaveCalm: { start: "top 95%", end: "top 40%" },
  breath: { start: "top 92%", end: "bottom 8%" },
  socialExpand: { start: "top 80%", end: "top 26%" },
  revealSection: { start: "top 86%" },
  revealCall: { start: "top 84%" },
  revealFit: { start: "top 86%" },
  revealCard: { start: "top 90%" },
  fitPin: { start: "top 72px" },
  footerWordmark: { start: "top 96%", end: "top 52%" },
  manifestoPin: { start: "top 10%", end: "bottom bottom" },
  /** Pin 区起点偏移 sticky header 高度（4.5rem ≈ 72px）；
   * 注意：GSAP ScrollTrigger 的 start 字符串 **不识别 rem 单位**，必须用 px / % / vh。
   * 如果未来改 header 高度，同步更新 px 值（与 site-header.tsx 内 sticky header 实际高度一致）。 */
  founderPin: { start: "top 72px" },
} as const;

export const SG_TOGGLE = {
  reveal: "play none none reverse" as const,
};

/** `ScrollTrigger.id` — 调试时与 `NEXT_PUBLIC_GSAP_DEBUG=1` 对照 */
export const SG_ST_ID = {
  globalDepth: "global-depth-t",
  manifestoWordmark: "manifesto-wordmark",
  manifestoFade: "manifesto-fade-depth",
  heroParagraph: "manifesto-scrub",
  heroWaveCalm: "hero-wave-calm",
  foundersIntro: "founders-intro",
  socialFoundersTrench: "social-founders-trench",
  socialExpand: "social-expand",
  callReveal: "call-reveal",
  fitReveal: "fit-reveal",
  fitClosingPin: "fit-closing-pin",
  footerWordmark: "footer-wordmark",
  manifestoPin: "manifesto-pin",
  founderStack: (i: number) => `founder-stack-${i}`,
  founderBreath: (i: number) => `founder-breath-${i}`,
  githubRepoCard: (i: number) => `github-repo-card-${i}`,
} as const;

export const SG_CLIP = {
  revealFrom: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
  revealTo: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
} as const;

/** scrub 越大越「跟手慢」；pin 最紧避免粘滞 */
export const SG_SCRUB = {
  globalDepth: 0.5,
  manifestoWordmark: 0.58,
  manifestoFade: 0.72,
  heroParagraph: 0.68,
  heroWaveCalm: 0.68,
  socialExpand: 1.08,
  founderBreath: 0.99,
  founderPin: 0.42,
  fitPin: 0.48,
  footerWordmark: 0.62,
} as const;

export const SG_LOAD = {
  ease: "power3.out" as const,
  heroRevealY: 22,
  heroRevealDuration: 0.88,
  heroRevealStagger: 0.05,
  heroRevealDelay: 0.08,
} as const;

export const SG_REVEAL = {
  ease: "expo.out" as const,
  durationTight: 0.92,
  duration: 1.02,
  durationStack: 1.12,
  yFrom: 34,
  yFromCard: 30,
  yFromLift: 38,
  staggerCards: 0.085,
  staggerCallRows: 0.11,
  overlapIntroToMain: 0.08,
} as const;

export const SG_SOCIAL = {
  stageClipInset: "10%",
  introYFrom: 18,
  cardYFrom: 20,
  introOpacityFrom: 0.9,
  timelineCardStaggerEach: 0.075,
  timelineIntroAt: 0,
  timelineStageAt: 0.08,
  timelineCardsAt: 0.14,
} as const;

/** Pin 期间 card 的 scale/y 终值。
 * - yTo 不再设大幅负值，避免顶部章节小标被 sticky header 切割；
 *   叠卡"后撤感"主要靠 scaleTo 提供。 */
export const SG_FOUNDER_PIN = {
  scaleTo: 0.94,
  yTo: -8,
  defaultEnd: "+=115%",
} as const;

/** Fit 收尾 pin：清单 stagger 后 hold，再释放进入 Footer 字标 */
export const SG_FIT = {
  pinEnd: "+=130%",
  phaseIntro: 0.22,
  phaseCols: 0.28,
  phaseItems: 0.42,
  phaseHold: 0.18,
  colStagger: 0.08,
  itemStagger: 0.055,
  holdOpacity: 0.92,
  holdY: -10,
} as const;

/** Footer 巨型字标 scroll reveal */
export const SG_FOOTER_WORDMARK = {
  yFrom: 88,
  letterStagger: 0.038,
} as const;

/** Hero 浪面「出水线」收束目标（`registerHeroChoreography` → `data-hero-wave` CSS 变量）
 * - distortion / opacity 进一步压低 → 浪面接近镜面、Bloom 收尾
 * - 相机降到几乎贴海面 → 镜面感更强
 */
export const SG_HERO_WAVE_CALM = {
  "--wave-distortion": 0.04,
  "--wave-opacity": 0.06,
  "--hero-cam-y": 0.85,
  "--hero-cam-z": 3.4,
  "--hero-look-y": -4.55,
  "--hero-look-z": 0.4,
} as const;

/** 环境 CSS 循环周期（`globals.css`，与 GSAP 解耦） */
export const SG_CSS_AMBIENT = {
  riverDrift: 24,
  riverBreath: 18,
  riverShimmer: 28,
  callOrb: 20,
  founderBreath: 36,
} as const;
