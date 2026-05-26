/**
 * B 站官方 Web 播放器 iframe（`player.bilibili.com`）— 与 B 站开放平台文档一致。
 * @see https://open.bilibili.com/document/embed
 */

const BV_PATTERN = /^BV[\w]+$/i;

export function normalizeBvid(raw: string): string | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;
  const upper = trimmed.toUpperCase();
  return BV_PATTERN.test(upper) ? upper : null;
}

export type BilibiliPlayerOptions = {
  page?: number;
  autoplay?: boolean;
  danmaku?: boolean;
  highQuality?: boolean;
  /** 默认 true：iframe 加载即静音，避免用户点击后突然出声。手动取消静音由用户在 player 内操作。 */
  muted?: boolean;
};

/** 生成官方内嵌播放器 URL（仅 `bvid` 即可，无需 aid/cid） */
export function buildBilibiliPlayerSrc(
  bvid: string,
  options: BilibiliPlayerOptions = {},
): string | null {
  const id = normalizeBvid(bvid);
  if (!id) return null;

  const {
    page = 1,
    autoplay = false,
    danmaku = false,
    highQuality = true,
    muted = true,
  } = options;

  const params = new URLSearchParams({
    bvid: id,
    page: String(page),
    high_quality: highQuality ? "1" : "0",
    danmaku: danmaku ? "1" : "0",
    autoplay: autoplay ? "1" : "0",
    as_wide: "1",
    muted: muted ? "1" : "0",
  });

  return `https://player.bilibili.com/player.html?${params.toString()}`;
}

export function bilibiliWatchUrl(bvid: string): string {
  const id = normalizeBvid(bvid);
  return id ? `https://www.bilibili.com/video/${id}` : "#";
}

export type BilibiliVideoMeta = {
  title?: string;
  pic?: string;
};

const metaCache = new Map<string, BilibiliVideoMeta>();
const EMPTY_META: BilibiliVideoMeta = {};

function cacheMeta(id: string, meta: BilibiliVideoMeta): BilibiliVideoMeta {
  metaCache.set(id, meta);
  return meta;
}

/** 公开 `view` 接口：用于封面与标题（浏览器直连，失败则静默） */
export async function fetchBilibiliVideoMeta(
  bvid: string,
): Promise<BilibiliVideoMeta> {
  const id = normalizeBvid(bvid);
  if (!id) return EMPTY_META;

  const cached = metaCache.get(id);
  if (cached !== undefined) return cached;

  try {
    const res = await fetch(
      `https://api.bilibili.com/x/web-interface/view?bvid=${encodeURIComponent(id)}`,
      { credentials: "omit", cache: "force-cache" },
    );
    if (!res.ok) return cacheMeta(id, EMPTY_META);
    const json = (await res.json()) as {
      code?: number;
      data?: { title?: string; pic?: string };
    };
    if (json.code !== 0 || !json.data) return cacheMeta(id, EMPTY_META);
    return cacheMeta(id, {
      title: json.data.title,
      pic: json.data.pic?.replace(/^http:/, "https:"),
    });
  } catch {
    return cacheMeta(id, EMPTY_META);
  }
}
