/**
 * 全站滚动 / 入场动效语言（单一事实源）。
 *
 * **层次**（越往上越抢戏，scrub 越大越「跟手慢半拍」显重量）：
 * - **L0**：整页深度 `--depth-t`、浪面收束（长距、ease none、scrub 中等）
 * - **L1**：Manifesto 字标 + 极轻淡入；Hero 段落 scrub
 * - **L2**：Connect 揭幕、Founders intro、GitHub 卡、Call 揭示（toggle + expo，短促利落）
 * - **L3**：Founder 全屏 pin 缩放（scrub 略紧，避免「粘滞打架」）
 */

export const SG_CLIP = {
  revealFrom: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
  revealTo: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
} as const;

export const SG_SCRUB = {
  /** L0：整页深度 */
  globalDepth: 0.5,
  /** L1：Manifesto 字标 */
  manifestoWordmark: 0.58,
  /** L1：Manifesto 正文 wrapper 极轻 opacity */
  manifestoFade: 0.72,
  /** L1：Hero 段落 y */
  heroParagraph: 0.68,
  /** L1：浪面 CSS 变量收束 */
  heroWaveCalm: 0.68,
  /** L2：Connect 舞台（最重 scrub，大幕感） */
  socialExpand: 1.08,
  /** L3：Founder pin 卡 */
  founderPin: 0.42,
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
  /** 侧栏 / 单条 intro */
  durationTight: 0.92,
  /** 卡片、单列 */
  duration: 1.02,
  /** Call 多行叠层 */
  durationStack: 1.12,
  yFrom: 34,
  /** 内嵌卡（GitHub）略轻，避免抢主叙事 */
  yFromCard: 30,
  yFromLift: 38,
  staggerCards: 0.085,
  staggerCallRows: 0.11,
  /** intro 与主列 overlap，形成一条动线 */
  overlapIntroToMain: 0.08,
} as const;

export const SG_SOCIAL = {
  stageClipInset: "10%",
  introYFrom: 18,
  cardYFrom: 20,
  introOpacityFrom: 0.9,
  timelineCardStaggerEach: 0.075,
} as const;

export const SG_FOUNDER_PIN = {
  scaleTo: 0.94,
  yTo: -32,
} as const;
