"use client";

import { useCallback, useEffect, useState, type RefObject } from "react";

export type ScrollRailMetrics = {
  canScroll: boolean;
  /** 0–1，thumb 顶部在轨道内的相对位置 */
  thumbOffset: number;
  /** 0–1，thumb 高度占轨道比例 */
  thumbSize: number;
};

const EMPTY: ScrollRailMetrics = {
  canScroll: false,
  thumbOffset: 0,
  thumbSize: 1,
};

function measureScrollRail(el: HTMLElement): ScrollRailMetrics {
  const { scrollHeight, clientHeight, scrollTop } = el;
  if (scrollHeight <= clientHeight + 1) return EMPTY;

  const ratio = clientHeight / scrollHeight;
  /* 可滚余量极小则不显示轨，避免「几乎满条」的误导 */
  if (ratio > 0.9) return EMPTY;

  const thumbSize = Math.min(1, Math.max(0.08, ratio));
  const maxOffset = 1 - thumbSize;
  const scrollRange = scrollHeight - clientHeight;
  const thumbOffset =
    scrollRange > 0 ? (scrollTop / scrollRange) * maxOffset : 0;

  return { canScroll: true, thumbOffset, thumbSize };
}

/** 自定义滚动轨：与可滚动容器 sync 的 thumb 比例与位置 */
export function useScrollRailMetrics(
  scrollRef: RefObject<HTMLElement | null>,
  deps: string = "",
): ScrollRailMetrics {
  const [metrics, setMetrics] = useState<ScrollRailMetrics>(EMPTY);

  const sync = useCallback(() => {
    const el = scrollRef.current;
    if (!el) {
      setMetrics(EMPTY);
      return;
    }
    setMetrics(measureScrollRail(el));
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
  }, [scrollRef, sync, deps]);

  return metrics;
}

/** 点击轨道时跳转到对应滚动位置 */
export function scrollRailJump(
  el: HTMLElement,
  clickY: number,
  trackRect: DOMRect,
): void {
  const ratio = Math.min(1, Math.max(0, (clickY - trackRect.top) / trackRect.height));
  const maxScroll = el.scrollHeight - el.clientHeight;
  el.scrollTo({ top: ratio * maxScroll, behavior: "auto" });
}
