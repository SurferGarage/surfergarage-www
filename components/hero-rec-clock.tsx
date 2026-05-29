"use client";

import { useSyncExternalStore } from "react";

function formatRecMonthUtc(): string {
  const now = new Date();
  const y = now.getUTCFullYear();
  const m = String(now.getUTCMonth() + 1).padStart(2, "0");
  return `${y}.${m}`;
}

/** Hero 左下 REC 月码：SSR 占位「—」，客户端注水后再显示 UTC，避免 Date hydration */
export function HeroRecClock() {
  const monthCode = useSyncExternalStore(
    () => () => {},
    formatRecMonthUtc,
    () => "—",
  );

  return (
    <p className="mt-1.5 editorial-mono-tabular text-[11px] uppercase tracking-[0.12em] text-[var(--foreground)] md:text-[12px]">
      REC · {monthCode}
    </p>
  );
}
