"use client";

import { BilibiliEmbedPlayer } from "@/components/bilibili-embed-player";
import { BilibiliEpisodeCover } from "@/components/bilibili-episode-cover";
import {
  bilibiliWatchUrl,
  buildBilibiliPlayerSrc,
  prefetchBilibiliPlayerDocument,
} from "@/lib/bilibili-player";
import {
  BILIBILI_SPACE_URL,
  getDefaultEpisode,
  getOriginEpisode,
  SURFING_FOUNDERS_SEASON_01,
  type SurfingFoundersEpisode,
  type SurfingFoundersGuest,
} from "@/lib/surfing-founders-video-season";
import {
  useFounderPanelPrefetch,
  useFounderPanelVisible,
} from "@/lib/use-founder-panel-visible";
import Image from "next/image";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type MutableRefObject,
  type RefObject,
  type WheelEvent as ReactWheelEvent,
} from "react";

const ROSTER_SCROLL_EDGE = 10;

function useScrollEdgeHints(
  scrollRef: RefObject<HTMLElement | null>,
  rerenderKey = "",
) {
  const [hints, setHints] = useState({ top: false, bottom: false });

  const sync = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const canScroll = el.scrollHeight > el.clientHeight + 2;
    setHints({
      top: canScroll && el.scrollTop > ROSTER_SCROLL_EDGE,
      bottom:
        canScroll &&
        el.scrollTop + el.clientHeight < el.scrollHeight - ROSTER_SCROLL_EDGE,
    });
  }, [scrollRef]);

  useEffect(() => {
    sync();
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", sync, { passive: true });
    const ro = new ResizeObserver(sync);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", sync);
      ro.disconnect();
    };
  }, [scrollRef, sync, rerenderKey]);

  return hints;
}

/** 嘉宾名单 — 栏内水平垂直居中，大行距 */
function GuestRoster({
  guests,
  activeId,
  onSelect,
  optionRefs,
}: {
  guests: readonly SurfingFoundersGuest[];
  activeId: string;
  onSelect: (id: string) => void;
  optionRefs: MutableRefObject<Map<string, HTMLButtonElement>>;
}) {
  return (
    <ul
      role="listbox"
      aria-label="本季嘉宾"
      className="flex w-full max-w-[14rem] flex-col items-center gap-6 md:max-w-[16rem] md:gap-8 lg:gap-9"
    >
      {guests.map((g) => {
        const isActive = g.id === activeId;
        const live = !g.comingSoon && g.episodes.length > 0;
        return (
          <li key={g.id} className="w-full">
            <button
              ref={(node) => {
                if (node) optionRefs.current.set(g.id, node);
                else optionRefs.current.delete(g.id);
              }}
              type="button"
              role="option"
              aria-selected={isActive}
              disabled={!live && !isActive}
              onClick={() => live && onSelect(g.id)}
              className={`group flex w-full flex-col items-center justify-center py-1 text-center transition-[color,opacity,transform] duration-300 md:py-1.5 ${
                !live && !isActive ? "cursor-not-allowed opacity-50" : ""
              } ${live && !isActive ? "hover:opacity-90" : ""}`}
            >
              <span
                className={`font-[family-name:var(--font-zh)] leading-snug transition-[font-size,font-weight,color] duration-300 ${
                  isActive
                    ? "editorial-serif text-[clamp(1.65rem,3vw,2.35rem)] text-[var(--foreground)]"
                    : live
                      ? "text-[clamp(1.1rem,1.85vw,1.45rem)] font-normal text-[var(--muted-soft)] group-hover:text-[var(--muted-strong)]"
                      : "text-[clamp(1rem,1.6vw,1.25rem)] font-light tracking-[0.04em] text-[var(--muted-soft)]"
                }`}
              >
                {g.comingSoon ? "待公布" : g.nameZh}
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
        className={`editorial-mono-tabular text-[12px] md:text-[13px] ${
          active ? "text-[var(--brand-teal)]" : "text-[var(--muted)]"
        }`}
      >
        {episode.volLabel}
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
  const rosterScrollRef = useRef<HTMLDivElement>(null);
  const rosterOptionRefs = useRef(new Map<string, HTMLButtonElement>());
  const panelVisible = useFounderPanelVisible(rootRef);
  const panelPrefetch = useFounderPanelPrefetch(rootRef);
  const shouldMountPlayer = panelVisible || panelPrefetch;
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

  const rosterScrollHints = useScrollEdgeHints(
    rosterScrollRef,
    `${guest.id}:${season.guests.length}`,
  );

  const handleRosterWheel = useCallback((e: ReactWheelEvent<HTMLElement>) => {
    const el = rosterScrollRef.current;
    if (!el) return;

    const { scrollTop, scrollHeight, clientHeight } = el;
    if (scrollHeight <= clientHeight + 1) return;

    const delta = e.deltaY;
    const atTop = scrollTop <= 0;
    const atBottom = scrollTop + clientHeight >= scrollHeight - 1;

    if ((delta < 0 && atTop) || (delta > 0 && atBottom)) return;

    e.preventDefault();
    e.stopPropagation();
    el.scrollBy({ top: delta, behavior: "auto" });
  }, []);

  useEffect(() => {
    const btn = rosterOptionRefs.current.get(guest.id);
    const list = rosterScrollRef.current;
    if (!btn || !list) return;
    btn.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [guest.id]);

  useEffect(() => {
    if (!panelPrefetch) return;
    const episodes = new Set<SurfingFoundersEpisode>();
    if (activeEpisode) episodes.add(activeEpisode);
    const def = getDefaultEpisode(guest);
    if (def) episodes.add(def);
    for (const ep of episodes) {
      prefetchBilibiliPlayerDocument(
        buildBilibiliPlayerSrc(ep.bvid, {
          aid: ep.aid,
          cid: ep.cid,
          autoplay: false,
          danmaku: false,
          highQuality: true,
        }),
      );
    }
  }, [panelPrefetch, guest, activeEpisode]);

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
            {/* 人像主体：60-70% 容器宽，居中，aspect-[3/4] portrait；保留原色，仅轻微 tune */}
            <div className="relative flex flex-1 items-center justify-center px-5 py-6 md:px-8 md:py-8 lg:px-10 lg:py-10">
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

            <div className="px-5 pb-6 md:px-8 md:pb-8 lg:px-9 lg:pb-9">
              <p className="editorial-serif text-[clamp(1.75rem,3.2vw,2.5rem)] leading-[1.02] text-[var(--foreground)]">
                {guest.nameZh}
              </p>
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
            <div className="pointer-events-none absolute inset-x-0 bottom-0 px-5 py-6 md:px-8 md:py-7 lg:px-9 lg:py-8">
              <p className="editorial-serif text-[clamp(1.5rem,3vw,2.2rem)] leading-[1.02] text-[rgba(255,255,255,0.96)] [text-shadow:0_2px_8px_rgba(0,0,0,0.55)]">
                {guest.nameZh}
              </p>
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

      {/* 中：嘉宾名单 — 栏内居中，滚轮独立滚动 */}
      <div className="flex min-h-[28svh] flex-col border-t border-b border-[var(--hairline)] lg:col-span-3 lg:min-h-0 lg:border-t-0 lg:border-b-0 lg:border-x">
        <div
          className="sg-guest-roster-scroll-wrap relative flex min-h-0 flex-1 flex-col"
          data-can-scroll-top={rosterScrollHints.top ? "" : undefined}
          data-can-scroll-bottom={rosterScrollHints.bottom ? "" : undefined}
          data-lenis-prevent-wheel
          onWheel={handleRosterWheel}
        >
          <div
            ref={rosterScrollRef}
            className="sg-guest-roster-scroll min-h-0 flex-1 overflow-y-auto overscroll-y-contain"
            onWheel={handleRosterWheel}
          >
            <div className="flex min-h-full flex-col items-center justify-center px-5 py-10 md:px-8 md:py-12 lg:px-6 lg:py-14 xl:px-8">
              <GuestRoster
                guests={season.guests}
                activeId={guest.id}
                onSelect={selectGuest}
                optionRefs={rosterOptionRefs}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 右：player + episode meta + 4 期 chip */}
      <div className="flex flex-col gap-4 bg-[var(--paper-1)] px-5 py-6 md:px-8 md:py-8 lg:col-span-5 lg:px-9 lg:py-10 xl:px-12">
        <p className="line-clamp-2 editorial-serif text-[clamp(1.2rem,1.9vw,1.65rem)] leading-[1.18] text-[var(--foreground)]">
          {activeEpisode?.titleZh ?? guest.nameZh}
        </p>

        {/* 大画幅播放器 — group 容器，hover 显示「在 B 站打开」遮罩兜底 */}
        <div className="min-h-0 flex-1">
          {activeEpisode?.bvid ? (
            <div className="group/player relative">
              {shouldMountPlayer ? (
                <BilibiliEmbedPlayer
                  bvid={activeEpisode.bvid}
                  aid={activeEpisode.aid}
                  cid={activeEpisode.cid}
                  title={playerTitle}
                  mode="eager"
                  aspectClassName="aspect-video"
                />
              ) : (
                <div className="relative aspect-video w-full overflow-hidden rounded-md border border-[var(--hairline)] bg-[rgba(15,17,22,0.55)]">
                  <BilibiliEpisodeCover
                    bvid={activeEpisode.bvid}
                    alt={playerTitle}
                    className="absolute inset-0"
                  />
                </div>
              )}
            </div>
          ) : (
            <div className="flex aspect-video w-full items-center justify-center rounded-md border border-dashed border-[var(--hairline)] bg-[rgba(15,17,22,0.45)]">
              <p className="font-[family-name:var(--font-zh)] text-sm text-[var(--muted)]">
                待上线
              </p>
            </div>
          )}
        </div>

        {activeEpisode ? (
          <a
            href={bilibiliWatchUrl(activeEpisode.bvid)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-fit font-[family-name:var(--font-zh)] text-[15px] text-[var(--brand-teal)] underline decoration-[var(--brand-teal)]/35 underline-offset-[5px] transition-colors hover:text-[var(--foreground)] md:text-[16px]"
          >
            在 B 站打开 ↗
          </a>
        ) : null}

        {guest.episodes.length > 0 ? (
          <div className="flex flex-col gap-3">
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
          className="mt-auto inline-flex w-fit font-[family-name:var(--font-zh)] text-[14px] text-[var(--muted-strong)] transition-colors hover:text-[var(--brand-teal)] md:text-[15px]"
        >
          B 站空间 ↗
        </a>
      </div>
    </div>
  );
}
