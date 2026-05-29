"use client";

import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";
import {
  SG_STAGE_GUTTER_CLASS,
  SG_WECHAT_CARD_CLASS,
  SG_WECHAT_STAGE_MIN_H_CLASS,
} from "@/lib/sg-layout";
import { WECHAT_OFFICIAL_FEED } from "@/lib/wechat-official-feed";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

/**
 * Surfing Founders 微信专栏：全宽横滑展台（大画幅卡片 + 视口居中聚焦）。
 */
export function WeChatOfficialFeed() {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReducedMotion(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (reducedMotion) return;
    const el = scrollerRef.current;
    const stage = el?.closest<HTMLElement>("[data-wechat-stage]");
    if (!el || !stage) return;

    let raf = 0;
    let active = false;

    const updateFocus = () => {
      raf = 0;
      if (!active) return;

      const sr = el.getBoundingClientRect();
      const mid = sr.left + sr.width / 2;
      const cards = el.querySelectorAll<HTMLElement>("[data-wechat-card]");
      let best: HTMLElement | null = null;
      let bestDist = Number.POSITIVE_INFINITY;

      cards.forEach((card) => {
        const r = card.getBoundingClientRect();
        const dist = Math.abs(r.left + r.width / 2 - mid);
        if (dist < bestDist) {
          bestDist = dist;
          best = card;
        }
      });

      cards.forEach((card) => {
        const focused = card === best;
        if (focused) {
          if (!card.hasAttribute("data-wechat-focus")) {
            card.setAttribute("data-wechat-focus", "");
          }
        } else if (card.hasAttribute("data-wechat-focus")) {
          card.removeAttribute("data-wechat-focus");
        }
      });
    };

    const schedule = () => {
      if (!active || raf !== 0) return;
      raf = requestAnimationFrame(updateFocus);
    };

    const onScroll = () => schedule();
    const enable = () => {
      if (active) return;
      active = true;
      el.addEventListener("scroll", onScroll, { passive: true });
      schedule();
    };
    const disable = () => {
      if (!active) return;
      active = false;
      el.removeEventListener("scroll", onScroll);
      if (raf !== 0) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
      el.querySelectorAll<HTMLElement>("[data-wechat-card]").forEach((card) => {
        card.removeAttribute("data-wechat-focus");
      });
    };

    const io = new IntersectionObserver(
      (entries) => {
        const hit = entries.some((e) => e.isIntersecting);
        if (hit) enable();
        else disable();
      },
      { root: null, rootMargin: "80px 0px", threshold: 0 },
    );
    io.observe(stage);
    window.addEventListener("resize", schedule);

    return () => {
      disable();
      io.disconnect();
      window.removeEventListener("resize", schedule);
    };
  }, [reducedMotion]);

  return (
    <div
      className={`flex w-full flex-col justify-center ${SG_WECHAT_STAGE_MIN_H_CLASS}`}
      data-wechat-stage
    >
      <p
        className={`mb-4 font-[family-name:var(--font-zh)] text-[12px] leading-relaxed text-[var(--muted)] md:mb-5 md:text-[13px] ${SG_STAGE_GUTTER_CLASS}`}
      >
        {reducedMotion
          ? "请横向滑动浏览专栏。"
          : "左右滑动 · 桌面悬停可感受卡片倾角"}
      </p>

      <div
        ref={scrollerRef}
        data-wechat-official-feed
        className="wechat-official-feed-scroll overflow-x-auto overflow-y-hidden overscroll-x-contain scroll-smooth pb-2 [-webkit-overflow-scrolling:touch]"
      >
        <ul
          className={`flex w-max list-none snap-x snap-mandatory gap-6 pb-5 pt-1 md:gap-8 md:pb-6 lg:gap-10 ${SG_STAGE_GUTTER_CLASS}`}
          role="list"
        >
          {WECHAT_OFFICIAL_FEED.map((item, i) => (
            <li key={item.id} className="shrink-0 snap-center">
              <a
                data-wechat-card
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${item.titleZh}。Surfing Founders 人物访谈 微信专栏，在新标签页打开`}
                className={`wechat-feed-card-link group/card ${SG_WECHAT_CARD_CLASS} rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-[color-mix(in_oklch,var(--brand-teal)_55%,transparent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]`}
              >
                <CardContainer
                  className="relative isolate h-full min-h-0 w-full [transform:translateZ(0)]"
                  maxTilt={reducedMotion ? 0 : 9}
                >
                  <CardBody
                    showGlare
                    data-wechat-card-inner
                    className="relative flex flex-col overflow-hidden rounded-2xl border border-white/[0.14] bg-[linear-gradient(155deg,rgba(255,255,255,0.07)_0%,rgba(22,24,40,0.55)_38%,rgba(6,7,12,0.94)_100%)] shadow-[0_6px_40px_-14px_rgba(0,0,0,0.65),0_0_0_1px_rgba(255,255,255,0.05)_inset] transition-[box-shadow] duration-300 ease-out group-hover/card:shadow-[0_28px_80px_-28px_rgba(0,9,226,0.42),0_0_0_1px_rgba(39,215,199,0.22)_inset,0_0_48px_-20px_rgba(39,215,199,0.18)]"
                  >
                    <div
                      aria-hidden
                      className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover/card:opacity-100"
                      style={{
                        background:
                          "radial-gradient(120% 80% at 50% 0%, rgba(39,215,199,0.14), transparent 55%), radial-gradient(90% 60% at 100% 100%, rgba(0,9,226,0.2), transparent 50%)",
                      }}
                    />

                    <CardItem
                      translateZ={28}
                      className="relative z-[1] aspect-[16/10] w-full overflow-hidden bg-[#0a0a12] md:aspect-[5/3]"
                    >
                      <Image
                        src={item.imageSrc}
                        alt=""
                        fill
                        className={
                          reducedMotion
                            ? "object-cover"
                            : "object-cover transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/card:scale-[1.04]"
                        }
                        sizes={`(max-width: 640px) 90vw, (max-width: 1024px) 496px, (max-width: 1280px) 560px, 608px`}
                        priority={i < 2}
                      />
                      <div
                        aria-hidden
                        className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.07)_0%,transparent_32%,rgba(0,0,0,0.45)_100%)]"
                      />
                    </CardItem>

                    <CardItem
                      translateZ={14}
                      className="relative z-[1] space-y-2.5 border-t border-white/[0.1] bg-[linear-gradient(180deg,rgba(16,18,28,0.97)_0%,#06060a_100%)] px-5 py-5 md:space-y-3 md:px-6 md:py-6"
                    >
                      <p className="line-clamp-5 text-pretty font-[family-name:var(--font-zh)] text-[16px] font-medium leading-snug tracking-[-0.01em] text-[var(--foreground)] md:text-[18px] md:leading-snug lg:text-[19px]">
                        {item.titleZh}
                      </p>
                      <p className="pt-0.5 font-[family-name:var(--font-en)] text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--muted)] md:text-[11px]">
                        WeChat 专栏 · 阅读全文 ↗
                      </p>
                    </CardItem>
                  </CardBody>
                </CardContainer>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
