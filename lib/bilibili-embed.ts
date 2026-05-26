/** B 站 `player.bilibili.com` 内嵌页通信（非官方保证；失败静默）。 */

export { buildBilibiliPlayerSrc, normalizeBvid } from "@/lib/bilibili-player";

export const BILIBILI_PLAYER_ORIGIN = "https://player.bilibili.com";

export function pauseBilibiliEmbed(iframe: HTMLIFrameElement | null): void {
  const win = iframe?.contentWindow;
  if (!win) return;
  const msg = `setPlayer-${JSON.stringify({ type: "play", value: false })}`;
  try {
    win.postMessage(msg, BILIBILI_PLAYER_ORIGIN);
  } catch {
    /* 跨域或播放器未实现时忽略 */
  }
}
