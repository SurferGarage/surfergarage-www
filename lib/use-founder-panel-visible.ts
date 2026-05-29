"use client";

import { useEffect, useState, type RefObject } from "react";

/** 叠卡顶屏时约 ≥8% 可见即挂载播放器（原 15% 偏晚） */
const PANEL_VISIBLE_RATIO = 0.08;

/** 面板顶边进入视口下方约半屏时开始预热（DNS + prefetch） */
const PANEL_PREFETCH_ROOT_MARGIN = "0px 0px 50vh 0px";

function measurePanelVisible(target: Element): boolean {
  const rect = target.getBoundingClientRect();
  const viewH = window.innerHeight || 1;
  const viewW = window.innerWidth || 1;
  const visibleW = Math.max(
    0,
    Math.min(rect.right, viewW) - Math.max(rect.left, 0),
  );
  const visibleH = Math.max(
    0,
    Math.min(rect.bottom, viewH) - Math.max(rect.top, 0),
  );
  const visibleArea = visibleW * visibleH;
  const targetArea = Math.max(rect.width * rect.height, 1);
  const ratio = visibleArea / targetArea;
  return ratio >= PANEL_VISIBLE_RATIO && visibleArea > 0;
}

/**
 * 观测 `data-founder-panel` 是否在视口中足够可见（片场 pin 离屏时返回 false）。
 */
export function useFounderPanelVisible(
  containerRef: RefObject<HTMLElement | null>,
): boolean {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const stage = containerRef.current;
    if (!stage) return;

    const panel = stage.closest<HTMLElement>("[data-founder-panel]");
    const target = panel ?? stage;

    const sync = () => setVisible(measurePanelVisible(target));

    const io = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;
        setVisible(
          entry.isIntersecting &&
            entry.intersectionRatio >= PANEL_VISIBLE_RATIO,
        );
      },
      { root: null, threshold: [0, PANEL_VISIBLE_RATIO, 0.35, 0.5] },
    );

    io.observe(target);
    sync();
    window.addEventListener("scroll", sync, { passive: true });
    window.addEventListener("resize", sync);

    return () => {
      io.disconnect();
      window.removeEventListener("scroll", sync);
      window.removeEventListener("resize", sync);
    };
  }, [containerRef]);

  return visible;
}

/**
 * 用户滚向「视频播客」屏前即返回 true，用于 prefetch / 提前挂载 iframe。
 */
export function useFounderPanelPrefetch(
  containerRef: RefObject<HTMLElement | null>,
): boolean {
  const [prefetch, setPrefetch] = useState(false);

  useEffect(() => {
    const stage = containerRef.current;
    if (!stage) return;

    const panel = stage.closest<HTMLElement>("[data-founder-panel]");
    const target = panel ?? stage;

    const io = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;
        setPrefetch(entry.isIntersecting);
      },
      { root: null, rootMargin: PANEL_PREFETCH_ROOT_MARGIN, threshold: 0 },
    );

    io.observe(target);
    return () => io.disconnect();
  }, [containerRef]);

  return prefetch;
}
