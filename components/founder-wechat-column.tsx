"use client";

import { SgScrollRail } from "@/components/sg-scroll-rail";
import { useScrollRailMetrics } from "@/lib/use-scroll-rail-metrics";
import {
  DEFAULT_WECHAT_FEED_ID,
  WECHAT_OFFICIAL_FEED,
} from "@/lib/wechat-official-feed";
import { SG_INLINE_LINK_CLASS } from "@/lib/sg-layout";
import { useReducedMotion } from "@/lib/sg-reduced-motion";
import Image from "next/image";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent as ReactPointerEvent,
  type WheelEvent as ReactWheelEvent,
} from "react";

const SWIPE_THRESHOLD_PX = 52;

/**
 * Founders Block A · 微信专栏
 * 左栏列表 + 右栏封面；滑动/方向键切换篇目，点击封面打开微信原文。
 */
export function FounderWechatColumn() {
  const items = WECHAT_OFFICIAL_FEED;
  const [activeId, setActiveId] = useState(DEFAULT_WECHAT_FEED_ID);
  const [slideDir, setSlideDir] = useState<1 | -1>(1);
  const [coverAnim, setCoverAnim] = useState(true);
  const active = items.find((i) => i.id === activeId) ?? items[0]!;
  const activeIndex = items.indexOf(active);

  const listRef = useRef<HTMLUListElement>(null);
  const optionRefs = useRef<Map<string, HTMLButtonElement>>(new Map());
  const coverStageRef = useRef<HTMLDivElement>(null);
  const coverFadeTimer = useRef<number | null>(null);
  const pointerStart = useRef<{ x: number; y: number } | null>(null);
  const didSwipe = useRef(false);

  const reduced = useReducedMotion();
  const listScroll = useScrollRailMetrics(listRef, activeId);
  const scrollBehavior = reduced ? "auto" : "smooth";

  const goByDelta = useCallback(
    (delta: number) => {
      const idx = items.findIndex((i) => i.id === activeId);
      if (idx < 0) return;
      const nextIdx = Math.min(Math.max(idx + delta, 0), items.length - 1);
      if (nextIdx === idx) return;
      const dir = delta > 0 ? 1 : -1;
      setSlideDir(dir);

      if (coverFadeTimer.current) clearTimeout(coverFadeTimer.current);

      if (reduced) {
        setActiveId(items[nextIdx]!.id);
        setCoverAnim(true);
        return;
      }

      setCoverAnim(false);
      coverFadeTimer.current = window.setTimeout(() => {
        setActiveId(items[nextIdx]!.id);
        requestAnimationFrame(() => setCoverAnim(true));
        coverFadeTimer.current = null;
      }, 160);
    },
    [activeId, items, reduced],
  );

  const selectVol = useCallback(
    (id: string) => {
      const idx = items.findIndex((i) => i.id === id);
      const cur = items.findIndex((i) => i.id === activeId);
      if (idx < 0 || id === activeId) return;

      setSlideDir(idx > cur ? 1 : -1);

      if (coverFadeTimer.current) clearTimeout(coverFadeTimer.current);

      if (reduced) {
        setActiveId(id);
        setCoverAnim(true);
        return;
      }

      setCoverAnim(false);
      coverFadeTimer.current = window.setTimeout(() => {
        setActiveId(id);
        requestAnimationFrame(() => setCoverAnim(true));
        coverFadeTimer.current = null;
      }, 160);
    },
    [activeId, items, reduced],
  );

  useEffect(
    () => () => {
      if (coverFadeTimer.current) clearTimeout(coverFadeTimer.current);
    },
    [],
  );

  useEffect(() => {
    const btn = optionRefs.current.get(activeId);
    const list = listRef.current;
    if (!btn || !list) return;
    btn.scrollIntoView({ block: "nearest", behavior: scrollBehavior });
  }, [activeId, scrollBehavior]);

  const openActiveArticle = useCallback(() => {
    window.open(active.href, "_blank", "noopener,noreferrer");
  }, [active.href]);

  const handleListWheel = useCallback((e: ReactWheelEvent<HTMLElement>) => {
    const el = listRef.current;
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

  const onCoverPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    pointerStart.current = { x: e.clientX, y: e.clientY };
    didSwipe.current = false;
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onCoverPointerUp = (e: ReactPointerEvent<HTMLDivElement>) => {
    const start = pointerStart.current;
    pointerStart.current = null;
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
    if (!start) return;

    const dx = e.clientX - start.x;
    const dy = e.clientY - start.y;

    if (
      Math.abs(dx) >= SWIPE_THRESHOLD_PX &&
      Math.abs(dx) > Math.abs(dy) * 1.15
    ) {
      didSwipe.current = true;
      goByDelta(dx < 0 ? 1 : -1);
    }
  };

  const onCoverClick = () => {
    if (didSwipe.current) {
      didSwipe.current = false;
      return;
    }
    openActiveArticle();
  };

  const onCoverKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      goByDelta(-1);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      goByDelta(1);
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openActiveArticle();
    }
  };

  const onListKeyDown = (e: KeyboardEvent<HTMLUListElement>) => {
    const idx = items.findIndex((i) => i.id === activeId);
    if (idx < 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      goByDelta(1);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      goByDelta(-1);
    } else if (e.key === "Home") {
      e.preventDefault();
      selectVol(items[0]!.id);
    } else if (e.key === "End") {
      e.preventDefault();
      selectVol(items[items.length - 1]!.id);
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openActiveArticle();
    }
  };

  const coverSlideClass =
    slideDir === 1 ? "sg-wechat-cover-slide-next" : "sg-wechat-cover-slide-prev";

  return (
    <div
      className="grid h-full w-full grid-cols-1 lg:grid-cols-12"
      data-founders-intro
    >
      {/* 左栏 */}
      <div className="sg-wechat-vol-panel relative order-2 flex flex-col gap-4 px-5 py-6 md:px-10 md:py-8 lg:order-1 lg:col-span-6 lg:gap-5 lg:px-14 lg:py-10 xl:px-20">
        <div
          className="sg-wechat-vol-scroll-wrap relative w-full"
          data-can-scroll-top={listScroll.edgeTop ? "" : undefined}
          data-can-scroll-bottom={listScroll.edgeBottom ? "" : undefined}
          onWheel={handleListWheel}
        >
          <div
            className="sg-scroll-rail-host sg-wechat-vol-viewport-box relative w-full max-h-[min(38svh,20rem)] lg:max-h-[min(32svh,17.5rem)] xl:max-h-[min(36svh,19rem)]"
          >
            <ul
              ref={listRef}
              role="listbox"
              aria-label="微信专栏文章列表"
              aria-activedescendant={`wechat-vol-option-${activeId}`}
              tabIndex={0}
              onKeyDown={onListKeyDown}
              onWheel={handleListWheel}
              className="sg-wechat-vol-scroll sg-wechat-vol-listbox sg-scroll-rail-viewport flex max-h-[inherit] flex-col gap-0.5 overflow-y-auto overscroll-y-contain py-1 pr-2.5 outline-none"
            >
            {items.map((item, i) => {
              const isActive = item.id === active.id;
              return (
                <li key={item.id}>
                  <button
                    ref={(node) => {
                      if (node) optionRefs.current.set(item.id, node);
                      else optionRefs.current.delete(item.id);
                    }}
                    id={`wechat-vol-option-${item.id}`}
                    type="button"
                    role="option"
                    aria-selected={isActive}
                    tabIndex={-1}
                    onMouseDown={(e) => {
                      e.preventDefault();
                    }}
                    onClick={() => {
                      selectVol(item.id);
                      listRef.current?.focus({ preventScroll: true });
                    }}
                    className={`sg-wechat-vol-option group flex min-h-12 w-full items-baseline gap-4 rounded-sm py-3 pl-3 pr-2 text-left transition-[background-color,color,transform] duration-300 ease-out md:min-h-[3.25rem] md:py-3.5 ${
                      isActive
                        ? "bg-[color-mix(in_oklch,var(--brand-teal)_14%,transparent)]"
                        : "hover:bg-[color-mix(in_oklch,var(--paper-3)_55%,transparent)]"
                    }`}
                  >
                    <span
                      className={`editorial-mono-tabular w-14 shrink-0 text-[12px] transition-colors duration-300 md:text-[13px] ${
                        isActive
                          ? "text-[var(--brand-teal)]"
                          : "text-[var(--muted-soft)] group-hover:text-[var(--muted)]"
                      }`}
                    >
                      Vol.{String(i + 1).padStart(2, "0")}
                    </span>
                    <span
                      className={`line-clamp-2 flex-1 font-[family-name:var(--font-zh)] leading-snug transition-[color,font-weight,opacity,transform] duration-300 lg:line-clamp-1 ${
                        isActive
                          ? "translate-x-0 text-[clamp(1.05rem,1.6vw,1.25rem)] font-medium text-[var(--foreground)]"
                          : "text-[14px] font-light text-[var(--muted-soft)] group-hover:translate-x-0.5 group-hover:text-[var(--muted-strong)] md:text-[15px]"
                      }`}
                      title={item.titleZh}
                    >
                      {item.titleZh}
                    </span>
                  </button>
                </li>
              );
            })}
            </ul>
            <SgScrollRail
              scrollRef={listRef}
              measureKey={`${items.length}:${activeId}`}
              metrics={listScroll}
            />
          </div>
        </div>

        <div className="mt-auto shrink-0 border-t border-[var(--hairline)] pt-5">
          <a
            href={active.href}
            target="_blank"
            rel="noopener noreferrer"
            className={`sg-inline-link ${SG_INLINE_LINK_CLASS} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-teal)]/45 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--paper-1)]`}
            aria-label={`阅读第 ${activeIndex + 1} 篇全文（新窗口）`}
          >
            阅读全文 ↗
          </a>
        </div>
      </div>

      {/* 右栏：滑动切换 + 点击打开 */}
      <div
        ref={coverStageRef}
        role="region"
        aria-roledescription="carousel"
        aria-label="微信专栏封面预览"
        tabIndex={0}
        onKeyDown={onCoverKeyDown}
        onPointerDown={onCoverPointerDown}
        onPointerUp={onCoverPointerUp}
        onPointerCancel={onCoverPointerUp}
        onClick={onCoverClick}
        className="sg-wechat-cover-stage group/cover relative order-1 flex min-h-[36svh] cursor-pointer items-center justify-center overflow-hidden bg-[var(--paper-2)] touch-pan-y focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--brand-teal)]/50 lg:order-2 lg:col-span-6 lg:min-h-0"
      >
        <div
          aria-hidden
          className="absolute inset-0 scale-110"
          style={{ pointerEvents: "none" }}
        >
          <Image
            key={`${active.id}-bg`}
            src={active.imageSrc}
            alt=""
            fill
            sizes="(max-width: 1024px) 100vw, 55vw"
            className={`object-cover object-center blur-3xl saturate-[0.6] transition-opacity duration-500 ease-out ${
              coverAnim ? "opacity-50" : "opacity-20"
            }`}
          />
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              background:
                "color-mix(in oklch, var(--paper-1) 78%, transparent)",
            }}
          />
        </div>

        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-[1] bg-[color-mix(in_oklch,var(--brand-teal)_6%,transparent)] opacity-0 transition-opacity duration-300 group-hover/cover:opacity-100 group-focus-visible/cover:opacity-100"
        />

        <div className="relative z-[2] mx-auto w-full max-w-[min(100%,40rem)] px-5 pt-16 pb-[5.5rem] md:px-8 md:pt-20 md:pb-24 lg:absolute lg:inset-x-8 lg:inset-y-14 lg:max-w-none lg:px-0 lg:pt-16 lg:pb-28 xl:inset-x-12 xl:inset-y-16">
          <div
            key={active.id}
            className={`relative aspect-[1024/571] w-full overflow-hidden rounded-sm bg-[var(--paper-3)] shadow-[inset_0_0_0_1px_var(--hairline-soft)] ${
              coverAnim ? coverSlideClass : "opacity-0"
            }`}
          >
            <Image
              src={active.imageSrc}
              alt=""
              fill
              loading="lazy"
              sizes="(max-width: 1024px) 90vw, 50vw"
              className="object-cover object-center"
            />
          </div>
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[3] bg-gradient-to-t from-[color-mix(in_oklch,var(--paper-1)_92%,transparent)] via-[color-mix(in_oklch,var(--paper-1)_55%,transparent)] to-transparent px-5 pt-12 pb-6 md:px-8 md:pb-7 lg:px-10 lg:py-8">
          <p
            key={active.id}
            className={`line-clamp-3 editorial-serif text-[clamp(1.15rem,2vw,1.5rem)] leading-[1.22] text-[var(--foreground)] ${
              coverAnim ? "sg-wechat-cover-title-in" : "opacity-0"
            }`}
          >
            {active.titleZh}
          </p>
        </div>
      </div>
    </div>
  );
}
