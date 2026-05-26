"use client";

import { BilibiliEmbedPlayer } from "@/components/bilibili-embed-player";
import { BilibiliEpisodeCover } from "@/components/bilibili-episode-cover";
import { bilibiliWatchUrl } from "@/lib/bilibili-player";
import {
  BILIBILI_SPACE_URL,
  getDefaultEpisode,
  getOriginEpisode,
  SURFING_FOUNDERS_SEASON_01,
  type SurfingFoundersEpisode,
  type SurfingFoundersGuest,
} from "@/lib/surfing-founders-video-season";
import { useFounderPanelVisible } from "@/lib/use-founder-panel-visible";
import Image from "next/image";
import { useCallback, useMemo, useRef, useState } from "react";

/** 嘉宾大字垂直名单 — YC 式 */
function GuestRoster({
  guests,
  activeId,
  onSelect,
}: {
  guests: readonly SurfingFoundersGuest[];
  activeId: string;
  onSelect: (id: string) => void;
}) {
  return (
    <ul
      role="listbox"
      aria-label="本季嘉宾"
      className="flex flex-col divide-y divide-[var(--hairline-soft)]"
    >
      {guests.map((g) => {
        const isActive = g.id === activeId;
        const live = !g.comingSoon && g.episodes.length > 0;
        return (
          <li key={g.id}>
            <button
              type="button"
              role="option"
              aria-selected={isActive}
              disabled={!live && !isActive}
              onClick={() => live && onSelect(g.id)}
              className={`group flex w-full flex-col items-start gap-1.5 py-3 text-left transition-[color,opacity] md:py-4 ${
                !live && !isActive ? "cursor-not-allowed opacity-65" : ""
              }`}
            >
              <span
                className={`font-[family-name:var(--font-en)] uppercase leading-[0.94] tracking-[-0.035em] transition-[font-size,font-weight,color] ${
                  isActive
                    ? "text-[clamp(1.85rem,3.4vw,2.7rem)] font-medium text-[var(--foreground)]"
                    : live
                      ? "text-[clamp(1.2rem,2vw,1.55rem)] font-normal text-[var(--muted-soft)] group-hover:text-[var(--muted-strong)]"
                      : "text-[clamp(1.05rem,1.8vw,1.4rem)] font-normal text-[var(--muted-soft)]/55"
                }`}
              >
                {g.nameEn}
              </span>
              <span
                className={`font-[family-name:var(--font-zh)] text-[12px] tracking-[0.02em] md:text-[13px] ${
                  isActive
                    ? "text-[var(--brand-teal)]"
                    : "text-[var(--muted)]"
                }`}
              >
                {g.nameZh}
                {g.comingSoon ? " · 待公布" : ""}
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}

/** 单集 chip — 横向排列 */
function EpisodeChip({
  episode,
  active,
  onSelect,
}: {
  episode: SurfingFoundersEpisode;
  active: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-current={active ? "true" : undefined}
      className={`flex shrink-0 flex-col items-start gap-1 rounded-sm border px-3 py-2 text-left transition-[border-color,background-color,color] duration-200 ${
        active
          ? "border-[var(--brand-teal)]/55 bg-[color-mix(in_oklch,var(--brand-teal)_10%,transparent)]"
          : "border-[var(--hairline)] bg-[rgba(15,17,22,0.55)] hover:border-[var(--hairline-strong)]"
      }`}
    >
      <span
        className={`editorial-mono text-[9.5px] uppercase tracking-[0.18em] ${
          active ? "text-[var(--brand-teal)]" : "text-[var(--muted)]"
        }`}
      >
        {episode.volLabel}
      </span>
      <span
        className={`line-clamp-1 max-w-[12rem] font-[family-name:var(--font-zh)] text-[12px] leading-snug md:text-[12.5px] ${
          active ? "text-[var(--foreground)]" : "text-[var(--muted-strong)]"
        }`}
        title={episode.titleZh}
      >
        {episode.titleZh}
      </span>
    </button>
  );
}

/**
 * Founders Block B · 视频播客 — YC 式三栏全宽 breakout：
 * - 左 ~32%：origin episode 大封面（全高，贴 viewport 左边缘）
 * - 中 ~24%：嘉宾大字垂直名单（YC 风格，active 高对比）
 * - 右 ~44%：full-width player + 当前 episode meta + 4 期 chip strip
 * 三栏统一贴 viewport 边缘，不留中央 1680 max-width 限制。
 */
export function FounderVideoStudio() {
  const rootRef = useRef<HTMLDivElement>(null);
  const panelVisible = useFounderPanelVisible(rootRef);
  const season = SURFING_FOUNDERS_SEASON_01;
  const liveGuests = useMemo(
    () => season.guests.filter((g) => !g.comingSoon && g.episodes.length > 0),
    [season.guests],
  );

  const [guestId, setGuestId] = useState(liveGuests[0]?.id ?? "");
  const guest =
    season.guests.find((g) => g.id === guestId) ?? liveGuests[0] ?? season.guests[0];

  const defaultEp = getDefaultEpisode(guest);
  const [episodeId, setEpisodeId] = useState(defaultEp?.id ?? "");

  const activeEpisode = useMemo(() => {
    const found = guest.episodes.find((e) => e.id === episodeId);
    return found ?? defaultEp;
  }, [guest, episodeId, defaultEp]);

  const originEpisode = getOriginEpisode(guest);

  const selectGuest = useCallback(
    (id: string) => {
      const next = season.guests.find((g) => g.id === id);
      if (!next || next.comingSoon || !next.episodes.length) return;
      setGuestId(id);
      const ep = getDefaultEpisode(next);
      if (ep) setEpisodeId(ep.id);
    },
    [season.guests],
  );

  const playerTitle = activeEpisode
    ? `${guest.nameZh} · ${activeEpisode.titleZh}`
    : guest.nameZh;

  return (
    <div
      ref={rootRef}
      className="grid h-full w-full grid-cols-1 lg:grid-cols-12"
      data-surfing-founders-video
      aria-label="浪前视频播客"
    >
      {/* 左：嘉宾大画幅（有 portraitSrc 时显示人像；否则 origin episode cover；都没有时 motif 占位） */}
      <div className="relative min-h-[34svh] overflow-hidden bg-[var(--paper-2)] lg:col-span-4 lg:min-h-0">
        {guest.portraitSrc ? (
          /* —— 杂志人物专访 —— 彩色人像 + paper 暗背 letterbox + vignette 软边 */
          <div className="flex h-full w-full flex-col">
            {/* 顶部 mono 元信息条（paper-2 底色上，不压图） */}
            <div className="flex items-baseline justify-between gap-3 px-5 pt-6 md:px-8 md:pt-8 lg:px-9 lg:pt-10">
              <div className="flex items-baseline gap-3">
                <span className="editorial-mono text-[10.5px] uppercase tracking-[0.22em] text-[var(--foreground)]">
                  {SURFING_FOUNDERS_SEASON_01.seasonLabelEn} · Origin
                </span>
                <span className="editorial-mono text-[10px] uppercase tracking-[0.18em] text-[var(--muted)]">
                  {originEpisode?.volLabel ?? "TBA"}
                </span>
              </div>
            </div>

            {/* 人像主体：60-70% 容器宽，居中，aspect-[3/4] portrait；保留原色，仅轻微 tune */}
            <div className="relative flex flex-1 items-center justify-center px-5 py-4 md:px-8 md:py-5 lg:px-10 lg:py-6">
              <div
                className="relative aspect-[3/4] w-full max-w-[260px] sm:max-w-[300px] md:max-w-[320px] lg:max-w-[300px] xl:max-w-[340px]"
                style={{
                  /* 边缘 vignette mask：人像本身边缘向 paper-2 自然 fade，没有色块覆盖，保留人脸彩色 */
                  WebkitMaskImage:
                    "radial-gradient(ellipse 80% 90% at 50% 44%, #000 55%, transparent 100%)",
                  maskImage:
                    "radial-gradient(ellipse 80% 90% at 50% 44%, #000 55%, transparent 100%)",
                }}
              >
                <Image
                  key={guest.id}
                  src={guest.portraitSrc}
                  alt={`${guest.nameZh} · ${guest.nameEn}`}
                  fill
                  priority
                  sizes="(max-width: 1024px) 320px, 340px"
                  className="object-cover object-[center_top] saturate-[0.94] contrast-[1.04] brightness-[0.97]"
                />
              </div>
            </div>

            {/* 底部 嘉宾名 + 引文 + Play chip（paper-2 底色上，独立区域） */}
            <div className="flex flex-col gap-2 px-5 pb-6 md:px-8 md:pb-7 lg:px-9 lg:pb-8">
              <p className="editorial-mono text-[10px] uppercase tracking-[0.22em] text-[color-mix(in_oklch,var(--brand-teal)_60%,var(--muted-strong))]">
                Now featuring
              </p>
              <p className="editorial-serif text-[clamp(1.9rem,3.6vw,2.7rem)] leading-[0.98] text-[var(--foreground)]">
                {guest.nameEn}
              </p>
              <p className="font-[family-name:var(--font-zh)] text-[14px] tracking-[0.04em] text-[var(--brand-teal)] md:text-[15px]">
                {guest.nameZh}
              </p>
              <p className="mt-1 max-w-[36ch] font-[family-name:var(--font-zh)] text-[12px] leading-[1.6] text-[var(--muted-strong)] md:text-[13px]">
                {guest.duringCaptionZh.slice(0, 36)}…
              </p>

              {originEpisode ? (
                <button
                  type="button"
                  onClick={() => setEpisodeId(originEpisode.id)}
                  aria-label={`播放 ${guest.nameZh} 的开场集`}
                  className="mt-3 inline-flex w-fit items-center gap-2 rounded-sm border border-[var(--hairline-strong)] bg-[rgba(15,17,22,0.7)] px-3 py-1.5 editorial-mono text-[10px] uppercase tracking-[0.18em] text-[var(--foreground)] transition-[background-color,border-color] hover:border-[var(--brand-teal)] hover:bg-[color-mix(in_oklch,var(--brand-teal)_18%,transparent)]"
                >
                  <span aria-hidden>▶</span>
                  Play {originEpisode.volLabel}
                </button>
              ) : null}
            </div>
          </div>
        ) : originEpisode ? (
          /* —— Fallback：B 站 origin episode cover —— */
          <button
            type="button"
            onClick={() => setEpisodeId(originEpisode.id)}
            aria-label={`播放 ${guest.nameZh} 的开场集`}
            className="group block h-full w-full text-left"
          >
            <BilibiliEpisodeCover
              bvid={originEpisode.bvid}
              alt={`${guest.nameEn} · ${originEpisode.titleZh}`}
              className="absolute inset-0"
            />
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,transparent_30%,rgba(0,0,0,0.55)_100%)]" />
            <div className="pointer-events-none absolute left-5 top-5 flex items-baseline gap-3 md:left-8 md:top-8">
              <span className="editorial-mono text-[10.5px] uppercase tracking-[0.22em] text-[rgba(255,255,255,0.9)] [text-shadow:0_1px_3px_rgba(0,0,0,0.55)]">
                Origin · {originEpisode.volLabel}
              </span>
            </div>
            <div className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-col gap-2 px-5 py-6 md:px-8 md:py-7 lg:px-9 lg:py-8">
              <p className="editorial-mono text-[10px] uppercase tracking-[0.22em] text-[rgba(255,255,255,0.72)] [text-shadow:0_1px_3px_rgba(0,0,0,0.55)]">
                Now featuring
              </p>
              <p className="editorial-serif text-[clamp(1.6rem,3.4vw,2.4rem)] leading-[1.02] text-[rgba(255,255,255,0.96)] [text-shadow:0_2px_8px_rgba(0,0,0,0.55)]">
                {guest.nameEn}
              </p>
              <p className="font-[family-name:var(--font-zh)] text-[12.5px] leading-[1.55] text-[rgba(255,255,255,0.78)] [text-shadow:0_1px_4px_rgba(0,0,0,0.5)] md:text-[13.5px]">
                {guest.nameZh} · {guest.duringCaptionZh.slice(0, 28)}…
              </p>
              <span className="mt-2 inline-flex w-fit items-center gap-2 rounded-full border border-white/35 bg-black/35 px-3 py-1.5 editorial-mono text-[10px] uppercase tracking-[0.18em] text-white backdrop-blur-sm transition-opacity group-hover:bg-black/55">
                <span aria-hidden>▶</span>
                Play {originEpisode.volLabel}
              </span>
            </div>
          </button>
        ) : (
          /* —— 待公布席位：motif 占位 —— */
          <div className="flex h-full w-full items-center justify-center bg-[radial-gradient(60%_40%_at_30%_30%,rgba(39,215,199,0.18),transparent_60%),linear-gradient(180deg,rgba(15,17,22,0.85),rgba(11,12,16,1))]">
            <p className="font-[family-name:var(--font-zh)] text-sm text-[var(--muted)]">
              席位待公布
            </p>
          </div>
        )}
      </div>

      {/* 中：嘉宾大字垂直名单 — YC 风格 */}
      <div className="flex flex-col gap-4 border-t border-b border-[var(--hairline)] px-5 py-6 md:px-8 md:py-8 lg:col-span-3 lg:border-t-0 lg:border-b-0 lg:border-x lg:px-6 lg:py-10 xl:px-8">
        <div className="flex items-baseline justify-between gap-2">
          <p className="editorial-eyebrow text-[var(--foreground)]">
            {season.seasonLabelEn}
          </p>
          <p className="editorial-mono text-[10px] uppercase tracking-[0.18em] text-[var(--muted)]">
            {season.guests.length} 席
          </p>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto pr-1">
          <GuestRoster
            guests={season.guests}
            activeId={guest.id}
            onSelect={selectGuest}
          />
        </div>
      </div>

      {/* 右：player + episode meta + 4 期 chip */}
      <div className="flex flex-col gap-4 bg-[var(--paper-1)] px-5 py-6 md:px-8 md:py-8 lg:col-span-5 lg:px-9 lg:py-10 xl:px-12">
        <div className="flex items-baseline justify-between gap-3">
          <div className="min-w-0">
            <p className="editorial-eyebrow text-[var(--brand-teal)]">
              Now playing
            </p>
            <p className="mt-2 line-clamp-2 editorial-serif text-[clamp(1.15rem,1.8vw,1.6rem)] leading-[1.15] text-[var(--foreground)]">
              {activeEpisode?.titleZh ?? guest.nameZh}
            </p>
          </div>
          {activeEpisode ? (
            <a
              href={bilibiliWatchUrl(activeEpisode.bvid)}
              target="_blank"
              rel="noopener noreferrer"
              className="editorial-mono shrink-0 rounded-sm border border-[var(--brand-teal)]/55 bg-[color-mix(in_oklch,var(--brand-teal)_12%,transparent)] px-3 py-2 text-[10px] uppercase tracking-[0.16em] text-[var(--foreground)] transition-[background-color,border-color] hover:border-[var(--brand-teal)] hover:bg-[color-mix(in_oklch,var(--brand-teal)_22%,transparent)]"
            >
              在 B 站打开 ↗
            </a>
          ) : null}
        </div>

        {/* 大画幅播放器 — group 容器，hover 显示「在 B 站打开」遮罩兜底 */}
        <div className="min-h-0 flex-1">
          {activeEpisode?.bvid ? (
            <div className="group/player relative">
              {panelVisible ? (
                <BilibiliEmbedPlayer
                  key={`${guest.id}-${activeEpisode.bvid}`}
                  bvid={activeEpisode.bvid}
                  title={playerTitle}
                  mode="eager"
                  aspectClassName="aspect-video"
                />
              ) : (
                <div className="flex aspect-video w-full items-center justify-center rounded-md border border-[var(--hairline)] bg-[rgba(15,17,22,0.55)]">
                  <p className="font-[family-name:var(--font-zh)] text-sm text-[var(--muted-strong)]">
                    进入本屏加载
                  </p>
                </div>
              )}

              {/* hover 角标兜底：内嵌如果不可播放，用户能立即看到外跳口 */}
              <a
                href={bilibiliWatchUrl(activeEpisode.bvid)}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute right-3 top-3 z-10 inline-flex items-center gap-2 rounded-sm border border-[var(--hairline-strong)] bg-[rgba(11,12,16,0.78)] px-3 py-1.5 editorial-mono text-[10px] uppercase tracking-[0.18em] text-[var(--foreground)] opacity-100 backdrop-blur-md transition-opacity duration-200 hover:border-[var(--brand-teal)] hover:bg-[color-mix(in_oklch,var(--brand-teal)_22%,rgba(11,12,16,0.78))] md:opacity-0 md:group-hover/player:opacity-100 focus-visible:opacity-100"
                aria-label="在 B 站打开当前集"
              >
                <span>在 B 站打开</span>
                <span aria-hidden className="text-[var(--brand-teal)]">↗</span>
              </a>
            </div>
          ) : (
            <div className="flex aspect-video w-full items-center justify-center rounded-md border border-dashed border-[var(--hairline)] bg-[rgba(15,17,22,0.45)]">
              <p className="font-[family-name:var(--font-zh)] text-sm text-[var(--muted)]">
                待上线
              </p>
            </div>
          )}
        </div>

        {/* 静音提示 + 显著外跳 CTA — 兜底入口（iframe 内错无法 detect） */}
        {activeEpisode ? (
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-sm border border-[var(--hairline-soft)] bg-[var(--paper-2)] px-3.5 py-2.5">
            <p className="editorial-mono text-[9.5px] uppercase tracking-[0.18em] text-[var(--muted)]">
              <span className="mr-1.5 inline-block rounded-sm border border-[var(--hairline-strong)] px-1.5 py-0.5 text-[9px] text-[var(--muted-strong)]">
                MUTED
              </span>
              默认静音
            </p>
            <a
              href={bilibiliWatchUrl(activeEpisode.bvid)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-sm border border-[var(--brand-teal)]/55 bg-[color-mix(in_oklch,var(--brand-teal)_12%,transparent)] px-3 py-1.5 editorial-mono text-[10px] uppercase tracking-[0.18em] text-[var(--foreground)] transition-[background-color,border-color] hover:border-[var(--brand-teal)] hover:bg-[color-mix(in_oklch,var(--brand-teal)_22%,transparent)]"
            >
              <span>在 B 站播放</span>
              <span aria-hidden className="text-[var(--brand-teal)]">↗</span>
            </a>
          </div>
        ) : null}

        {/* 4 期 chip strip */}
        {guest.episodes.length > 0 ? (
          <div className="flex flex-col gap-2.5">
            <p className="editorial-eyebrow text-[var(--muted)]">
              四期
            </p>
            <ul className="flex w-full gap-2 overflow-x-auto pb-1 md:gap-2.5">
              {guest.episodes.map((ep) => (
                <li key={ep.id} className="shrink-0">
                  <EpisodeChip
                    episode={ep}
                    active={ep.id === activeEpisode?.id}
                    onSelect={() => setEpisodeId(ep.id)}
                  />
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        <a
          href={BILIBILI_SPACE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-auto inline-flex w-fit items-center gap-2 editorial-mono text-[10.5px] uppercase tracking-[0.16em] text-[var(--muted-strong)] transition-opacity hover:opacity-70"
        >
          B 站空间 ↗
          <span aria-hidden>↗</span>
        </a>
      </div>
    </div>
  );
}
