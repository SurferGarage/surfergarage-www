/**
 * 全站 loading.tsx：Next App Router 在路由级 suspense 时显示。
 * 设计上保留品牌「沉浸入水」的感受，但绝对克制——只一行 mono 文案 + 一根呼吸竖线。
 */

import { SG_PAGE_SHELL_CLASS } from "@/lib/sg-layout";

export default function Loading() {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      className="flex min-h-[100svh] flex-col justify-center bg-[var(--paper-1)]"
    >
      <div
        className={`${SG_PAGE_SHELL_CLASS} flex flex-col items-center gap-6`}
      >
        <span aria-hidden className="sg-scroll-cue-line" />
        <p className="editorial-eyebrow text-[var(--muted-strong)]">
          下潜中 · Loading
        </p>
        <p className="editorial-mono text-[10.5px] uppercase tracking-[0.22em] text-[var(--muted)]">
          surfergarage.com · 正在抵达水面
        </p>
      </div>
    </div>
  );
}
