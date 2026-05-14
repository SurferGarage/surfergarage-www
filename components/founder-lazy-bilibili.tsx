"use client";

import { useEffect, useRef, useState } from "react";
import { pauseBilibiliEmbed } from "@/lib/bilibili-embed";

type FounderLazyBilibiliProps = {
  bvid: string;
  title: string;
};

/**
 * B 站 iframe：仅在进入视口后挂载；无 `bvid` 时保持灰盒、零网络请求。
 * 离开视口：`postMessage` 尝试暂停后卸载 iframe；切后台：`visibilitychange` 同步尝试暂停。
 */
export function FounderLazyBilibili({ bvid, title }: FounderLazyBilibiliProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [mountIframe, setMountIframe] = useState(false);
  const trimmed = bvid.trim();
  const canLoad = trimmed.length > 0;

  useEffect(() => {
    if (!canLoad) return;
    const el = rootRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      (entries) => {
        const hit = entries.some((e) => e.isIntersecting);
        setMountIframe((prev) => {
          if (prev && !hit) pauseBilibiliEmbed(iframeRef.current);
          return hit;
        });
      },
      { root: null, rootMargin: "120px 0px 120px 0px", threshold: 0.08 },
    );

    io.observe(el);
    return () => io.disconnect();
  }, [canLoad]);

  useEffect(() => {
    if (!mountIframe || !canLoad) return;
    const onVis = () => {
      if (document.hidden) pauseBilibiliEmbed(iframeRef.current);
    };
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, [mountIframe, canLoad]);

  const src =
    mountIframe && canLoad
      ? `https://player.bilibili.com/player.html?bvid=${encodeURIComponent(trimmed)}&page=1&high_quality=1&danmaku=0&autoplay=0`
      : undefined;

  return (
    <div ref={rootRef} className="mt-8 w-full max-w-[40rem]">
      <div className="relative aspect-video w-full overflow-hidden rounded-sm border border-[var(--hairline)] bg-[rgba(19,19,19,0.55)]">
        {src ? (
          <iframe
            ref={iframeRef}
            title={`Bilibili：${title}`}
            src={src}
            className="absolute inset-0 h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
            allowFullScreen
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-6 text-center">
            <span className="font-[family-name:var(--font-en)] text-[10px] font-medium uppercase tracking-[0.2em] text-[var(--muted)]">
              Bilibili Player
            </span>
            <p className="font-[family-name:var(--font-zh)] text-xs leading-relaxed text-[var(--muted-strong)]">
              {canLoad
                ? "进入视口后将加载内嵌播放器。"
                : "在 Founder Media「视频号」板块接入播放器或链接后，此处将展示内容。"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
