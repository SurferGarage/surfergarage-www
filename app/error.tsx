"use client";

import Link from "next/link";
import { useEffect } from "react";
import { SG_PAGE_SHELL_CLASS } from "@/lib/sg-layout";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // 真生产环境可以接入 Sentry / 自建上报
    if (typeof console !== "undefined") {
      console.error("[surfergarage] unhandled error", error);
    }
  }, [error]);

  return (
    <div className="flex min-h-[100svh] flex-col justify-center bg-[var(--paper-1)]">
      <main
        className={`${SG_PAGE_SHELL_CLASS} flex flex-col gap-8`}
        role="alert"
      >
        <div className="flex items-baseline gap-3">
          <span className="editorial-mono text-[11px] uppercase tracking-[0.22em] text-[var(--accent-amber)]">
            § ERR
          </span>
          <p className="editorial-eyebrow text-[var(--foreground)]">
            站点波动 · Unhandled
          </p>
        </div>
        <h1 className="editorial-serif text-[clamp(2rem,5vw,3.5rem)] leading-[1.04] text-[var(--foreground)]">
          这里有一点湍流，<br aria-hidden />
          <span className="text-[var(--muted-strong)]">先停一下再继续。</span>
        </h1>
        <p className="max-w-[44ch] font-[family-name:var(--font-zh)] text-[15px] leading-[1.75] text-[var(--muted-strong)] md:text-[16.5px]">
          页面在加载时发生了一次未捕获的错误。可以试试刷新；如果还在出错，请把下面的{" "}
          <span className="text-[var(--brand-teal)]">digest</span> 发邮件给我们。
        </p>
        {error.digest ? (
          <p className="editorial-mono-tabular text-[11px] uppercase tracking-[0.16em] text-[var(--muted)]">
            digest · {error.digest}
          </p>
        ) : null}
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => reset()}
            className="rounded-sm border border-[var(--brand-teal)]/55 bg-[color-mix(in_oklch,var(--brand-teal)_14%,transparent)] px-5 py-3 editorial-mono text-[11px] uppercase tracking-[0.18em] text-[var(--foreground)] transition-[background-color,border-color] hover:border-[var(--brand-teal)] hover:bg-[color-mix(in_oklch,var(--brand-teal)_22%,transparent)]"
          >
            重试 ↻
          </button>
          <Link
            href="/"
            className="editorial-mono text-[10.5px] uppercase tracking-[0.18em] text-[var(--muted-strong)] underline-offset-4 transition-colors hover:text-[var(--brand-teal)] hover:underline"
          >
            回到首页
          </Link>
          <a
            href="mailto:hello@surfergarage.com?subject=Site%20error%20report"
            className="editorial-mono text-[10.5px] uppercase tracking-[0.18em] text-[var(--muted)] underline-offset-4 transition-colors hover:text-[var(--brand-teal)] hover:underline"
          >
            上报问题 ↗
          </a>
        </div>
      </main>
    </div>
  );
}
