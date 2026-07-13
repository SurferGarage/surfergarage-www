"use client";

import Image from "next/image";
import { useEffect, useId, useRef, useState } from "react";

import { HomeVideoPlayer } from "@/components/home-video-player";
import { bilibiliWatchUrl } from "@/lib/bilibili-player";
import { SG_PAGE_SHELL_CLASS } from "@/lib/sg-layout";
import { SURFING_FOUNDERS_SEASON_01 } from "@/lib/surfing-founders-video-season";

const VIDEO_DIRECTORY = SURFING_FOUNDERS_SEASON_01.guests
  .filter((guest) => !guest.comingSoon && guest.episodes.length > 0)
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

  const selectGuest = (id: string) => {
    setSelectedGuestId(id);
    setDirectoryOpen(false);
    directoryTriggerRef.current?.focus();
  };

  return (
    <section
      id="dialogue"
      className="border-b border-[var(--hairline)] bg-[#07080b] py-20 md:py-28 lg:py-32"
      aria-labelledby="dialogue-section-heading"
    >
      <div className={SG_PAGE_SHELL_CLASS}>
        <header className="grid gap-8 lg:grid-cols-12 lg:items-end lg:gap-12">
          <div className="lg:col-span-8">
            <h2
              id="dialogue-section-heading"
              className="max-w-[54rem] font-[family-name:var(--font-serif-zh)] text-[2.5rem] font-semibold leading-[1.2] text-[var(--foreground)] md:text-[3.75rem] lg:text-[4rem] xl:text-[4.5rem]"
            >
              一场对话，进入
              <br />
              创业进行时。
            </h2>
          </div>
          <div className="relative lg:col-span-4">
            <div className="flex items-center justify-between gap-5 border-b border-[var(--hairline)] pb-4">
              <p className="font-[family-name:var(--font-zh)] text-[14px] text-[var(--accent-amber)] md:text-[15px]">
                视频播客
              </p>
              <button
                ref={directoryTriggerRef}
                type="button"
                aria-expanded={directoryOpen}
                aria-controls={directoryId}
                onClick={() => setDirectoryOpen((open) => !open)}
                className="group inline-flex min-h-11 items-center gap-4 border-l border-[var(--hairline)] pl-5 font-[family-name:var(--font-zh)] text-[14px] font-medium text-[var(--foreground)] transition-colors hover:text-[var(--brand-teal)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-teal)]/60 md:text-[15px]"
              >
                <span>视频目录</span>
                <span className="font-[family-name:var(--font-mono)] text-[10px] text-[var(--muted)] md:text-[11px]">
                  {String(VIDEO_DIRECTORY.length).padStart(2, "0")}
                </span>
                <span
                  aria-hidden
                  className="w-4 text-center font-[family-name:var(--font-en)] text-[18px] font-normal transition-transform duration-200 group-hover:translate-x-0.5"
                >
                  {directoryOpen ? "−" : "+"}
                </span>
              </button>
            </div>

            {directoryOpen ? (
              <aside
                id={directoryId}
                ref={directoryRef}
                data-lenis-prevent
                className="fixed inset-x-5 top-[5rem] z-40 max-h-[calc(100svh-5.5rem)] overflow-y-auto overscroll-contain border border-white/20 bg-[#08090d] text-white shadow-[0_30px_80px_rgba(0,0,0,0.42)] md:left-auto md:right-10 md:w-[min(38rem,84vw)] lg:absolute lg:inset-x-0 lg:left-auto lg:right-0 lg:top-[4.5rem] lg:z-20 lg:max-h-[min(72svh,40rem)]"
                aria-label="视频目录，最新对话在前"
              >
                <div className="sticky top-0 z-10 flex items-end justify-between gap-6 border-b border-white/16 bg-[#08090d]/95 px-5 py-5 backdrop-blur-md md:px-7">
                  <p className="font-[family-name:var(--font-serif-zh)] text-[1.55rem] font-semibold">
                    视频目录
                  </p>
                  <p className="font-[family-name:var(--font-zh)] text-[12px] text-white/58">
                    {VIDEO_DIRECTORY.length} 位嘉宾 · {episodeCount} 期
                  </p>
                </div>
                <ol>
                  {VIDEO_DIRECTORY.map((guest) => {
                    const isSelected = guest.id === selectedGuest?.id;
                    const latestEpisode = guest.episodes.at(-1)!;
                    return (
                      <li
                        key={guest.id}
                        className="grid grid-cols-[1fr_3.25rem] border-b border-white/12 last:border-b-0"
                      >
                        <button
                          type="button"
                          onClick={() => selectGuest(guest.id)}
                          aria-pressed={isSelected}
                          className={`grid min-h-[6.75rem] grid-cols-[4.5rem_1fr] items-center gap-3 px-4 py-4 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white/70 md:grid-cols-[7rem_1fr] md:gap-4 md:px-7 ${
                            isSelected
                              ? "bg-white text-[#08090d]"
                              : "text-white hover:bg-white/8"
                          }`}
                        >
                          <span className="relative block aspect-video overflow-hidden bg-white/8">
                            <Image
                              src={latestEpisode.coverPic}
                              alt={`${guest.nameZh}视频封面`}
                              fill
                              sizes="(max-width: 768px) 72px, 112px"
                              className="object-cover"
                            />
                          </span>
                          <span className="min-w-0">
                            <span
                              className={`block font-[family-name:var(--font-mono)] text-[10px] md:text-[11px] ${
                                isSelected ? "text-[#141cff]" : "text-white/48"
                              }`}
                            >
                              {SURFING_FOUNDERS_SEASON_01.seasonLabel} · {guest.episodes.length} 期
                            </span>
                            <span className="mt-2 block font-[family-name:var(--font-zh)] text-[16px] font-medium leading-[1.4] md:text-[17px]">
                              {guest.nameZh}
                            </span>
                            <span
                              className={`mt-1 block truncate font-[family-name:var(--font-en)] text-[12px] ${
                                isSelected ? "text-[#08090d]/58" : "text-white/52"
                              }`}
                            >
                              {guest.nameEn}
                            </span>
                          </span>
                        </button>
                        <a
                          href={bilibiliWatchUrl(latestEpisode.bvid)}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`直接在 B 站观看：${guest.nameZh}`}
                          className={`inline-flex items-center justify-center border-l transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white/70 ${
                            isSelected
                              ? "border-[#08090d]/12 bg-white text-[#141cff] hover:bg-[#e9eaff]"
                              : "border-white/12 text-white/62 hover:bg-white/8 hover:text-white"
                          }`}
                        >
                          <span aria-hidden>↗</span>
                        </a>
                      </li>
                    );
                  })}
                </ol>
              </aside>
            ) : null}

            <p className="mt-6 max-w-[34rem] font-[family-name:var(--font-zh)] text-[16px] leading-[1.8] text-[var(--muted-strong)] md:text-[17px]">
              我们把摄像机放进真实现场，保留语气、犹豫和尚未被验证的判断。
            </p>
          </div>
        </header>

        <div className="mt-14 grid gap-12 border-t border-[var(--hairline)] pt-10 md:mt-20 md:pt-14 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-8">
            {selectedGuest ? (
              <HomeVideoPlayer
                key={selectedGuest.id}
                guestName={selectedGuest.nameZh}
                episodes={selectedGuest.episodes}
              />
            ) : null}
          </div>

          <aside className="flex flex-col justify-between border-t border-[var(--hairline)] pt-8 lg:col-span-4 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0">
            <div>
              <p className="font-[family-name:var(--font-mono)] text-[10px] uppercase text-[var(--accent-amber)] md:text-[11px]">
                视频播客 · 浪前对话
              </p>
              <h3 className="mt-5 font-[family-name:var(--font-zh)] text-[1.65rem] font-medium leading-[1.45] text-[var(--foreground)] md:text-[2rem]">
                不急着复盘结果，先看判断如何形成。
              </h3>
              <p className="mt-6 font-[family-name:var(--font-zh)] text-[15px] leading-[1.8] text-[var(--muted-strong)] md:text-[16px]">
                与年轻创始人和产品创造者展开长对谈。这里没有标准答案，现场本身就是内容。
              </p>
            </div>

            <dl className="mt-12 border-t border-[var(--hairline)] font-[family-name:var(--font-mono)] text-[10px] uppercase md:text-[11px] lg:mt-16">
              {[
                ["当前嘉宾", selectedGuest?.nameZh ?? "待公布"],
                ["当前季度", "第一季"],
                ["内容形式", "长视频对谈"],
                ["观看平台", "哔哩哔哩"],
              ].map(([term, value]) => (
                <div
                  key={term}
                  className="flex items-center justify-between gap-6 border-b border-[var(--hairline-soft)] py-4"
                >
                  <dt className="text-[var(--muted)]">{term}</dt>
                  <dd className="text-right text-[var(--foreground)]">{value}</dd>
                </div>
              ))}
            </dl>
          </aside>
        </div>
      </div>
    </section>
  );
}
