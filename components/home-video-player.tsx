"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

import { BilibiliEmbedPlayer } from "@/components/bilibili-embed-player";
import { bilibiliWatchUrl } from "@/lib/bilibili-player";
import type { SurfingFoundersEpisode } from "@/lib/surfing-founders-video-season";

export function HomeVideoPlayer({
  guestName,
  episodes,
}: {
  guestName: string;
  episodes: readonly SurfingFoundersEpisode[];
}) {
  const initialIndex = Math.max(episodes.length - 1, 0);
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const [playingEpisodeId, setPlayingEpisodeId] = useState<string | null>(null);
  const activeEpisode = episodes[activeIndex] ?? episodes[0];
  const watchUrl = useMemo(
    () => (activeEpisode ? bilibiliWatchUrl(activeEpisode.bvid) : "#"),
    [activeEpisode],
  );

  if (!activeEpisode) return null;

  const episodeTitle = activeEpisode.titleZh.split("｜")[0].trim();

  return (
    <div>
      {playingEpisodeId === activeEpisode.id ? (
        <BilibiliEmbedPlayer
          key={activeEpisode.id}
          bvid={activeEpisode.bvid}
          aid={activeEpisode.aid}
          cid={activeEpisode.cid}
          title={activeEpisode.titleZh}
          mode="eager"
          posterSrc={activeEpisode.coverPic}
          className="w-full"
        />
      ) : (
        <button
          type="button"
          onClick={() => setPlayingEpisodeId(activeEpisode.id)}
          aria-label={`观看${guestName}：${activeEpisode.titleZh}`}
          className="group relative block aspect-video w-full overflow-hidden border border-[var(--hairline)] bg-[#0a0a12] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-teal)]"
        >
          <Image
            src={activeEpisode.coverPic}
            alt=""
            fill
            sizes="(max-width: 1024px) calc(100vw - 40px), 66vw"
            className="object-cover"
          />
          <span className="absolute inset-0 bg-black/20 transition-colors group-hover:bg-black/30" />
          <span className="absolute left-1/2 top-1/2 inline-flex -translate-x-1/2 -translate-y-1/2 items-center gap-3 rounded-full border border-white/60 bg-black/60 px-5 py-3 text-[14px] font-medium text-white backdrop-blur-sm">
            <span aria-hidden>▶</span> 观看本期
          </span>
        </button>
      )}

      <div className="mt-5 flex flex-wrap items-center justify-between gap-4 border-b border-[var(--hairline)] pb-5">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 font-[family-name:var(--font-mono)] text-[11px] uppercase text-[var(--muted)]">
          <span>{activeEpisode.volLabel}</span>
          <span>{guestName}</span>
        </div>
        <a
          href={watchUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="font-[family-name:var(--font-zh)] text-[14px] text-[var(--brand-teal)] transition-colors hover:text-[var(--foreground)]"
        >
          在 B 站打开 ↗
        </a>
      </div>

      <h3 className="mt-4 max-w-[42rem] font-[family-name:var(--font-zh)] text-[1.2rem] font-medium leading-[1.5] text-[var(--foreground)] md:text-[1.45rem]">
        {episodeTitle}
      </h3>

      <div
        className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4"
        aria-label="选择视频分集"
      >
        {episodes.map((episode, index) => {
          const active = index === activeIndex;
          return (
            <button
              key={episode.id}
              type="button"
              aria-pressed={active}
              aria-label={`${episode.volLabel}：${episode.titleZh}`}
              onClick={() => {
                setActiveIndex(index);
                setPlayingEpisodeId(null);
              }}
              className={`min-h-24 border border-[var(--hairline)] px-3 py-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-teal)] ${
                active
                  ? "bg-[var(--brand-primary)] text-white"
                  : "bg-[var(--paper-1)] text-[var(--muted-strong)] hover:text-[var(--foreground)]"
              }`}
            >
              <span className="block font-[family-name:var(--font-mono)] text-[10px] uppercase opacity-70">
                {episode.volLabel}
              </span>
              <span className="mt-2 line-clamp-2 font-[family-name:var(--font-zh)] text-[12px] leading-[1.6]">
                {episode.titleZh.split("｜")[0].trim()}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
