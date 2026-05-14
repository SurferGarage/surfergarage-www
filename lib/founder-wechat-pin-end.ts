/**
 * Surfing Founders 微信专栏叠卡首屏 ScrollTrigger `end` 字符串。
 * 须与 `register-desktop-pins` 中 `wechat_oa` 面板保持一致，否则横滑与 pin 会错位。
 *
 * 含两侧 **进度 dwell**（见 `WECHAT_SCRUB_EDGE_DWELL` + `wechat-official-feed` 内映射）：略加长 pin，
 * 使中段横滑速度与原先 `+=195%` 线性全行程时接近。
 */
export const WECHAT_SCRUB_EDGE_DWELL = 0.09 as const;

const PIN_BASE = 195;
const MIDDLE = 1 - 2 * WECHAT_SCRUB_EDGE_DWELL;
export const FOUNDER_WECHAT_PIN_END =
  `+=${Math.round(PIN_BASE / MIDDLE)}%` as const;
