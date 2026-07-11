"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

import {
  DISCORD_INVITE_URL,
  MAIL_HELLO,
  MAIL_PARTNERS,
} from "@/lib/site-contact";
import {
  SG_IMMERSIVE_INSET_CLASS,
  SG_IMMERSIVE_PLANE_CLASS,
  SG_IMMERSIVE_SECTION_CLASS,
} from "@/lib/sg-layout";

const WECHAT_ID = "x3167056428";

const STORY_SIGNALS = [
  "16–28 岁，正在做科技产品",
  "已经有真实 demo、用户或关键复盘",
  "愿意公开讲速度、风险与代价",
] as const;

export function HomeCall() {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, []);

  const copyWeChat = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(WECHAT_ID);
      setCopied(true);
      if (timerRef.current) window.clearTimeout(timerRef.current);
      timerRef.current = window.setTimeout(() => setCopied(false), 2200);
    } catch {
      window.prompt("复制微信号", WECHAT_ID);
    }
  }, []);

  return (
    <section
      id="call"
      className={`${SG_IMMERSIVE_SECTION_CLASS} scroll-mt-[4.5rem] border-b border-[var(--hairline)]`}
      aria-labelledby="call-heading"
    >
      <div
        className={`${SG_IMMERSIVE_PLANE_CLASS} ${SG_IMMERSIVE_INSET_CLASS} sg-home-call-plane sg-immersive-plane--dark flex min-h-[calc(100svh-4.5rem)] flex-col overflow-hidden bg-[var(--paper-1)] py-20 md:py-28 lg:py-32`}
      >
        <div
          id="call-join"
          className="sg-home-call-join grid flex-1 scroll-mt-[6rem] items-center gap-14 py-16 md:py-20 lg:grid-cols-12 lg:gap-16 lg:py-24"
        >
          <div className="lg:col-span-7">
            <h2
              id="call-heading"
              className="font-[family-name:var(--font-serif-zh)] text-[3rem] font-semibold leading-[1.15] text-[var(--foreground)] md:text-[4.5rem] lg:text-[4.75rem] xl:text-[5.25rem]"
            >
              <span className="block">你也正在</span>
              <span className="block">造浪吗？</span>
            </h2>
            <p className="mt-8 max-w-[42rem] font-[family-name:var(--font-serif-zh)] text-[1.45rem] font-semibold leading-[1.65] text-[var(--foreground)] md:text-[1.8rem]">
              也许你正在 Garage，也许还在学校宿舍里。只要你在认真建造，就值得留下第一份真实记录。
            </p>
            <p className="mt-6 max-w-[39rem] font-[family-name:var(--font-zh)] text-[15px] leading-[1.85] text-[var(--muted-strong)] md:text-[16px]">
              添加小浪微信，并附上一句话说明你在做什么，以及 demo、链接或一段真实复盘。我们会先理解，再决定用哪一种方式记录。
            </p>

            <button
              type="button"
              onClick={copyWeChat}
              className="mt-9 inline-flex min-h-12 items-center gap-6 bg-[var(--brand-primary)] px-5 py-3 text-left text-white transition-colors hover:bg-[#1420ff]"
              aria-label={`复制微信号 ${WECHAT_ID}`}
            >
              <span className="font-[family-name:var(--font-zh)] text-[15px] font-medium">
                {copied ? "微信号已复制" : "复制微信号"}
              </span>
              <span className="font-[family-name:var(--font-mono)] text-[13px] text-white/75">
                {WECHAT_ID}
              </span>
            </button>
          </div>

          <aside className="border-t border-[var(--hairline)] pt-9 lg:col-span-5 lg:border-l lg:border-t-0 lg:pl-12 lg:pt-0">
            <div className="grid items-start gap-8 sm:grid-cols-[10rem_1fr] lg:grid-cols-1 xl:grid-cols-[10rem_1fr]">
              <Image
                src="/wechat-assistant-qr.png"
                alt="小浪微信二维码"
                width={160}
                height={200}
                className="h-auto w-40 bg-white p-1"
              />
              <div>
                <p className="font-[family-name:var(--font-mono)] text-[10px] uppercase text-[var(--brand-teal)] md:text-[11px]">
                  微信联系
                </p>
                <h3 className="mt-4 font-[family-name:var(--font-zh)] text-[1.45rem] font-medium leading-[1.45] text-[var(--foreground)] md:text-[1.65rem]">
                  把正在发生的事，直接发给我们。
                </h3>
                <p className="mt-4 font-[family-name:var(--font-zh)] text-[14px] leading-[1.75] text-[var(--muted-strong)] md:text-[15px]">
                  节目更新、线下活动与驻地讨论也会通过小浪微信同步。
                </p>
                <a
                  href={DISCORD_INVITE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 inline-flex font-[family-name:var(--font-zh)] text-[14px] text-[var(--brand-teal)] transition-colors hover:text-[var(--foreground)]"
                >
                  Discord 社群 ↗
                </a>
              </div>
            </div>
          </aside>
        </div>

        <ol className="grid border-y border-[var(--hairline)] md:grid-cols-3">
          {STORY_SIGNALS.map((signal, index) => (
            <li
              key={signal}
              className={`flex min-h-28 items-start gap-5 py-6 md:min-h-36 md:px-7 md:py-7 ${
                index > 0
                  ? "border-t border-[var(--hairline-soft)] md:border-l md:border-t-0"
                  : ""
              }`}
            >
              <span className="font-[family-name:var(--font-mono)] text-[10px] text-[var(--accent-amber)] md:text-[11px]">
                {String(index + 1).padStart(2, "0")}
              </span>
              <p className="max-w-[18rem] font-[family-name:var(--font-zh)] text-[15px] leading-[1.7] text-[var(--foreground)] md:text-[16px]">
                {signal}
              </p>
            </li>
          ))}
        </ol>

        <div className="grid gap-7 pt-9 md:grid-cols-2 md:gap-10">
          <div>
            <p className="font-[family-name:var(--font-mono)] text-[10px] uppercase text-[var(--muted)] md:text-[11px]">
              内容与采访
            </p>
            <a
              href={`mailto:${MAIL_HELLO}`}
              className="mt-3 block break-all font-[family-name:var(--font-en)] text-[17px] text-[var(--foreground)] transition-colors hover:text-[var(--brand-teal)] md:text-[19px]"
            >
              {MAIL_HELLO}
            </a>
          </div>
          <div>
            <p className="font-[family-name:var(--font-mono)] text-[10px] uppercase text-[var(--muted)] md:text-[11px]">
              活动与合作
            </p>
            <a
              href={`mailto:${MAIL_PARTNERS}`}
              className="mt-3 block break-all font-[family-name:var(--font-en)] text-[17px] text-[var(--foreground)] transition-colors hover:text-[var(--brand-teal)] md:text-[19px]"
            >
              {MAIL_PARTNERS}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

/** 兼容旧链接；匹配规则已并入 #call-join。 */
export function HomeFit() {
  return <span id="fit" className="sr-only" aria-hidden />;
}
