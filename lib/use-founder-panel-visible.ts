"use client";

import { useEffect, useState, type RefObject } from "react";

/** 叠卡顶屏时约 ≥8% 可见即挂载播放器 */
const PANEL_VISIBLE_RATIO = 0.08;

/** 视口下方额外预热带：约为半屏高度 */
const PANEL_PREFETCH_VIEWPORT_RATIO = 0.5;

function resolvePanelTarget(
  containerRef: RefObject<HTMLElement | null>,
): HTMLElement | null {
  const stage = containerRef.current;
  if (!stage) return null;
  return stage.closest<HTMLElement>("[data-founder-panel]") ?? stage;
}

function prefetchRootMargin(): string {
  if (typeof window === "undefined") return "0px 0px 50% 0px";
  const band = Math.round(window.innerHeight * PANEL_PREFETCH_VIEWPORT_RATIO);
  return `0px 0px ${band}px 0px`;
}

export type FounderPanelGate = {
  visible: boolean;
  prefetch: boolean;
};

/**
 * 单一 IO 门控：可见性 + 半屏预热带（无 window scroll 轮询）。
 */
export function useFounderPanelGate(
  containerRef: RefObject<HTMLElement | null>,
): FounderPanelGate {
  const [visible, setVisible] = useState(false);
  const [prefetch, setPrefetch] = useState(false);

  useEffect(() => {
    const target = resolvePanelTarget(containerRef);
    if (!target) return;

    const ioVisible = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;
        setVisible((prev) => {
          const next =
            entry.isIntersecting &&
            entry.intersectionRatio >= PANEL_VISIBLE_RATIO;
          return prev === next ? prev : next;
        });
      },
      { root: null, threshold: [0, PANEL_VISIBLE_RATIO, 0.35, 0.5] },
    );

    const ioPrefetch = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;
        setPrefetch((prev) => {
          const next = entry.isIntersecting;
          return prev === next ? prev : next;
        });
      },
      { root: null, rootMargin: prefetchRootMargin(), threshold: 0 },
    );

    ioVisible.observe(target);
    ioPrefetch.observe(target);

    const onResize = () => {
      ioPrefetch.disconnect();
      ioPrefetch.observe(target);
    };
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      ioVisible.disconnect();
      ioPrefetch.disconnect();
    };
  }, [containerRef]);

  return { visible, prefetch };
}

/** @deprecated 使用 `useFounderPanelGate` */
export function useFounderPanelVisible(
  containerRef: RefObject<HTMLElement | null>,
): boolean {
  return useFounderPanelGate(containerRef).visible;
}

/** @deprecated 使用 `useFounderPanelGate` */
export function useFounderPanelPrefetch(
  containerRef: RefObject<HTMLElement | null>,
): boolean {
  return useFounderPanelGate(containerRef).prefetch;
}
