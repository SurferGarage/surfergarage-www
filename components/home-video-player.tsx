"use client";

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
  const activeEpisode = episodes[activeIndex] ?? episodes[0];
  const watchUrl = useMemo(
    () => (activeEpisode ? bilibiliWatchUrl(activeEpisode.bvid) : "#"),
    [activeEpisode],
  );

  if (!activeEpisode) return null;

  return (
    <div>
      <BilibiliEmbedPlayer
        key={activeEpisode.id}
        bvid={activeEpisode.bvid}
        aid={activeEpisode.aid}
        cid={activeEpisode.cid}
        title={activeEpisode.titleZh}
        mode="lazy"
        className="w-full"
      />

      <div className="mt-5 flex flex-wrap items-center justify-between gap-4 border-b border-[var(--hairline)] pb-5">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 font-[family-name:var(--font-mono)] text-[11px] uppercase text-[var(--muted)]">
          <span className="text-[var(--brand-teal)]">浪前对话</span>
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

      <h3 className="mt-5 max-w-[42rem] font-[family-name:var(--font-zh)] text-[1.45rem] font-medium leading-[1.4] text-[var(--foreground)] md:text-[2rem]">
        {activeEpisode.titleZh}
      </h3>

      <div
        className="mt-6 grid grid-cols-4 border border-[var(--hairline)]"
        aria-label="选择视频分集"
      >
        {episodes.map((episode, index) => {
          const active = index === activeIndex;
          return (
            <button
              key={episode.id}
              type="button"
              aria-pressed={active}
              onClick={() => setActiveIndex(index)}
              className={`min-h-11 border-l border-[var(--hairline)] px-2 py-2 font-[family-name:var(--font-mono)] text-[10px] uppercase transition-colors first:border-l-0 md:text-[11px] ${
                active
                  ? "bg-[var(--brand-primary)] text-white"
                  : "bg-[var(--paper-1)] text-[var(--muted)] hover:text-[var(--foreground)]"
              }`}
            >
              {episode.volLabel}
            </button>
          );
        })}
      </div>
    </div>
  );
}
