/**
 * 全站 loading.tsx：Next App Router 在路由级 suspense 时显示。
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
        <p className="font-[family-name:var(--font-zh)] text-[15px] text-[var(--muted-strong)] md:text-[16px]">
          加载中
        </p>
      </div>
    </div>
  );
}
