"use client";

import {
  scrollRailJump,
  useScrollRailMetrics,
  type ScrollRailMetrics,
} from "@/lib/use-scroll-rail-metrics";
import {
  useCallback,
  useRef,
  type MouseEvent,
  type RefObject,
} from "react";

type SgScrollRailProps = {
  scrollRef: RefObject<HTMLElement | null>;
  /** 列表项数量等，变化时重算 thumb */
  measureKey?: string;
  className?: string;
};

/**
 * 右侧自定义滚动轨：隐藏原生条，thumb 按比例、hover 增亮，点击轨道跳转。
 */
export function SgScrollRail({
  scrollRef,
  measureKey = "",
  className = "",
}: SgScrollRailProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const metrics = useScrollRailMetrics(scrollRef, measureKey);

  const onTrackPointerDown = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      const el = scrollRef.current;
      const track = trackRef.current;
      if (!el || !track || e.button !== 0) return;
      scrollRailJump(el, e.clientY, track.getBoundingClientRect());
    },
    [scrollRef],
  );

  if (!metrics.canScroll) return null;

  return (
    <div
      className={`sg-scroll-rail ${className}`.trim()}
      aria-hidden
    >
      <div
        ref={trackRef}
        className="sg-scroll-rail-track"
        onPointerDown={onTrackPointerDown}
      >
        <ScrollRailThumb metrics={metrics} />
      </div>
    </div>
  );
}

function ScrollRailThumb({ metrics }: { metrics: ScrollRailMetrics }) {
  const topPct = metrics.thumbOffset * 100;
  const heightPct = metrics.thumbSize * 100;

  return (
    <div
      className="sg-scroll-rail-thumb"
      style={{
        top: `${topPct}%`,
        height: `${heightPct}%`,
      }}
    />
  );
}
