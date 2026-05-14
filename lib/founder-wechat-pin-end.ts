/**
 * Surfing Founders 微信专栏叠卡首屏 ScrollTrigger `end` 字符串。
 * 须与 `register-desktop-pins` 中 `wechat_oa` 面板保持一致，否则横滑与 pin 会错位。
 *
 * **导语与横滑解耦**：首屏上半为长文案时，线性映射会让大量纵向滚轮耗在导语上、横滑被压缩。
 * 前 `WECHAT_PIN_SCROLL_INTRO_HOLD` 的 pin 进度不推进横滑；剩余进度再套 dwell 映射到 `scrollLeft`。
 */
export const WECHAT_PIN_SCROLL_INTRO_HOLD = 0.38 as const;

export const WECHAT_SCRUB_EDGE_DWELL = 0.055 as const;

const PIN_BASE = 320;
const MIDDLE = 1 - 2 * WECHAT_SCRUB_EDGE_DWELL;

export const FOUNDER_WECHAT_PIN_END =
  `+=${Math.round(PIN_BASE / MIDDLE)}%` as const;

/** 原始 pin 进度 [0,1] → 横滑 scrub 进度 [0,1]（先导语、再 dwell 横滑） */
export function mapWechatPinProgressToHorizontalScrub(raw: number): number {
  const hold = WECHAT_PIN_SCROLL_INTRO_HOLD;
  if (raw <= hold) return 0;
  const u = (raw - hold) / (1 - hold);
  const d = Math.min(0.45, Math.max(0, WECHAT_SCRUB_EDGE_DWELL));
  if (u <= d) return 0;
  if (u >= 1 - d) return 1;
  return (u - d) / (1 - 2 * d);
}
