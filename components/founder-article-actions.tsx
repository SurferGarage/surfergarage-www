"use client";

import { useCallback, useId, useState } from "react";

type FounderArticleActionsProps = {
  href: string;
  linkLabel: string;
};

export function FounderArticleActions({
  href,
  linkLabel,
}: FounderArticleActionsProps) {
  const toastId = useId();
  const [copied, setCopied] = useState(false);

  const copyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(href);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      window.prompt("复制链接", href);
    }
  }, [href]);

  return (
    <div className="mt-8 flex flex-wrap items-center gap-3">
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 rounded-sm border border-[var(--hairline)] bg-[rgba(19,19,19,0.55)] px-4 py-2.5 font-[family-name:var(--font-zh)] text-sm text-[var(--foreground)] transition-colors hover:border-[var(--brand-teal)]/45 hover:text-[var(--brand-teal)]"
      >
        <span>{linkLabel}</span>
        <span
          aria-hidden
          className="font-[family-name:var(--font-en)] text-xs text-[var(--muted)]"
        >
          ↗
        </span>
      </a>
      <button
        type="button"
        onClick={copyLink}
        className="rounded-sm border border-[var(--hairline)] px-3 py-2 font-[family-name:var(--font-zh)] text-xs text-[var(--muted-strong)] transition-colors hover:border-[var(--brand-teal)]/40 hover:text-[var(--foreground)]"
        aria-label="复制链接"
      >
        复制链接
      </button>
      <span
        id={toastId}
        role="status"
        aria-live="polite"
        className={`font-[family-name:var(--font-zh)] text-xs text-[var(--brand-teal)] transition-opacity ${
          copied ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        已复制
      </span>
    </div>
  );
}
