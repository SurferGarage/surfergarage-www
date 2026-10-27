"use client";

import Image from "next/image";
import { useEffect, useId, useRef, useState } from "react";

import { HomeVideoPlayer } from "@/components/home-video-player";
import { bilibiliWatchUrl } from "@/lib/bilibili-player";
import { SG_PAGE_SHELL_CLASS } from "@/lib/sg-layout";
import { SURFING_FOUNDERS_SEASON_01 } from "@/lib/surfing-founders-video-season";

const VIDEO_DIRECTORY = SURFING_FOUNDERS_SEASON_01.guests
  .filter((guest) => guest.episodes.length > 0)
  .reverse();

export function HomeDialogue() {
  const [selectedGuestId, setSelectedGuestId] = useState(
    VIDEO_DIRECTORY[0]?.id ?? "",
  );
  const [directoryOpen, setDirectoryOpen] = useState(false);
  const directoryId = useId();
  const directoryRef = useRef<HTMLElement>(null);
  const directoryTriggerRef = useRef<HTMLButtonElement>(null);
  const selectedGuest =
    VIDEO_DIRECTORY.find((guest) => guest.id === selectedGuestId) ??
    VIDEO_DIRECTORY[0];
  const episodeCount = VIDEO_DIRECTORY.reduce(
    (total, guest) => total + guest.episodes.length,
    0,
  );

  useEffect(() => {
    if (!directoryOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      const node = event.target as Node;
      if (
        directoryRef.current?.contains(node) ||
        directoryTriggerRef.current?.contains(node)
      ) {
        return;
      }
      setDirectoryOpen(false);
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setDirectoryOpen(false);
      directoryTriggerRef.current?.focus();
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [directoryOpen]);

  const closeDirectory = () => {
    setDirectoryOpen(false);
    directoryTriggerRef.current?.focus();
  };

  const selectGuest = (id: string) => {
    setSelectedGuestId(id);
    closeDirectory();
  };

  return (
    <section
      id="dialogue"
      className="sg-ed-section scroll-mt-[4.5rem] border-b border-[var(--hairline)] bg-[#07080b]"
      aria-labelledby="dialogue-section-heading"
    >
      <div className={SG_PAGE_SHELL_CLASS}>
        <header className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="sg-ed-kicker">VIDEO PODCAST</p>
            <h2 id="dialogue-section-heading" className="sg-ed-heading mt-3">
              浪前对话
            </h2>
          </div>
          <p className="max-w-[30rem] font-[family-name:var(--font-zh)] text-[15px] leading-[1.75] text-[var(--muted-strong)] md:text-[16px]">
            与年轻创始人长谈产品、选择与创业现场。
          </p>
        </header>

        <div className="mt-8 border-y border-[var(--hairline)]">
          <button
            ref={directoryTriggerRef}
            type="button"
            aria-expanded={directoryOpen}
            aria-controls={directoryId}
            onClick={() => setDirectoryOpen((open) => !open)}
            className="flex min-h-14 w-full flex-wrap items-center justify-between gap-x-5 gap-y-1 py-3 text-left font-[family-name:var(--font-zh)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-teal)]/60"
          >
            <span className="text-[15px] font-medium text-[var(--foreground)]">
              当前：{selectedGuest?.nameZh}
              <span className="ml-3 text-[13px] font-normal text-[var(--muted)]">
                {SURFING_FOUNDERS_SEASON_01.seasonLabel} · {episodeCount} 期
              </span>
            </span>
            <span className="inline-flex items-center gap-3 text-[14px] text-[var(--brand-teal)]">
              {directoryOpen ? "收起目录" : `切换嘉宾（${VIDEO_DIRECTORY.length}）`}
              <span aria-hidden>{directoryOpen ? "−" : "+"}</span>
            </span>
          </button>

          {directoryOpen ? (
            <aside
              id={directoryId}
              ref={directoryRef}
              className="border-t border-[var(--hairline)] pb-4 pt-3"
              aria-label="视频目录，最新对话在前"
            >
              <div className="mb-3 flex items-center justify-between gap-4">
                <p className="text-[13px] text-[var(--muted)]">
                  选择嘉宾，再选择分集
                </p>
                <button
                  type="button"
                  onClick={closeDirectory}
                  className="inline-flex min-h-11 items-center gap-2 px-2 text-[14px] text-[var(--foreground)] hover:text-[var(--brand-teal)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-teal)]/60"
                >
                  关闭 <span aria-hidden>×</span>
                </button>
              </div>
              <ol className="grid gap-3 md:grid-cols-2">
                {VIDEO_DIRECTORY.map((guest) => {
                  const isSelected = guest.id === selectedGuest?.id;
                  const latestEpisode = guest.episodes.at(-1)!;
                  return (
                    <li
                      key={guest.id}
                      className="grid grid-cols-[1fr_3rem] border border-[var(--hairline)]"
                    >
                      <button
                        type="button"
                        onClick={() => selectGuest(guest.id)}
                        aria-pressed={isSelected}
                        className={`grid min-h-24 grid-cols-[5rem_1fr] items-center gap-3 p-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--brand-teal)] md:grid-cols-[6rem_1fr] ${
                          isSelected
                            ? "bg-white text-[#08090d]"
                            : "text-white hover:bg-white/8"
                        }`}
                      >
                        <span className="relative block aspect-video overflow-hidden bg-white/8">
                          <Image
                            src={latestEpisode.coverPic}
                            alt=""
                            fill
                            sizes="(max-width: 768px) 80px, 96px"
                            className="object-cover"
                          />
                        </span>
                        <span className="min-w-0">
                          <span className="block text-[16px] font-medium">
                            {guest.nameZh}
                            {isSelected ? (
                              <span className="ml-2 text-[12px] font-normal text-[#141cff]">
                                当前
                              </span>
                            ) : null}
                          </span>
                          <span
                            className={`mt-1 block text-[12px] ${isSelected ? "text-[#08090d]/65" : "text-white/60"}`}
                          >
                            {guest.nameEn} · {guest.episodes.length} 期
                          </span>
                        </span>
                      </button>
                      <a
                        href={bilibiliWatchUrl(latestEpisode.bvid)}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`直接在 B 站观看：${guest.nameZh}`}
                        className="inline-flex items-center justify-center border-l border-[var(--hairline)] text-[var(--brand-teal)] transition-colors hover:bg-white/8 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--brand-teal)]"
                      >
                        <span aria-hidden>↗</span>
                      </a>
                    </li>
                  );
                })}
              </ol>
            </aside>
          ) : null}
        </div>

        <div className="mt-7 grid gap-7 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-8">
            {selectedGuest ? (
              <HomeVideoPlayer
                key={selectedGuest.id}
                guestName={selectedGuest.nameZh}
                episodes={selectedGuest.episodes}
              />
            ) : null}
          </div>
          {selectedGuest ? (
            <aside className="border-t border-[var(--hairline)] pt-6 lg:col-span-4 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-1">
              <p className="sg-ed-kicker">本期嘉宾</p>
              <h3 className="mt-3 font-[family-name:var(--font-zh)] text-[1.5rem] font-medium text-[var(--foreground)]">
                {selectedGuest.nameZh}
                <span className="ml-3 text-[14px] font-normal text-[var(--muted)]">
                  {selectedGuest.nameEn}
                </span>
              </h3>
              <p className="mt-4 font-[family-name:var(--font-zh)] text-[15px] leading-[1.8] text-[var(--muted-strong)]">
                {selectedGuest.duringCaptionZh}
              </p>
            </aside>
          ) : null}
        </div>
      </div>
    </section>
  );
}
