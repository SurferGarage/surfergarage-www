"use client";

import { MAIL_HELLO } from "@/lib/site-contact";
import { useCallback, useId, useState } from "react";

/** 邮箱基本校验（RFC 5322 简化版） */
const EMAIL_RE = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

type Status = "idle" | "submitted" | "invalid";

/** Footer Newsletter：仅 mailto 跳转，不接第三方
 * 用户输入邮箱 → 跳到 `mailto:hello@surfergarage.com?subject=Subscribe&body=...`
 * 用户在邮件客户端发送，我们手动登记。无依赖、可降级。 */
export function FooterNewsletter() {
  const fieldId = useId();
  const [value, setValue] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  const submit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const v = value.trim();
      if (!EMAIL_RE.test(v)) {
        setStatus("invalid");
        return;
      }
      const subject = encodeURIComponent("Subscribe · Surfing Founders");
      const body = encodeURIComponent(
        `请将 ${v} 加入订阅列表，新一期上线时通知我。\n\n—— 来自 surfergarage.com / Footer`,
      );
      window.location.href = `mailto:${MAIL_HELLO}?subject=${subject}&body=${body}`;
      setStatus("submitted");
    },
    [value],
  );

  return (
    <form onSubmit={submit} className="flex w-full flex-col gap-2.5" noValidate>
      <label
        htmlFor={fieldId}
        className="editorial-eyebrow text-[var(--muted)]"
      >
        Newsletter · 新一期通知
      </label>

      <div className="mt-1 flex w-full gap-2">
        <input
          id={fieldId}
          type="email"
          required
          placeholder="you@domain.com"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            if (status !== "idle") setStatus("idle");
          }}
          aria-invalid={status === "invalid"}
          className="w-0 min-w-0 flex-1 rounded-sm border border-[var(--hairline)] bg-[var(--paper-1)] px-3 py-2.5 font-[family-name:var(--font-en)] text-[13px] text-[var(--foreground)] placeholder:text-[var(--muted-soft)] transition-colors focus:border-[var(--brand-teal)]/55 focus:bg-[var(--paper-2)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-teal)]/45"
        />
        <button
          type="submit"
          className="shrink-0 rounded-sm border border-[var(--brand-teal)]/55 bg-[color-mix(in_oklch,var(--brand-teal)_12%,transparent)] px-3.5 py-2.5 editorial-mono text-[10px] uppercase tracking-[0.18em] text-[var(--foreground)] transition-[background-color,border-color] hover:border-[var(--brand-teal)] hover:bg-[color-mix(in_oklch,var(--brand-teal)_22%,transparent)]"
        >
          订阅 ↗
        </button>
      </div>

      <p
        role="status"
        aria-live="polite"
        className="editorial-mono min-h-[14px] text-[10px] uppercase tracking-[0.16em]"
      >
        {status === "submitted" ? (
          <span className="text-[var(--brand-teal)]">
            请发送邮件完成订阅
          </span>
        ) : status === "invalid" ? (
          <span className="text-[var(--accent-amber)]">
            请输入有效邮箱
          </span>
        ) : (
          <span className="text-[var(--muted-soft)]">
            无垃圾邮件
          </span>
        )}
      </p>
    </form>
  );
}
