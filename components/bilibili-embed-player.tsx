"use client";

import {
  buildBilibiliPlayerSrc,
  fetchBilibiliVideoMeta,
  normalizeBvid,
} from "@/lib/bilibili-player";
import { pauseBilibiliEmbed } from "@/lib/bilibili-embed";
import { useEffect, useMemo, useRef, useState } from "react";

export type BilibiliEmbedPlayerProps = {
  bvid: string;
  title: string;
  /** 已知 aid/cid 时直接注入，跳过 meta 请求 */
  aid?: number;
  cid?: number;
  /**
   * `eager`：选中即挂载 iframe（展台主播放器）。
   * `lazy`：进入视口后再挂载（页内次要位置）。
   */
  mode?: "eager" | "lazy";
  className?: string;
  /** 默认 16:9；左栏预览可用 `aspect-[4/3]` */
  aspectClassName?: string;
  /** 传给内层画幅容器，用于大屏 min-height 等 */
  frameClassName?: string;
};

function resolvePlayerSrc(
  normalized: string | null,
  aid?: number,
  cid?: number,
): string | null {
  if (!normalized) return null;
  if (typeof aid === "number" && aid > 0 && typeof cid === "number" && cid > 0) {
    return buildBilibiliPlayerSrc(normalized, {
      aid,
      cid,
      autoplay: false,
      danmaku: false,
      highQuality: true,
    });
  }
  return null;
}

/**
 * B 站官方 Web 播放器（iframe）。全站唯一内嵌实现，勿再复制 iframe 字符串。
 */
export function BilibiliEmbedPlayer({
  bvid,
  title,
  aid: aidProp,
  cid: cidProp,
  mode = "eager",
  className = "",
  aspectClassName = "aspect-video",
  frameClassName = "",
}: BilibiliEmbedPlayerProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const normalized = normalizeBvid(bvid);
  const canPlay = Boolean(normalized);
  const knownSrc = useMemo(
    () => resolvePlayerSrc(normalized, aidProp, cidProp),
    [normalized, aidProp, cidProp],
  );

  const [inView, setInView] = useState(mode === "eager");
  const [fetchedSrc, setFetchedSrc] = useState<string | null>(null);
  const [loadedSrc, setLoadedSrc] = useState<string | null>(null);

  const playerSrc = knownSrc ?? fetchedSrc;
  const mountIframe = Boolean(playerSrc && (mode === "eager" || inView));
  const frameReady = mountIframe && loadedSrc === playerSrc;

  useEffect(() => {
    if (mode === "eager") return;
    if (!canPlay) return;
    const el = rootRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      (entries) => {
        const hit = entries.some((e) => e.isIntersecting);
        setInView((prev) => {
          if (prev && !hit) pauseBilibiliEmbed(iframeRef.current);
          return hit;
        });
      },
      { root: null, rootMargin: "80px 0px", threshold: 0.12 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [mode, canPlay]);

  useEffect(() => {
    if (!inView || !canPlay) return;
    const onVis = () => {
      if (document.hidden) pauseBilibiliEmbed(iframeRef.current);
    };
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, [inView, canPlay]);

  useEffect(() => {
    if (!inView || !normalized || knownSrc) return;

    let cancelled = false;

    void fetchBilibiliVideoMeta(normalized)
      .then((meta) => {
        if (cancelled) return;
        setFetchedSrc(
          buildBilibiliPlayerSrc(normalized, {
            aid: meta.aid,
            cid: meta.cid,
            autoplay: false,
            danmaku: false,
            highQuality: true,
          }),
        );
      })
      .catch(() => {
        if (cancelled) return;
        setFetchedSrc(buildBilibiliPlayerSrc(normalized));
      });

    return () => {
      cancelled = true;
    };
  }, [inView, normalized, knownSrc]);

  return (
    <div ref={rootRef} className={className}>
      <div
        className={`relative w-full overflow-hidden rounded-md border border-[var(--hairline)] bg-[#0a0a12] ${aspectClassName} ${frameClassName}`}
      >
        {mountIframe && playerSrc ? (
          <>
            <iframe
              ref={iframeRef}
              title={title}
              src={playerSrc}
              className={`absolute inset-0 h-full w-full border-0 transition-opacity duration-300 ${
                frameReady ? "opacity-100" : "opacity-0"
              }`}
              allowFullScreen
              scrolling="no"
              frameBorder={0}
              allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
              onLoad={() => setLoadedSrc(playerSrc)}
            />
            {!frameReady ? (
              <div
                className="pointer-events-none absolute inset-0 flex items-center justify-center bg-[#0a0a12]"
                aria-hidden
              >
                <p className="font-[family-name:var(--font-zh)] text-[14px] text-[var(--muted-strong)]">
                  播放器加载中…
                </p>
              </div>
            ) : null}
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-6 text-center">
            <p className="font-[family-name:var(--font-zh)] text-[15px] leading-relaxed text-[var(--muted-strong)]">
              {!canPlay
                ? "视频 ID 无效"
                : mode === "lazy" && !inView
                  ? "滚入后加载"
                  : "加载中…"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
