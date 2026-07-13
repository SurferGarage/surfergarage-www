"use client";

import { BilibiliEmbedPlayer } from "@/components/bilibili-embed-player";
import { BilibiliEpisodeCover } from "@/components/bilibili-episode-cover";
import Image from "next/image";
import { SgScrollRail } from "@/components/sg-scroll-rail";
import { useScrollRailMetrics } from "@/lib/use-scroll-rail-metrics";
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
  episodeCoverFocus,
  type SurfingFoundersEpisode,
  type SurfingFoundersGuest,
} from "@/lib/surfing-founders-video-season";
import {
  useFounderPanelGate,
} from "@/lib/use-founder-panel-visible";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type MutableRefObject,
} from "react";

/** 列布局由 globals `.sg-video-studio-col` 控制（移动 flex / 桌面 subgrid），勿加 Tailwind `flex` 以免盖掉 grid */
const STUDIO_COL = "sg-video-studio-col h-full min-h-0";
const STUDIO_BAND_TOP =
  "sg-video-studio-band-top shrink-0 border-b border-[var(--hairline)] px-6 pb-4 pt-5 lg:px-7 lg:pt-6";
const STUDIO_BAND_BOTTOM =
  "sg-video-studio-band-bottom shrink-0 border-t border-[var(--hairline)] px-6 py-4 lg:px-7";
const STUDIO_STAGE = "sg-video-studio-stage relative min-h-0";
const STAGE_INNER = "sg-video-studio-stage-inner";

const bandEyebrow =
  "editorial-eyebrow font-[family-name:var(--font-zh)] text-[11px] text-[var(--muted)] md:text-[12px]";

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
      className="flex w-full flex-col gap-1"
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
              className={`sg-video-roster-option group relative flex w-full items-center justify-center rounded-sm px-4 py-3 text-center transition-[color,background-color,opacity] duration-300 md:py-3.5 ${
                !live && !isActive ? "cursor-not-allowed opacity-45" : ""
              } ${live && !isActive ? "hover:bg-[color-mix(in_oklch,var(--paper-3)_50%,transparent)]" : ""}`}
            >
              <span
                className={`font-[family-name:var(--font-zh)] leading-snug transition-[font-size,color] duration-300 ${
                  isActive
                    ? "editorial-serif text-[clamp(1.45rem,2.4vw,2rem)] text-[var(--foreground)]"
                    : live
                      ? "text-[clamp(1rem,1.65vw,1.3rem)] text-[var(--muted-soft)] group-hover:text-[var(--muted-strong)]"
                      : "text-[clamp(0.95rem,1.5vw,1.15rem)] font-light tracking-[0.06em] text-[var(--muted-soft)]"
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
      className={`flex w-full flex-col items-start gap-0.5 rounded-sm border px-3 py-2.5 text-left transition-[border-color,background-color,color] duration-200 ${
        active
          ? "border-[var(--brand-teal)]/55 bg-[color-mix(in_oklch,var(--brand-teal)_12%,transparent)]"
          : "border-[var(--hairline)] bg-[color-mix(in_oklch,var(--paper-3)_40%,transparent)] hover:border-[var(--hairline-strong)]"
      }`}
    >
      <span
        className={`editorial-mono-tabular text-[11px] md:text-[12px] ${
          active ? "text-[var(--brand-teal)]" : "text-[var(--muted)]"
        }`}
      >
        {episode.volLabel}
      </span>
    </button>
  );
}

/**
 * 视频播客 · 三栏展台（顶/主/底对齐）：
 * 左封面 · 中嘉宾 · 右播放器，统一 gutter 与 band 高度。
 */
export function FounderVideoStudio() {
  const rootRef = useRef<HTMLDivElement>(null);
  const rosterScrollRef = useRef<HTMLDivElement>(null);
  const rosterOptionRefs = useRef(new Map<string, HTMLButtonElement>());
  const { visible: panelVisible, prefetch: panelPrefetch } =
    useFounderPanelGate(rootRef);
  /** 仅视口内挂载 iframe；prefetch 只预取 player 文档，避免半屏外就拉 B 站播放器占内存 */
  const shouldMountPlayer = panelVisible;
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
  const coverEpisode = activeEpisode ?? originEpisode;
  const coverFocus = coverEpisode ? episodeCoverFocus(coverEpisode) : "center";

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

  const rosterScroll = useScrollRailMetrics(
    rosterScrollRef,
    `${guest.id}:${season.guests.length}`,
  );

  useEffect(() => {
    const el = rosterScrollRef.current;
    if (!el) return;

    const wrap = el.closest<HTMLElement>(".sg-guest-roster-scroll-wrap");
    const targets = wrap ? [el, wrap] : [el];

    const onWheel = (e: WheelEvent) => {
      const { scrollTop, scrollHeight, clientHeight } = el;
      if (scrollHeight <= clientHeight + 1) return;

      const delta = e.deltaY;
      const atTop = scrollTop <= 0;
      const atBottom = scrollTop + clientHeight >= scrollHeight - 1;

      if ((delta < 0 && atTop) || (delta > 0 && atBottom)) return;

      e.preventDefault();
      e.stopPropagation();
      el.scrollBy({ top: delta, behavior: "auto" });
    };

    const opts: AddEventListenerOptions = { passive: false, capture: true };
    for (const node of targets) {
      node.addEventListener("wheel", onWheel, opts);
    }
    return () => {
      for (const node of targets) {
        node.removeEventListener("wheel", onWheel, opts);
      }
    };
  }, [season.guests.length]);

  useEffect(() => {
    const btn = rosterOptionRefs.current.get(guest.id);
    const list = rosterScrollRef.current;
    if (!btn || !list) return;
    btn.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [guest.id]);

  useEffect(() => {
    if (!panelPrefetch) return;
    const cancels: Array<() => void> = [];
    const episodes = new Set<SurfingFoundersEpisode>();
    if (activeEpisode) episodes.add(activeEpisode);
    const def = getDefaultEpisode(guest);
    if (def) episodes.add(def);
    for (const ep of episodes) {
      cancels.push(
        prefetchBilibiliPlayerDocument(
          buildBilibiliPlayerSrc(ep.bvid, {
            aid: ep.aid,
            cid: ep.cid,
            autoplay: false,
            danmaku: false,
            highQuality: true,
          }),
        ),
      );
    }
    return () => {
      cancels.forEach((cancel) => cancel());
    };
  }, [panelPrefetch, guest, activeEpisode]);

  return (
    <div
      ref={rootRef}
      className="sg-video-studio grid h-full min-h-0 w-full grid-cols-1 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.72fr)_minmax(0,1.23fr)]"
      data-surfing-founders-video
      aria-label="浪前视频播客"
    >
      {/* —— 左 · 封面 —— */}
      <div
        className={`${STUDIO_COL} bg-[var(--paper-1)] lg:border-r lg:border-[var(--hairline)]`}
      >
        <header className={STUDIO_BAND_TOP}>
          <p className={bandEyebrow}>出版集</p>
          <p className="editorial-mono-tabular text-[13px] text-[var(--brand-teal)] md:text-[14px]">
            {coverEpisode?.volLabel ?? "—"}
          </p>
        </header>

        <div className={`${STUDIO_STAGE} min-h-[28svh] lg:min-h-0`}>
          <div className={STAGE_INNER}>
            {coverEpisode ? (
              <div
                className="sg-video-media-frame sg-video-studio-cover-frame"
                data-cover-focus={coverFocus}
              >
                <Image
                  key={coverEpisode.id}
                  src={coverEpisode.coverPic}
                  alt={`${guest.nameEn} · ${coverEpisode.titleZh}`}
                  fill
                  priority={panelVisible}
                  sizes="(max-width: 1024px) 100vw, 36vw"
                  className="object-contain"
                />
              </div>
            ) : (
              <div className="flex min-h-[16rem] flex-1 items-center justify-center rounded-sm border border-dashed border-[var(--hairline)] bg-[color-mix(in_oklch,var(--paper-3)_35%,transparent)]">
                <p className="font-[family-name:var(--font-zh)] text-sm text-[var(--muted)]">
                  席位待公布
                </p>
              </div>
            )}
          </div>
        </div>

        <footer className={STUDIO_BAND_BOTTOM}>
          <p className="editorial-serif text-[clamp(1.35rem,2.2vw,1.85rem)] leading-[1.05] text-[var(--foreground)]">
            {guest.nameZh}
          </p>
          <p className="mt-1 font-[family-name:var(--font-en)] text-[12px] tracking-[0.08em] text-[var(--muted)] uppercase">
            {guest.nameEn}
          </p>
        </footer>
      </div>

      {/* —— 中 · 嘉宾 —— */}
      <div
        className={`${STUDIO_COL} bg-[var(--paper-1)] lg:border-r lg:border-[var(--hairline)]`}
      >
        <header className={STUDIO_BAND_TOP}>
          <p className={bandEyebrow}>工作台嘉宾</p>
          <p className="editorial-mono-tabular text-[13px] text-[var(--foreground)] md:text-[14px]">
            {String(liveGuests.length).padStart(2, "0")} / {String(season.guests.length).padStart(2, "0")}
          </p>
        </header>

        <div
          className={`${STUDIO_STAGE} sg-guest-roster-scroll-wrap relative min-h-[18rem] lg:min-h-0`}
          data-can-scroll-top={rosterScroll.edgeTop ? "" : undefined}
          data-can-scroll-bottom={rosterScroll.edgeBottom ? "" : undefined}
          data-lenis-prevent
        >
          <div className={`${STAGE_INNER} sg-video-studio-stage-inner--roster`}>
          <div className="sg-scroll-rail-host relative mx-auto h-full min-h-0 w-full max-w-[15.5rem] lg:max-w-none">
            <div
              ref={rosterScrollRef}
              tabIndex={0}
              role="region"
              aria-label="本季嘉宾名单，滚轮可滚动"
              className="sg-guest-roster-scroll sg-scroll-rail-viewport h-full max-h-[min(40svh,22rem)] min-h-0 overflow-y-auto overscroll-y-contain outline-none focus-visible:ring-2 focus-visible:ring-[color-mix(in_oklch,var(--brand-teal)_45%,transparent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--paper-1)] lg:max-h-none"
            >
              <div className="py-4 lg:py-5">
                <GuestRoster
                  guests={season.guests}
                  activeId={guest.id}
                  onSelect={selectGuest}
                  optionRefs={rosterOptionRefs}
                />
              </div>
            </div>
            <SgScrollRail
              scrollRef={rosterScrollRef}
              measureKey={`${guest.id}:${season.guests.length}`}
              metrics={rosterScroll}
            />
          </div>
          </div>
        </div>

        <footer className={STUDIO_BAND_BOTTOM}>
          <p className="font-[family-name:var(--font-zh)] text-[12px] text-[var(--muted)] md:text-[13px]">
            {season.seasonLabel} · 嘉宾浏览名单
          </p>
        </footer>
      </div>

      {/* —— 右 · 播放 —— */}
      <div className={`${STUDIO_COL} bg-[var(--paper-1)]`}>
        <header className={STUDIO_BAND_TOP}>
          <p className={bandEyebrow}>正在播放</p>
          <p className="line-clamp-2 font-[family-name:var(--font-zh)] text-[clamp(0.95rem,1.55vw,1.2rem)] font-medium leading-snug text-[var(--foreground)]">
            {activeEpisode?.titleZh ?? guest.nameZh}
          </p>
        </header>

        <div className={STUDIO_STAGE}>
          <div className={`${STAGE_INNER} justify-center`}>
          {activeEpisode?.bvid ? (
            <div className="sg-video-media-frame sg-video-player-frame group/player relative w-full shrink-0 overflow-hidden">
              {shouldMountPlayer ? (
                <BilibiliEmbedPlayer
                  bvid={activeEpisode.bvid}
                  aid={activeEpisode.aid}
                  cid={activeEpisode.cid}
                  title={playerTitle}
                  mode="eager"
                  posterSrc={activeEpisode.coverPic}
                  aspectClassName="aspect-video"
                />
              ) : (
                <div className="relative aspect-video w-full">
                  <BilibiliEpisodeCover
                    bvid={activeEpisode.bvid}
                    coverSrc={activeEpisode.coverPic}
                    alt={playerTitle}
                    className="absolute inset-0"
                  />
                </div>
              )}
            </div>
          ) : (
            <div className="flex aspect-video w-full items-center justify-center rounded-sm border border-dashed border-[var(--hairline)] bg-[color-mix(in_oklch,var(--paper-3)_35%,transparent)]">
              <p className="font-[family-name:var(--font-zh)] text-sm text-[var(--muted)]">
                待上线
              </p>
            </div>
          )}
          </div>
        </div>

        <footer className={`${STUDIO_BAND_BOTTOM} gap-3`}>
          {activeEpisode ? (
            <a
              href={bilibiliWatchUrl(activeEpisode.bvid)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-fit font-[family-name:var(--font-zh)] text-[14px] text-[var(--brand-teal)] underline decoration-[var(--brand-teal)]/35 underline-offset-[5px] transition-colors hover:text-[var(--foreground)] md:text-[15px]"
            >
              在 B 站打开 ↗
            </a>
          ) : null}

          {guest.episodes.length > 0 ? (
            <ul className="grid w-full grid-cols-2 gap-2 sm:grid-cols-4">
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
          ) : null}

          <a
            href={BILIBILI_SPACE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-fit font-[family-name:var(--font-zh)] text-[13px] text-[var(--muted-strong)] transition-colors hover:text-[var(--brand-teal)] md:text-[14px]"
          >
            B 站空间 ↗
          </a>
        </footer>
      </div>
    </div>
  );
}
