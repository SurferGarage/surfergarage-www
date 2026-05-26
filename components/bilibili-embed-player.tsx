"use client";

import {
  buildBilibiliPlayerSrc,
  normalizeBvid,
} from "@/lib/bilibili-player";
import { pauseBilibiliEmbed } from "@/lib/bilibili-embed";
import { useEffect, useRef, useState } from "react";

export type BilibiliEmbedPlayerProps = {
  bvid: string;
  title: string;
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

/**
 * B 站官方 Web 播放器（iframe）。全站唯一内嵌实现，勿再复制 iframe 字符串。
 */
export function BilibiliEmbedPlayer({
  bvid,
  title,
  mode = "eager",
  className = "",
  aspectClassName = "aspect-video",
  frameClassName = "",
}: BilibiliEmbedPlayerProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const normalized = normalizeBvid(bvid);
  const canPlay = Boolean(normalized);
  const [inView, setInView] = useState(mode === "eager");

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

  const src =
    inView && normalized
      ? buildBilibiliPlayerSrc(normalized, {
          autoplay: false,
          danmaku: false,
          highQuality: true,
        })
      : null;

  return (
    <div ref={rootRef} className={className}>
      <div
        className={`relative w-full overflow-hidden rounded-md border border-[var(--hairline)] bg-[#0a0a12] ${aspectClassName} ${frameClassName}`}
      >
        {src ? (
          <iframe
            key={normalized}
            ref={iframeRef}
            title={title}
            src={src}
            className="absolute inset-0 h-full w-full border-0"
            allowFullScreen
            scrolling="no"
            frameBorder={0}
            referrerPolicy="strict-origin-when-cross-origin"
            allow="fullscreen; encrypted-media; picture-in-picture"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-6 text-center">
            <span className="font-[family-name:var(--font-en)] text-[10px] font-medium uppercase tracking-[0.2em] text-[var(--muted)]">
              Bilibili
            </span>
            <p className="font-[family-name:var(--font-zh)] text-xs leading-relaxed text-[var(--muted-strong)]">
              {!canPlay
                ? "视频 ID（BV 号）无效。"
                : mode === "lazy"
                  ? "滚入视口后加载播放器。"
                  : "正在加载播放器…"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
