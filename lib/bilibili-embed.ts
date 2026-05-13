/** B 站 `player.bilibili.com` 内嵌页通信（非官方保证；失败静默）。 */

export const BILIBILI_PLAYER_ORIGIN = "https://player.bilibili.com";

/**
 * 尝试暂停内嵌播放器。部分版本识别 `setPlayer-` 前缀字符串（与直播/活动播放器文档同源写法）。
 * 若无效，外层仍应通过 **卸载 iframe** 兜底（见 `FounderLazyBilibili`）。
 */
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
