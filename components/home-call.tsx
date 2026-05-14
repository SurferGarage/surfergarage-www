"use client";

import { useCallback, useId, useState } from "react";
import { AssistantQrSlot } from "@/components/assistant-qr-slot";
import {
  DISCORD_INVITE_URL,
  MAIL_HELLO,
  MAIL_PARTNERS,
} from "@/lib/site-contact";

const WECHAT_ID = "x3167056428";

export function HomeCall() {
  const toastId = useId();
  const [showToast, setShowToast] = useState(false);

  const copyWeChat = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(WECHAT_ID);
      setShowToast(true);
      window.setTimeout(() => setShowToast(false), 2600);
    } catch {
      window.prompt("复制微信号", WECHAT_ID);
    }
  }, []);

  return (
    <section
      id="call"
      className="scroll-mt-[4.5rem] border-b border-[var(--hairline)] py-24 md:py-36 relative overflow-hidden"
      aria-labelledby="call-heading"
    >
      <div
        aria-hidden
        className="sg-call-orb pointer-events-none absolute -right-28 top-[38%] h-[25rem] w-[25rem] -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(12,2,194,0.46)_0%,rgba(39,215,199,0.18)_36%,rgba(0,6,68,0)_72%)] blur-2xl"
      >
        <div className="sg-call-orb-core absolute inset-[24%] rounded-full bg-[radial-gradient(circle,rgba(39,215,199,0.2)_0%,rgba(12,2,194,0.05)_62%,rgba(0,6,68,0)_100%)]" />
      </div>
      <div className="mx-auto grid w-full max-w-[1440px] grid-cols-12 gap-x-4 px-5 md:gap-x-6 lg:px-12">
        <div
          className="col-span-12 md:col-span-4 md:self-end md:pb-3"
          data-call-intro
        >
          <p
            id="call-heading"
            className="font-[family-name:var(--font-zh)] text-[11px] font-medium tracking-[0.22em] text-[var(--foreground)]"
          >
            联络
          </p>
        </div>

        <div className="col-span-12 md:col-span-8 md:col-start-5">
          <nav aria-label="联络区主要操作">
            <ul className="flex flex-col">
              <li className="border-t border-[var(--hairline)]" data-call-item>
                <div className="flex flex-col gap-8 py-8 md:flex-row md:items-start md:justify-between md:gap-12 md:py-10">
                  <div className="min-w-0 max-w-xl">
                    <span className="font-[family-name:var(--font-en)] text-[clamp(1.75rem,4vw,2.75rem)] font-medium leading-[0.95] tracking-[-0.03em] text-[var(--foreground)]">
                      Community Assistant
                    </span>
                    <span className="mt-2 block font-[family-name:var(--font-zh)] text-sm text-[var(--brand-teal)]">
                      小浪 @SurferGarage
                    </span>
                    <span className="mt-3 block font-[family-name:var(--font-zh)] text-base text-[var(--muted-strong)] md:text-lg">
                      入群与材料咨询：先加小浪微信。
                    </span>
                    <p className="mt-4 max-w-md font-[family-name:var(--font-zh)] text-xs leading-relaxed text-[var(--muted)]">
                      商务与演讲仍走下方邮箱，减少好友位占用。
                    </p>
                  </div>
                  <AssistantQrSlot />
                </div>
              </li>
              <li className="border-t border-[var(--hairline)]" data-call-item>
                <a
                  href={DISCORD_INVITE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block rounded-sm py-8 md:py-10"
                >
                  <span className="font-[family-name:var(--font-en)] text-[clamp(2.25rem,6.5vw,5rem)] font-medium leading-[0.95] tracking-[-0.04em] transition-opacity group-hover:opacity-65">
                    Join the Garage
                  </span>
                  <span className="mt-3 block font-[family-name:var(--font-zh)] text-base text-[var(--muted-strong)] md:text-lg">
                    Discord：活动、组队与 Builder 讨论
                  </span>
                </a>
              </li>
              <li className="border-t border-[var(--hairline)]" data-call-item>
                <button
                  type="button"
                  onClick={copyWeChat}
                  aria-label={`复制微信号 ${WECHAT_ID}`}
                  className="group block w-full rounded-sm py-8 text-left md:py-10"
                >
                  <span className="font-[family-name:var(--font-en)] text-[clamp(2rem,5.5vw,4rem)] font-medium leading-[0.95] tracking-[-0.035em] transition-opacity group-hover:opacity-65">
                    Submit Your Build
                  </span>
                  <span className="mt-3 block font-[family-name:var(--font-zh)] text-base text-[var(--brand-teal)] md:text-lg">
                    提交你正在手搓的东西 · 微信 {WECHAT_ID}（点击复制）
                  </span>
                </button>
              </li>
              <li
                className="border-t border-b border-[var(--hairline)]"
                data-call-item
              >
                <div className="py-8 md:py-10">
                  <a
                    href={`mailto:${MAIL_HELLO}`}
                    className="group block rounded-sm"
                  >
                    <span className="break-all font-[family-name:var(--font-en)] text-[clamp(1.65rem,4.5vw,3.25rem)] font-medium leading-[0.95] tracking-[-0.03em] transition-opacity group-hover:opacity-65 md:text-[clamp(2rem,5.5vw,4rem)] md:tracking-[-0.035em]">
                      {MAIL_HELLO}
                    </span>
                    <span className="mt-3 block font-[family-name:var(--font-zh)] text-base text-[var(--muted-strong)] md:text-lg">
                      合作 · 演讲 · 媒体问询
                    </span>
                  </a>
                  <p className="mt-4 font-[family-name:var(--font-zh)] text-sm text-[var(--muted)]">
                    商务与生态合作：{" "}
                    <a
                      href={`mailto:${MAIL_PARTNERS}`}
                      className="rounded-sm text-[var(--brand-teal)] underline-offset-4 transition-colors hover:text-[var(--foreground)] hover:underline"
                    >
                      {MAIL_PARTNERS}
                    </a>
                  </p>
                </div>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      <div
        id={toastId}
        role="status"
        aria-live="polite"
        className={`fixed bottom-8 left-1/2 z-[60] -translate-x-1/2 rounded-sm border border-[var(--hairline)] bg-[var(--background)] px-5 py-3 font-[family-name:var(--font-zh)] text-sm text-[var(--foreground)] shadow-lg transition-opacity duration-300 ${
          showToast
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none invisible opacity-0"
        }`}
      >
        已复制微信号
      </div>
    </section>
  );
}
