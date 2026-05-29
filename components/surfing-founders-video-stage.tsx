"use client";

import { BilibiliEmbedPlayer } from "@/components/bilibili-embed-player";
import { bilibiliWatchUrl } from "@/lib/bilibili-player";
import {
  BILIBILI_SPACE_URL,
  getDefaultEpisode,
  SURFING_FOUNDERS_SEASON_01,
  type SurfingFoundersEpisode,
  type SurfingFoundersGuest,
} from "@/lib/surfing-founders-video-season";
import { useFounderPanelVisible } from "@/lib/use-founder-panel-visible";
import { useCallback, useMemo, useRef, useState } from "react";

/** 嘉宾横向 chip：替代左侧大空封面，紧凑显示本季 6 席 */
function GuestChip({
  guest,
  index,
  active,
  onSelect,
}: {
  guest: SurfingFoundersGuest;
  index: number;
  active: boolean;
  onSelect: () => void;
}) {
  const live = !guest.comingSoon && guest.episodes.length > 0;
  const disabled = !live && !active;
  return (
    <button
      type="button"
      role="option"
      aria-selected={active}
      disabled={disabled}
      onClick={onSelect}
      className={`group flex shrink-0 flex-col items-start gap-1.5 rounded-sm border px-3.5 py-2.5 text-left transition-[border-color,background-color,color] duration-200 md:px-4 md:py-3 ${
        active
          ? "border-[var(--brand-teal)]/55 bg-[color-mix(in_oklch,var(--brand-teal)_10%,transparent)]"
          : live
            ? "border-[var(--hairline)] bg-[var(--paper-1)] hover:border-[var(--hairline-strong)] hover:bg-[var(--paper-2)]"
            : "border-dashed border-[var(--hairline)] bg-[rgba(15,17,22,0.45)]"
      } ${disabled ? "cursor-not-allowed opacity-65" : ""}`}
    >
      <span className="editorial-mono text-[9.5px] uppercase tracking-[0.18em] text-[var(--muted)]">
        {`Guest 0${index + 1}`}
        {!live ? " · TBA" : ""}
      </span>
      <span
        className={`font-[family-name:var(--font-en)] text-[14px] font-medium leading-none tracking-[-0.02em] md:text-[15px] ${
          active ? "text-[var(--foreground)]" : "text-[var(--muted-strong)]"
        }`}
      >
        {guest.nameEn}
      </span>
      <span
        className={`font-[family-name:var(--font-zh)] text-[11.5px] leading-none md:text-[12.5px] ${
          active ? "text-[var(--brand-teal)]" : "text-[var(--muted)]"
        }`}
      >
        {guest.nameZh}
      </span>
    </button>
  );
}

/** 单集小卡 — 横向排列 */
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
          : "border-[var(--hairline)] bg-[var(--paper-1)] hover:border-[var(--hairline-strong)] hover:bg-[var(--paper-2)]"
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
        className={`line-clamp-1 max-w-[14rem] font-[family-name:var(--font-zh)] text-[12px] font-medium leading-snug md:text-[13px] ${
          active ? "text-[var(--foreground)]" : "text-[var(--muted-strong)]"
        }`}
        title={episode.titleZh}
      >
        {episode.titleZh}
      </span>
    </button>
  );
}

export function SurfingFoundersVideoStage() {
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
      className="flex w-full flex-col gap-4 md:gap-5"
      data-surfing-founders-video
      aria-label="浪前视频播客"
    >
      {/* 顶部：嘉宾名单（横向 chip） */}
      <div>
        <div className="flex items-baseline justify-between gap-3">
          <p className="editorial-eyebrow text-[var(--foreground)]">
            {season.seasonLabelEn} · Roster
          </p>
          <p className="editorial-mono text-[10px] uppercase tracking-[0.18em] text-[var(--muted)]">
            {season.seasonLabel} · {season.guests.length} 席
          </p>
        </div>
        <ul
          role="listbox"
          aria-label="本季嘉宾"
          className="mt-3 flex w-full gap-2 overflow-x-auto pb-2 md:gap-3 md:flex-wrap md:overflow-visible md:pb-0"
        >
          {season.guests.map((g, i) => (
            <li key={g.id} className="shrink-0">
              <GuestChip
                guest={g}
                index={i}
                active={g.id === guest.id}
                onSelect={() => selectGuest(g.id)}
              />
            </li>
          ))}
        </ul>
      </div>

      {/* 主体：左 meta + 右 大画幅播放器 */}
      <div className="grid grid-cols-1 gap-4 md:gap-5 lg:grid-cols-12">
        {/* 左：当前嘉宾 meta + episode chips */}
        <aside className="flex flex-col gap-4 lg:col-span-4">
          <div>
            <p className="editorial-eyebrow text-[var(--muted)]">
              Now playing
            </p>
            <p className="mt-2 editorial-serif text-[clamp(1.4rem,3vw,2rem)] leading-[1.04] text-[var(--foreground)]">
              {guest.nameEn}
            </p>
            <p className="mt-1 font-[family-name:var(--font-zh)] text-[14px] text-[var(--brand-teal)] md:text-[15px]">
              {guest.nameZh}
            </p>
            <p className="mt-3 line-clamp-3 font-[family-name:var(--font-zh)] text-[12.5px] leading-[1.6] text-[var(--muted-strong)] md:text-[13.5px]">
              {guest.nowCaptionZh}
            </p>
          </div>

          {guest.episodes.length > 0 ? (
            <div>
              <p className="editorial-eyebrow text-[var(--muted)]">
                Episodes · 本季四期
              </p>
              <ul className="mt-3 flex flex-col gap-2">
                {guest.episodes.map((ep) => (
                  <li key={ep.id}>
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

          <div className="mt-auto flex flex-wrap items-center gap-4 border-t border-[var(--hairline)] pt-3">
            <a
              href={BILIBILI_SPACE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="editorial-mono text-[10px] uppercase tracking-[0.16em] text-[var(--foreground)] transition-opacity hover:opacity-70"
            >
              B 站空间 ↗
            </a>
            {activeEpisode ? (
              <a
                href={bilibiliWatchUrl(activeEpisode.bvid)}
                target="_blank"
                rel="noopener noreferrer"
                className="editorial-mono text-[10px] uppercase tracking-[0.16em] text-[var(--brand-teal)] transition-opacity hover:opacity-75"
              >
                打开当前集 ↗
              </a>
            ) : null}
          </div>
        </aside>

        {/* 右：大画幅播放器 */}
        <div className="lg:col-span-8">
          {activeEpisode?.bvid ? (
            panelVisible ? (
              <BilibiliEmbedPlayer
                key={`${guest.id}-${activeEpisode.bvid}`}
                bvid={activeEpisode.bvid}
                aid={activeEpisode.aid}
                cid={activeEpisode.cid}
                title={playerTitle}
                mode="eager"
                aspectClassName="aspect-video"
              />
            ) : (
              <div className="flex aspect-video w-full items-center justify-center rounded-md border border-[var(--hairline)] bg-[rgba(15,17,22,0.55)]">
                <p className="font-[family-name:var(--font-zh)] text-sm text-[var(--muted-strong)]">
                  滑到本屏后加载
                </p>
              </div>
            )
          ) : (
            <div className="flex aspect-video w-full items-center justify-center rounded-md border border-dashed border-[var(--hairline)] bg-[rgba(15,17,22,0.45)]">
              <p className="font-[family-name:var(--font-zh)] text-sm text-[var(--muted)]">
                该席位视频上线后自动启用播放器
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
