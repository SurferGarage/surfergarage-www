"use client";

import {
  buildBilibiliPlayerSrc,
  fetchBilibiliVideoMeta,
  normalizeBvid,
} from "@/lib/bilibili-player";
import { pauseBilibiliEmbed } from "@/lib/bilibili-embed";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState, type RefObject } from "react";

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
  /** 播放器加载完成前显示的封面，优先使用本地图片 */
  posterSrc?: string;
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
  posterSrc,
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
  const [readySrc, setReadySrc] = useState<string | null>(null);

  const playerSrc = knownSrc ?? fetchedSrc;
  const mountIframe = Boolean(playerSrc && (mode === "eager" || inView));
  const iframeReady = readySrc === playerSrc;

  useEffect(() => {
    const iframe = iframeRef.current;
    return () => {
      pauseBilibiliEmbed(iframe);
    };
  }, []);

  useEffect(() => {
    if (!mountIframe) {
      pauseBilibiliEmbed(iframeRef.current);
    }
  }, [mountIframe]);

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
          <BilibiliPlayerFrame
            iframeRef={iframeRef}
            playerSrc={playerSrc}
            title={title}
            posterSrc={posterSrc}
            ready={iframeReady}
            onReady={() => setReadySrc(playerSrc)}
          />
        ) : (
          <PlayerBackdrop
            posterSrc={posterSrc}
            status={
              !canPlay
                ? "视频暂不可用"
                : mode === "lazy" && !inView
                  ? "进入画面后加载"
                  : "正在连接播放器"
            }
          />
        )}
      </div>
    </div>
  );
}

function BilibiliPlayerFrame({
  iframeRef,
  playerSrc,
  title,
  posterSrc,
  ready,
  onReady,
}: {
  iframeRef: RefObject<HTMLIFrameElement | null>;
  playerSrc: string;
  title: string;
  posterSrc?: string;
  ready: boolean;
  onReady: () => void;
}) {
  return (
    <>
      <PlayerBackdrop
        posterSrc={posterSrc}
        className={`z-[2] transition-opacity duration-500 ${ready ? "opacity-0" : "opacity-100"}`}
      />
      <iframe
        key={playerSrc}
        ref={iframeRef}
        title={title}
        src={playerSrc}
        className="absolute inset-0 z-[1] h-full w-full border-0"
        allowFullScreen
        scrolling="no"
        frameBorder={0}
        allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
        onLoad={onReady}
      />
    </>
  );
}

function PlayerBackdrop({
  posterSrc,
  status,
  className = "",
}: {
  posterSrc?: string;
  status?: string;
  className?: string;
}) {
  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden bg-[#0a0a12] ${className}`}
      aria-hidden
    >
      {posterSrc ? (
        <Image
          src={posterSrc}
          alt=""
          fill
          sizes="(max-width: 1024px) 100vw, 66vw"
          className="object-cover"
          priority={posterSrc.startsWith("/")}
          unoptimized={!posterSrc.startsWith("/")}
        />
      ) : null}
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,6,13,0.08)_0%,rgba(5,6,13,0.24)_58%,rgba(5,6,13,0.78)_100%)]" />
      {posterSrc ? (
        <span className="absolute left-1/2 top-1/2 inline-flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/55 bg-black/32 text-[18px] text-white shadow-[0_14px_42px_rgba(0,0,0,0.34)] backdrop-blur-sm md:h-16 md:w-16 md:text-[20px]">
          <span className="translate-x-px">&#9654;</span>
        </span>
      ) : null}
      {status ? (
        <p className="absolute inset-x-5 bottom-4 text-center font-[family-name:var(--font-zh)] text-[13px] text-white/78 md:bottom-5 md:text-[14px]">
          {status}
        </p>
      ) : null}
    </div>
  );
}
