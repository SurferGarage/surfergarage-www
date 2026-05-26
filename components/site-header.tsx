"use client";

import { useLenis } from "@/components/lenis-context";
import { SITE_NAME } from "@/lib/site-metadata";
import { SITE_PRIMARY_NAV } from "@/lib/site-nav";
import { SG_PAGE_SHELL_CLASS } from "@/lib/sg-layout";
import Image from "next/image";
import { useCallback, useEffect, useId, useState, type MouseEvent } from "react";

/** 入口 CTA 主操作：与 #call 落点一致 */
const HEADER_CTA_HREF = "#call";

const navLinkClass =
  "group relative inline-flex shrink-0 items-center rounded-sm px-1.5 py-1 text-[var(--muted-strong)] transition-colors hover:text-[var(--foreground)] focus-visible:text-[var(--foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-teal)]/45";

const navLinkActiveClass = "text-[var(--foreground)]";

/** Active dot — 当前 section 锚点指示 */
function ActiveDot({ active }: { active: boolean }) {
  return (
    <span
      aria-hidden
      className={`pointer-events-none absolute left-1/2 -bottom-1.5 h-1 w-1 -translate-x-1/2 rounded-full bg-[var(--brand-teal)] transition-opacity duration-200 ${
        active ? "opacity-100" : "opacity-0 group-hover:opacity-40"
      }`}
    />
  );
}

/** IntersectionObserver 跟踪当前可见 section，写入 active 锚点 */
function useActiveSection(sectionIds: readonly string[]) {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (!sections.length) return;

    let visibleMap = new Map<string, number>();

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            visibleMap.set(e.target.id, e.intersectionRatio);
          } else {
            visibleMap.delete(e.target.id);
          }
        });
        if (visibleMap.size === 0) return;
        let bestId: string | null = null;
        let bestR = -1;
        visibleMap.forEach((r, id) => {
          if (r > bestR) {
            bestR = r;
            bestId = id;
          }
        });
        if (bestId) setActive(bestId);
      },
      {
        root: null,
        rootMargin: "-40% 0px -40% 0px",
        threshold: [0, 0.15, 0.3, 0.5, 0.75, 1],
      },
    );

    sections.forEach((s) => io.observe(s));

    return () => {
      io.disconnect();
      visibleMap = new Map();
    };
  }, [sectionIds]);

  return active;
}

function HamburgerIcon({ open }: { open: boolean }) {
  return (
    <svg
      width={22}
      height={22}
      viewBox="0 0 22 22"
      aria-hidden
      className="text-[var(--foreground)]"
    >
      <line
        x1="3"
        y1="7"
        x2="19"
        y2="7"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        style={{
          transform: open ? "translate(0px, 4px) rotate(45deg)" : "none",
          transformOrigin: "11px 7px",
          transition: "transform 240ms cubic-bezier(0.22,1,0.36,1)",
        }}
      />
      <line
        x1="3"
        y1="15"
        x2="19"
        y2="15"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        style={{
          transform: open ? "translate(0px, -4px) rotate(-45deg)" : "none",
          transformOrigin: "11px 15px",
          transition: "transform 240ms cubic-bezier(0.22,1,0.36,1)",
        }}
      />
    </svg>
  );
}

export function SiteHeader() {
  const sectionIds = SITE_PRIMARY_NAV.map((n) => n.href.replace(/^#/, ""));
  const activeId = useActiveSection(sectionIds);
  const [open, setOpen] = useState(false);
  const drawerId = useId();
  const lenis = useLenis();

  const close = useCallback(() => setOpen(false), []);

  /** 拦截锚点点击 — 即时跳到 target（绕过 Lenis 平滑滚动） */
  const handleAnchorClick = useCallback(
    (e: MouseEvent<HTMLAnchorElement>, href: string) => {
      if (!href.startsWith("#")) return;
      const id = href.slice(1);
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();

      // Lenis 存在：immediate 跳转，禁用动画
      if (lenis) {
        lenis.scrollTo(target, { immediate: true, lock: true });
      } else {
        // reduced-motion / 无 Lenis：scroll-padding 已处理 sticky header 偏移
        target.scrollIntoView({ behavior: "auto", block: "start" });
      }

      // 同步 URL hash，但不再次触发滚动
      if (typeof window !== "undefined") {
        window.history.replaceState(null, "", href);
      }

      // 移动 drawer 自动收起
      setOpen(false);
    },
    [lenis],
  );

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKey);
    };
  }, [open, close]);

  /** 桌面布局 nav 拆分：前 2 个为左、后 2 个为右；logo 居中 */
  const leftNavItems = SITE_PRIMARY_NAV.slice(0, 2);
  const rightNavItems = SITE_PRIMARY_NAV.slice(2);

  function DesktopNavLink({
    href,
    labelZh,
  }: {
    href: string;
    labelZh: string;
  }) {
    const id = href.replace(/^#/, "");
    const isActive = activeId === id;
    return (
      <a
        href={href}
        onClick={(e) => handleAnchorClick(e, href)}
        className={`${navLinkClass} ${isActive ? navLinkActiveClass : ""}`}
        aria-current={isActive ? "true" : undefined}
      >
        {labelZh}
        <ActiveDot active={isActive} />
      </a>
    );
  }

  return (
    <header className="sg-header-depth sticky top-0 z-30 border-b border-[var(--hairline)] backdrop-blur-md">
      {/* —— Mobile（< md）—— logo 左、hamburger 右 */}
      <div
        className={`flex items-center justify-between gap-4 py-3.5 md:hidden ${SG_PAGE_SHELL_CLASS}`}
      >
        <a
          href="#manifesto"
          onClick={(e) => handleAnchorClick(e, "#manifesto")}
          className="flex items-center gap-3 rounded-sm font-[family-name:var(--font-en)] text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--foreground)]"
          aria-label={`${SITE_NAME}，返回宣言`}
        >
          <Image
            src="/brand-sg-logo.png"
            alt=""
            width={36}
            height={36}
            className="h-9 w-9 shrink-0 object-contain"
            priority
          />
          <span className="hidden items-baseline gap-1.5 sm:flex">
            <span>Surfer</span>
            <span>Garage</span>
          </span>
        </a>

        <div className="flex items-center gap-2">
          <a
            href={HEADER_CTA_HREF}
            onClick={(e) => handleAnchorClick(e, HEADER_CTA_HREF)}
            data-magnet
            className="group inline-flex shrink-0 items-center gap-1.5 rounded-sm border border-[color-mix(in_oklch,var(--brand-teal)_45%,transparent)] bg-[color-mix(in_oklch,var(--brand-teal)_10%,transparent)] px-3 py-1.5 font-[family-name:var(--font-en)] text-[10px] font-medium uppercase tracking-[0.18em] text-[var(--foreground)]"
            aria-label="加入 SurferGarage 社群"
          >
            <span className="sg-magnet-target inline-flex items-center gap-1.5">
              <span>Join</span>
              <span
                aria-hidden
                className="text-[var(--brand-teal)]"
              >
                ↗
              </span>
            </span>
          </a>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls={drawerId}
            aria-label={open ? "关闭主导航" : "打开主导航"}
            className="inline-flex h-9 w-9 items-center justify-center rounded-sm border border-[var(--hairline)] bg-[rgba(15,17,22,0.55)]"
          >
            <HamburgerIcon open={open} />
          </button>
        </div>
      </div>

      {/* —— Desktop（≥ md）—— logo 居中、左 2 / 右 2 + CTA；列间距明显拉开 */}
      <div
        className={`hidden items-center py-4 md:grid md:gap-10 lg:gap-14 lg:py-5 xl:gap-20 ${SG_PAGE_SHELL_CLASS}`}
        style={{
          gridTemplateColumns: "1fr auto 1fr",
        }}
      >
        {/* 左 nav — flex-end，整体向中心靠拢 */}
        <nav
          className="flex items-center justify-end gap-7 font-[family-name:var(--font-zh)] text-[13px] font-medium tracking-[0.12em] lg:gap-9"
          aria-label="主导航 · 左"
        >
          {leftNavItems.map((item) => (
            <DesktopNavLink
              key={item.href}
              href={item.href}
              labelZh={item.labelZh}
            />
          ))}
        </nav>

        {/* 中央 logo */}
        <a
          href="#manifesto"
          onClick={(e) => handleAnchorClick(e, "#manifesto")}
          className="group flex shrink-0 items-center gap-3 rounded-sm px-4 font-[family-name:var(--font-en)] text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--foreground)] transition-opacity hover:opacity-90"
          aria-label={`${SITE_NAME}，返回宣言`}
        >
          <Image
            src="/brand-sg-logo.png"
            alt=""
            width={36}
            height={36}
            className="h-9 w-9 shrink-0 object-contain"
            priority
          />
          <span className="flex items-baseline gap-1.5">
            <span>Surfer</span>
            <span>Garage</span>
          </span>
        </a>

        {/* 右 nav + CTA — flex-start，整体向中心靠拢 */}
        <div className="flex items-center justify-start gap-7 lg:gap-9">
          <nav
            className="flex items-center gap-7 font-[family-name:var(--font-zh)] text-[13px] font-medium tracking-[0.12em] lg:gap-9"
            aria-label="主导航 · 右"
          >
            {rightNavItems.map((item) => (
              <DesktopNavLink
                key={item.href}
                href={item.href}
                labelZh={item.labelZh}
              />
            ))}
          </nav>

          {/* JOIN CTA — magnet hover */}
          <a
            href={HEADER_CTA_HREF}
            onClick={(e) => handleAnchorClick(e, HEADER_CTA_HREF)}
            data-magnet
            className="group ml-3 inline-flex shrink-0 items-center gap-2 rounded-sm border border-[color-mix(in_oklch,var(--brand-teal)_45%,transparent)] bg-[color-mix(in_oklch,var(--brand-teal)_10%,transparent)] px-4 py-2 font-[family-name:var(--font-en)] text-[10.5px] font-medium uppercase tracking-[0.18em] text-[var(--foreground)] transition-[background-color,border-color] duration-200 hover:border-[var(--brand-teal)] hover:bg-[color-mix(in_oklch,var(--brand-teal)_18%,transparent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-teal)]/55"
            aria-label="加入 SurferGarage 社群"
          >
            <span className="sg-magnet-target inline-flex items-center gap-2">
              <span>Join the Garage</span>
              <span
                aria-hidden
                className="font-[family-name:var(--font-en)] text-[var(--brand-teal)] transition-transform duration-200 group-hover:translate-x-0.5"
              >
                ↗
              </span>
            </span>
          </a>
        </div>
      </div>

      {/* Progress hairline */}
      <span aria-hidden className="sg-header-progress" />

      {/* Mobile drawer */}
      <div
        id={drawerId}
        aria-hidden={!open}
        className={`fixed inset-x-0 top-[3.6rem] z-[39] md:hidden ${
          open ? "pointer-events-auto" : "pointer-events-none"
        }`}
      >
        <div
          className={`absolute inset-x-0 top-0 origin-top bg-[color-mix(in_oklch,var(--paper-1)_94%,transparent)] backdrop-blur-md transition-all duration-300 ease-out ${
            open ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0"
          }`}
        >
          <nav
            className={`${SG_PAGE_SHELL_CLASS} flex flex-col gap-1 py-6`}
            aria-label="移动主导航"
          >
            {SITE_PRIMARY_NAV.map((item, i) => {
              const id = item.href.replace(/^#/, "");
              const isActive = activeId === id;
              return (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={(e) => handleAnchorClick(e, item.href)}
                  className={`flex items-center justify-between border-b border-[var(--hairline-soft)] py-4 font-[family-name:var(--font-zh)] text-[18px] font-medium leading-none tracking-[0.04em] transition-colors hover:text-[var(--foreground)] ${
                    isActive
                      ? "text-[var(--foreground)]"
                      : "text-[var(--muted-strong)]"
                  }`}
                >
                  <span className="flex items-baseline gap-3">
                    <span className="editorial-mono text-[10px] text-[var(--muted)]">
                      §{String(i + 1).padStart(2, "0")}
                    </span>
                    <span>{item.labelZh}</span>
                  </span>
                  <span aria-hidden className="text-[var(--muted)]">
                    {isActive ? "·" : "→"}
                  </span>
                </a>
              );
            })}
          </nav>
        </div>
        {/* Scrim */}
        <button
          type="button"
          aria-hidden
          tabIndex={-1}
          onClick={close}
          className={`absolute inset-x-0 top-0 -z-[1] h-[100svh] bg-black/55 transition-opacity duration-300 ${
            open ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
        />
      </div>
    </header>
  );
}
