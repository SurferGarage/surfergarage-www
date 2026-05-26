"use client";

import { WECHAT_OFFICIAL_FEED } from "@/lib/wechat-official-feed";
import Image from "next/image";
import { useState } from "react";

/**
 * Founders Block A · 微信专栏 — YC 式 magazine spread。
 * 桌面：左 editorial + vol 列表，右大画幅封面。
 * 移动：封面在上，列表限高可滚。
 */
export function FounderWechatColumn() {
  const items = WECHAT_OFFICIAL_FEED;
  const [activeId, setActiveId] = useState(items[0]?.id ?? "");
  const active = items.find((i) => i.id === activeId) ?? items[0]!;
  const activeIndex = items.indexOf(active);

  return (
    <div
      className="grid h-full w-full grid-cols-1 lg:grid-cols-12"
      data-founders-intro
    >
      {/* 左：editorial + vol 列表 */}
      <div className="relative order-2 flex flex-col gap-5 px-5 py-6 md:px-10 md:py-8 lg:order-1 lg:col-span-6 lg:gap-7 lg:px-14 lg:py-10 xl:px-20">
        <div>
          <p className="editorial-eyebrow text-[var(--brand-teal)]">
            Editorial
          </p>
          <p className="mt-3 editorial-serif text-[clamp(1.2rem,2.4vw,1.6rem)] leading-[1.18] text-[var(--foreground)]">
            仍在海里建造的人，叫{" "}
            <span className="text-[var(--brand-teal)]">Surfing Founders</span>。
          </p>
        </div>

        <ul
          role="listbox"
          aria-label="微信专栏文章列表"
          className="flex max-h-[min(42svh,22rem)] min-h-0 flex-col divide-y divide-[var(--hairline-soft)] overflow-y-auto overscroll-y-contain lg:max-h-none lg:flex-1"
        >
          {items.map((item, i) => {
            const isActive = item.id === active.id;
            return (
              <li key={item.id}>
                <button
                  type="button"
                  role="option"
                  aria-selected={isActive}
                  onClick={() => setActiveId(item.id)}
                  className="group flex min-h-11 w-full items-baseline gap-4 py-2.5 text-left transition-colors md:py-3"
                >
                  <span
                    className={`editorial-mono-tabular w-12 shrink-0 text-[10.5px] uppercase tracking-[0.1em] ${
                      isActive
                        ? "text-[var(--brand-teal)]"
                        : "text-[var(--muted-soft)] group-hover:text-[var(--muted)]"
                    }`}
                  >
                    Vol.{String(i + 1).padStart(2, "0")}
                  </span>
                  <span
                    className={`line-clamp-2 flex-1 font-[family-name:var(--font-zh)] leading-snug transition-[color,font-weight,opacity] lg:line-clamp-1 ${
                      isActive
                        ? "text-[clamp(1rem,1.5vw,1.2rem)] font-medium text-[var(--foreground)]"
                        : "text-[13px] font-light text-[var(--muted-soft)] group-hover:text-[var(--muted-strong)] md:text-[14px]"
                    }`}
                    title={item.titleZh}
                  >
                    {item.titleZh}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>

        <div className="flex flex-wrap items-center gap-4 border-t border-[var(--hairline)] pt-4">
          <a
            href={active.href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center gap-2 rounded-sm border border-[var(--brand-teal)]/55 bg-[color-mix(in_oklch,var(--brand-teal)_12%,transparent)] px-4 py-2.5 editorial-mono text-[10.5px] uppercase tracking-[0.18em] text-[var(--foreground)] transition-[background-color,border-color] hover:border-[var(--brand-teal)] hover:bg-[color-mix(in_oklch,var(--brand-teal)_22%,transparent)]"
          >
            阅读全文
            <span aria-hidden className="text-[var(--brand-teal)]">↗</span>
          </a>
          <p className="editorial-mono text-[10px] uppercase tracking-[0.18em] text-[var(--muted)]">
            WeChat · {items.length} 篇
          </p>
        </div>
      </div>

      {/* 右：大画幅封面 — 移动优先展示 */}
      <div className="relative order-1 flex min-h-[36svh] items-center justify-center overflow-hidden bg-[var(--paper-2)] lg:order-2 lg:col-span-6 lg:min-h-0">
        <div
          aria-hidden
          className="absolute inset-0 scale-110"
          style={{ pointerEvents: "none" }}
        >
          <Image
            key={`${active.id}-bg`}
            src={active.imageSrc}
            alt=""
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 55vw"
            className="object-cover blur-3xl saturate-[0.6] opacity-50"
          />
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              background:
                "color-mix(in oklch, var(--paper-1) 78%, transparent)",
            }}
          />
        </div>

        <div className="relative h-full w-full px-5 py-8 md:px-8 md:py-14 lg:px-12 lg:py-16 xl:px-16 xl:py-20">
          <Image
            key={active.id}
            src={active.imageSrc}
            alt={active.titleZh}
            fill
            priority
            sizes="(max-width: 1024px) 90vw, 50vw"
            className="object-contain transition-opacity duration-500 ease-out"
          />
        </div>

        <div className="pointer-events-none absolute left-5 top-5 flex items-baseline gap-3 md:left-8 md:top-8 lg:left-10 lg:top-10">
          <span className="editorial-mono text-[10.5px] uppercase tracking-[0.22em] text-[var(--foreground)]">
            Vol.{String(activeIndex + 1).padStart(2, "0")}
          </span>
          <span className="editorial-mono text-[10px] uppercase tracking-[0.18em] text-[var(--muted)]">
            WeChat · Founders
          </span>
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-col gap-2 px-5 py-5 md:px-8 md:py-6 lg:px-10 lg:py-7">
          <p className="line-clamp-3 editorial-serif text-[clamp(1.05rem,1.8vw,1.4rem)] leading-[1.2] text-[var(--foreground)]">
            {active.titleZh}
          </p>
        </div>
      </div>
    </div>
  );
}
