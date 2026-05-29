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
  /** 多 P 集数，从 1 起；有 `cid` 时 player 忽略此参数 */
  page?: number;
  aid?: number;
  cid?: number;
  autoplay?: boolean;
  danmaku?: boolean;
  highQuality?: boolean;
  /** 默认 true：iframe 加载即静音，避免用户点击后突然出声。手动取消静音由用户在 player 内操作。 */
  muted?: boolean;
};

/** 生成官方站外播放器 URL（`aid`+`cid`+`bvid` 组合最稳） */
export function buildBilibiliPlayerSrc(
  bvid: string,
  options: BilibiliPlayerOptions = {},
): string | null {
  const id = normalizeBvid(bvid);
  if (!id) return null;

  const {
    page = 1,
    aid,
    cid,
    autoplay = false,
    danmaku = false,
    highQuality = true,
    muted = true,
  } = options;

  const params = new URLSearchParams({
    isOutside: "1",
    bvid: id,
    p: String(page),
    high_quality: highQuality ? "1" : "0",
    danmaku: danmaku ? "1" : "0",
    autoplay: autoplay ? "1" : "0",
    muted: muted ? "1" : "0",
  });

  if (typeof aid === "number" && aid > 0) {
    params.set("aid", String(aid));
  }
  if (typeof cid === "number" && cid > 0) {
    params.set("cid", String(cid));
  }

  return `https://player.bilibili.com/player.html?${params.toString()}`;
}

const prefetchedPlayerDocs = new Set<string>();

/** 浏览器空闲时预取播放器文档（同一 URL 只 prefetch 一次） */
export function prefetchBilibiliPlayerDocument(src: string | null): void {
  if (!src || typeof document === "undefined") return;
  if (prefetchedPlayerDocs.has(src)) return;
  prefetchedPlayerDocs.add(src);

  const run = () => {
    const link = document.createElement("link");
    link.rel = "prefetch";
    link.as = "document";
    link.href = src;
    document.head.appendChild(link);
  };

  if ("requestIdleCallback" in window) {
    window.requestIdleCallback(run, { timeout: 2000 });
  } else {
    setTimeout(run, 0);
  }
}

export function bilibiliWatchUrl(bvid: string): string {
  const id = normalizeBvid(bvid);
  return id ? `https://www.bilibili.com/video/${id}` : "#";
}

export type BilibiliVideoMeta = {
  aid?: number;
  cid?: number;
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
    const endpoint =
      typeof window === "undefined"
        ? `https://api.bilibili.com/x/web-interface/view?bvid=${encodeURIComponent(id)}`
        : `/api/bilibili/view?bvid=${encodeURIComponent(id)}`;

    const res = await fetch(endpoint, {
      credentials: "omit",
      cache: "force-cache",
    });
    if (!res.ok) return cacheMeta(id, EMPTY_META);

    const payload = (await res.json()) as {
      aid?: number;
      cid?: number;
      title?: string;
      pic?: string;
      code?: number;
      data?: {
        aid?: number;
        cid?: number;
        title?: string;
        pic?: string;
        pages?: { cid?: number }[];
      };
    };

    if (typeof payload.code === "number") {
      if (payload.code !== 0 || !payload.data) return cacheMeta(id, EMPTY_META);
      const cid = payload.data.cid ?? payload.data.pages?.[0]?.cid;
      return cacheMeta(id, {
        aid: payload.data.aid,
        cid,
        title: payload.data.title,
        pic: payload.data.pic?.replace(/^http:/, "https:"),
      });
    }

    return cacheMeta(id, {
      aid: payload.aid,
      cid: payload.cid,
      title: payload.title,
      pic: payload.pic,
    });
  } catch {
    return cacheMeta(id, EMPTY_META);
  }
}
