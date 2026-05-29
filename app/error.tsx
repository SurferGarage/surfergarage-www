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
    if (typeof console !== "undefined") {
      console.error("[surfergarage] unhandled error", error);
    }
  }, [error]);

  return (
    <div className="flex min-h-[100svh] flex-col justify-center bg-[var(--paper-1)]">
      <main
        className={`${SG_PAGE_SHELL_CLASS} flex max-w-[40rem] flex-col gap-8`}
        role="alert"
      >
        <h1 className="editorial-serif text-[clamp(2rem,5vw,3.25rem)] leading-[1.06] text-[var(--foreground)]">
          页面加载出错
        </h1>
        <p className="font-[family-name:var(--font-zh)] text-[16px] leading-[1.75] text-[var(--muted-strong)] md:text-[17px]">
          请尝试刷新。若问题仍在，发邮件至 hello@surfergarage.com
          {error.digest ? `，并附上错误码 ${error.digest}` : ""}。
        </p>
        <div className="flex flex-wrap items-center gap-4">
          <button
            type="button"
            onClick={() => reset()}
            className="rounded-sm border border-[var(--brand-teal)]/55 bg-[color-mix(in_oklch,var(--brand-teal)_14%,transparent)] px-5 py-3 font-[family-name:var(--font-zh)] text-[15px] text-[var(--foreground)] transition-[background-color,border-color] hover:border-[var(--brand-teal)] hover:bg-[color-mix(in_oklch,var(--brand-teal)_22%,transparent)]"
          >
            重试
          </button>
          <Link
            href="/"
            className="font-[family-name:var(--font-zh)] text-[15px] text-[var(--brand-teal)] underline-offset-4 hover:underline"
          >
            回到首页
          </Link>
        </div>
      </main>
    </div>
  );
}
