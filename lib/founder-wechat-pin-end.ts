/**
 * Surfing Founders **公众号叠卡首屏**（`data-founder-card`）ScrollTrigger `end` 字符串。
 * 须与 `register-desktop-pins` 中 `wechat_oa` 面板保持一致。
 *
 * 说明：`WeChatOfficialFeed` 已重置为**纯手滑横条**，不再注册 `wechat-feed-scrub-sync`；
 * 本文件中的 **`WECHAT_PIN_SCROLL_INTRO_HOLD`** / **`mapWechatPinProgressToHorizontalScrub`**
 * 仅为历史与潜在复用保留；当前仅 **`FOUNDER_WECHAT_PIN_END`** 被 `register-desktop-pins` 引用。
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
