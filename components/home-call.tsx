"use client";

import { useCallback, useState } from "react";
import { AssistantQrSlot } from "@/components/assistant-qr-slot";
import {
  DISCORD_INVITE_URL,
  MAIL_HELLO,
  MAIL_PARTNERS,
} from "@/lib/site-contact";
import { SG_PAGE_SHELL_CLASS } from "@/lib/sg-layout";

const WECHAT_ID = "x3167056428";

/** 匹配度清单 — 单行记忆点，无副文案 */
const WHAT_FOR_US: ReadonlyArray<string> = [
  "手上有可核对产出",
  "能聊代价与复盘",
  "非共识路径上的 builder",
];

const NOT_FOR_US: ReadonlyArray<string> = [
  "只要曝光 · 找媒体",
  "卖课 · 套模板",
  "投递 · 走 partners 邮箱",
];

type ToastState = { id: string | null; label: string };

export function HomeCall() {
  const [toast, setToast] = useState<ToastState>({ id: null, label: "" });

  const fireToast = useCallback((id: string, label: string) => {
    setToast({ id, label });
    window.setTimeout(() => {
      setToast((prev) => (prev.id === id ? { id: null, label: "" } : prev));
    }, 2400);
  }, []);

  const copyWeChat = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(WECHAT_ID);
      fireToast("wechat", "已复制微信号");
    } catch {
      window.prompt("复制微信号", WECHAT_ID);
    }
  }, [fireToast]);

  return (
    <section
      id="call"
      className="scroll-mt-[4.5rem] border-b border-[var(--hairline)] py-20 md:py-44 relative overflow-hidden"
      aria-labelledby="call-heading"
    >
      <div
        aria-hidden
        className="sg-call-orb pointer-events-none absolute -right-28 top-[34%] h-[25rem] w-[25rem] -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(39,215,199,0.34)_0%,rgba(230,185,100,0.12)_38%,rgba(11,12,16,0)_72%)] blur-2xl"
      >
        <div className="sg-call-orb-core absolute inset-[24%] rounded-full bg-[radial-gradient(circle,rgba(39,215,199,0.18)_0%,rgba(230,185,100,0.05)_62%,rgba(11,12,16,0)_100%)]" />
      </div>

      <div className={`${SG_PAGE_SHELL_CLASS}`}>
        {/* —— 区块标题 —— */}
        <div className="grid w-full grid-cols-12 gap-x-4 md:gap-x-6">
          <div
            className="sg-spotlight-host col-span-12 md:col-span-4 md:self-end md:pb-3"
            data-call-intro
            data-spotlight="amber"
          >
            <div className="flex items-baseline gap-3">
              <span className="editorial-mono text-[11px] uppercase tracking-[0.22em] text-[var(--accent-amber)]">
                § 05
              </span>
              <p
                id="call-heading"
                className="editorial-eyebrow text-[var(--foreground)]"
              >
                联络 · Call
              </p>
            </div>
            <h2 className="mt-4 editorial-serif text-[clamp(2rem,4.2vw,3rem)] leading-[1.04] text-[var(--foreground)]">
              加入车库
            </h2>
          </div>

          {/* —— 大字 CTA list —— */}
          <div className="col-span-12 md:col-span-8 md:col-start-5">
            <nav aria-label="联络区主要操作">
              <ul className="flex flex-col">
                <li className="border-t border-[var(--hairline)]" data-call-item>
                  <div className="flex flex-col gap-8 py-8 md:flex-row md:items-start md:justify-between md:gap-12 md:py-10">
                    <div className="min-w-0 max-w-xl">
                      <span className="font-[family-name:var(--font-en)] text-[clamp(1.75rem,4vw,2.75rem)] font-medium leading-[0.96] tracking-[-0.03em] text-[var(--foreground)]">
                        Community Assistant
                      </span>
                      <span className="mt-2 block font-[family-name:var(--font-zh)] text-sm text-[var(--brand-teal)]">
                        小浪 @SurferGarage
                      </span>
                      <span className="mt-3 block font-[family-name:var(--font-zh)] text-base text-[var(--muted-strong)] md:text-lg">
                        入群 · 加小浪微信
                      </span>
                    </div>
                    <AssistantQrSlot />
                  </div>
                </li>

                <li className="border-t border-[var(--hairline)]" data-call-item>
                  <a
                    href={DISCORD_INVITE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-between gap-6 rounded-sm py-8 md:py-10"
                  >
                    <span className="block">
                      <span className="font-[family-name:var(--font-en)] text-[clamp(2.25rem,6.5vw,5rem)] font-medium leading-[0.94] tracking-[-0.04em] transition-opacity group-hover:opacity-70">
                        Join the Garage
                      </span>
                      <span className="mt-3 block font-[family-name:var(--font-zh)] text-base text-[var(--muted-strong)] md:text-lg">
                        Discord · 活动与讨论
                      </span>
                    </span>
                    <span
                      aria-hidden
                      className="editorial-mono shrink-0 text-[11px] uppercase tracking-[0.18em] text-[var(--muted)] transition-colors group-hover:text-[var(--brand-teal)]"
                    >
                      Discord ↗
                    </span>
                  </a>
                </li>

                <li className="border-t border-[var(--hairline)]" data-call-item>
                  <button
                    type="button"
                    onClick={copyWeChat}
                    aria-label={`复制微信号 ${WECHAT_ID}`}
                    className="group flex w-full items-center justify-between gap-6 rounded-sm py-8 text-left md:py-10"
                  >
                    <span className="block min-w-0">
                      <span className="font-[family-name:var(--font-en)] text-[clamp(2rem,5.5vw,4rem)] font-medium leading-[0.94] tracking-[-0.035em] transition-opacity group-hover:opacity-70">
                        Submit Your Build
                      </span>
                      <span className="mt-3 block font-[family-name:var(--font-zh)] text-base text-[var(--brand-teal)] md:text-lg">
                        提交手搓项目 · 微信 {WECHAT_ID}
                      </span>
                    </span>
                    <span
                      aria-hidden
                      className={`editorial-mono shrink-0 text-[11px] uppercase tracking-[0.18em] transition-colors ${
                        toast.id === "wechat"
                          ? "text-[var(--brand-teal)]"
                          : "text-[var(--muted)] group-hover:text-[var(--foreground)]"
                      }`}
                    >
                      {toast.id === "wechat" ? toast.label : "点击复制"}
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
                      <span className="break-all font-[family-name:var(--font-en)] text-[clamp(1.65rem,4.5vw,3.25rem)] font-medium leading-[0.94] tracking-[-0.03em] transition-opacity group-hover:opacity-70 md:text-[clamp(2rem,5.5vw,4rem)] md:tracking-[-0.035em]">
                        {MAIL_HELLO}
                      </span>
                      <span className="mt-3 block font-[family-name:var(--font-zh)] text-base text-[var(--muted-strong)] md:text-lg">
                        合作 · 演讲 · 媒体问询
                      </span>
                    </a>
                    <p className="mt-4 font-[family-name:var(--font-zh)] text-sm text-[var(--muted)]">
                      生态合作 →{" "}
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

      </div>
    </section>
  );
}

/** Fit · What we're looking for / Not for us — 独立 section
 * 紧贴 #call 之下、Footer 之上；与大字 CTA list 分屏展示，避免一屏信息超载。 */
export function HomeFit() {
  return (
    <section
      id="fit"
      data-fit-panel
      className="scroll-mt-[4.5rem] border-b border-[var(--hairline)]"
      aria-labelledby="fit-heading"
    >
      <div
        data-fit-card
        className="flex items-center overflow-hidden py-16 md:h-[calc(100dvh-4.5rem)] md:py-0"
      >
        <div className={`${SG_PAGE_SHELL_CLASS} w-full`}>
          <div className="grid grid-cols-1 gap-10 md:grid-cols-12 md:gap-14">
            <div className="md:col-span-4" data-fit-intro>
              <div className="flex items-baseline gap-3">
                <span className="editorial-mono text-[10.5px] uppercase tracking-[0.22em] text-[var(--accent-amber)]">
                  § 05.b
                </span>
                <p
                  id="fit-heading"
                  className="editorial-eyebrow text-[var(--foreground)]"
                >
                  Fit · 匹配度
                </p>
              </div>
              <h2 className="mt-4 editorial-serif text-[clamp(1.75rem,3.6vw,2.5rem)] leading-[1.04] text-[var(--foreground)]">
                我们在找什么样的人
              </h2>
            </div>

            <div className="md:col-span-8">
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-10">
                <div className="flex flex-col" data-fit-col>
                  <div className="flex items-baseline gap-3 border-b border-[var(--hairline)] pb-3">
                    <span
                      aria-hidden
                      className="h-2.5 w-2.5 shrink-0 translate-y-[1px] rounded-full bg-[var(--brand-teal)]"
                    />
                    <p className="editorial-eyebrow text-[var(--brand-teal)]">
                      What we&apos;re looking for
                    </p>
                  </div>
                <ul className="mt-5 flex flex-col gap-4">
                  {WHAT_FOR_US.map((line, i) => (
                    <li key={line} className="flex gap-3" data-fit-item>
                      <span className="editorial-mono mt-1 shrink-0 text-[10.5px] uppercase tracking-[0.14em] text-[var(--muted)]">
                        0{i + 1}
                      </span>
                      <p className="font-[family-name:var(--font-zh)] text-[14.5px] font-medium leading-snug text-[var(--foreground)] md:text-[15.5px]">
                        {line}
                      </p>
                    </li>
                  ))}
                </ul>
                </div>

                <div className="flex flex-col" data-fit-col>
                  <div className="flex items-baseline gap-3 border-b border-[var(--hairline)] pb-3">
                    <span
                      aria-hidden
                      className="h-2.5 w-2.5 shrink-0 translate-y-[1px] rounded-full bg-[var(--accent-amber)]/65"
                    />
                    <p className="editorial-eyebrow text-[var(--accent-amber)]">
                      Not for us
                    </p>
                  </div>
                <ul className="mt-5 flex flex-col gap-4">
                  {NOT_FOR_US.map((line, i) => (
                    <li key={line} className="flex gap-3" data-fit-item>
                      <span className="editorial-mono mt-1 shrink-0 text-[10.5px] uppercase tracking-[0.14em] text-[var(--muted)]">
                        0{i + 1}
                      </span>
                      <p className="font-[family-name:var(--font-zh)] text-[14.5px] font-medium leading-snug text-[var(--muted-strong)] md:text-[15.5px]">
                        {line}
                      </p>
                    </li>
                  ))}
                </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
