"use client";

import { SITE_NAME } from "@/lib/site-metadata";
import { SITE_PRIMARY_NAV } from "@/lib/site-nav";
import { SG_PAGE_SHELL_CLASS } from "@/lib/sg-layout";
import { useAnchorNav } from "@/lib/use-anchor-nav";
import Image from "next/image";
import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";

/** 入口 CTA 主操作：直接落到故事提交规则。 */
const HEADER_CTA_HREF = "#call-join";

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
        if (bestId) setActive((prev) => (prev === bestId ? prev : bestId));
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
  const sectionIds = useMemo(
    () => SITE_PRIMARY_NAV.map((n) => n.href.replace(/^#/, "")),
    [],
  );
  const activeId = useActiveSection(sectionIds);
  const [open, setOpen] = useState(false);
  const drawerId = useId();
  const drawerRef = useRef<HTMLDivElement>(null);
  const close = useCallback(() => setOpen(false), []);
  const handleAnchorClick = useAnchorNav(close);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    const preventBackgroundScroll = (event: Event) => event.preventDefault();
    document.addEventListener("keydown", onKey);
    document.addEventListener("wheel", preventBackgroundScroll, {
      passive: false,
    });
    document.addEventListener("touchmove", preventBackgroundScroll, {
      passive: false,
    });

    const firstLink =
      drawerRef.current?.querySelector<HTMLElement>("nav a[href]");
    firstLink?.focus({ preventScroll: true });

    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("wheel", preventBackgroundScroll);
      document.removeEventListener("touchmove", preventBackgroundScroll);
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
    <header className="sg-header-depth sticky top-0 z-30 border-b border-[color-mix(in_oklch,var(--hairline)_85%,transparent)] bg-[color-mix(in_oklch,var(--paper-1)_88%,transparent)] backdrop-blur-md pt-[env(safe-area-inset-top)]">
      {/* —— Mobile（< md）—— logo 左、hamburger 右 */}
      <div
        className={`flex items-center justify-between gap-4 py-3 md:hidden ${SG_PAGE_SHELL_CLASS}`}
      >
        <a
          href="#manifesto"
          onClick={(e) => handleAnchorClick(e, "#manifesto")}
          className="flex items-center gap-3 rounded-sm font-[family-name:var(--font-zh)] text-[15px] font-medium text-[var(--foreground)]"
          aria-label={`${SITE_NAME}，返回首页`}
        >
          <Image
            src="/brand-sg-logo.png"
            alt=""
            width={36}
            height={36}
            className="h-9 w-9 shrink-0 object-contain"
            priority
          />
          <span className="hidden sm:inline">浪前</span>
        </a>

        <div className="flex items-center gap-2">
          <a
            href={HEADER_CTA_HREF}
            onClick={(e) => handleAnchorClick(e, HEADER_CTA_HREF)}
            data-magnet
            className="group inline-flex min-h-11 shrink-0 items-center gap-1.5 rounded-sm border border-[color-mix(in_oklch,var(--brand-teal)_45%,transparent)] bg-[color-mix(in_oklch,var(--brand-teal)_10%,transparent)] px-3 py-2 font-[family-name:var(--font-zh)] text-[14px] font-medium text-[var(--foreground)]"
            aria-label="提交故事"
          >
            <span className="sg-magnet-target inline-flex items-center gap-1.5">
              <span>提交</span>
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
            className="inline-flex h-11 w-11 items-center justify-center rounded-sm border border-[var(--hairline)] bg-[rgba(15,17,22,0.55)]"
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
          className="flex items-center justify-end gap-8 font-[family-name:var(--font-zh)] text-[15px] font-medium lg:gap-10 lg:text-[16px]"
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
          className="group flex shrink-0 items-center gap-3 rounded-sm px-4 font-[family-name:var(--font-zh)] text-[15px] font-medium text-[var(--foreground)] transition-opacity hover:opacity-90"
          aria-label={`${SITE_NAME}，返回首页`}
        >
          <Image
            src="/brand-sg-logo.png"
            alt=""
            width={36}
            height={36}
            className="h-9 w-9 shrink-0 object-contain"
            priority
          />
          <span>浪前</span>
        </a>

        {/* 右 nav + CTA — flex-start，整体向中心靠拢 */}
        <div className="flex items-center justify-start gap-7 lg:gap-9">
          <nav
            className="flex items-center gap-8 font-[family-name:var(--font-zh)] text-[15px] font-medium lg:gap-10 lg:text-[16px]"
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
            className="group ml-3 inline-flex shrink-0 items-center gap-2 rounded-sm border border-[color-mix(in_oklch,var(--brand-teal)_45%,transparent)] bg-[color-mix(in_oklch,var(--brand-teal)_10%,transparent)] px-4 py-2 font-[family-name:var(--font-zh)] text-[14px] font-medium text-[var(--foreground)] transition-[background-color,border-color] duration-200 hover:border-[var(--brand-teal)] hover:bg-[color-mix(in_oklch,var(--brand-teal)_18%,transparent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-teal)]/55"
            aria-label="提交故事"
          >
            <span className="sg-magnet-target inline-flex items-center gap-2">
              <span>提交故事</span>
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
        ref={drawerRef}
        data-lenis-prevent
        aria-hidden={!open}
        className={`fixed inset-x-0 top-[calc(3.25rem+env(safe-area-inset-top))] z-[39] touch-none overscroll-none md:hidden ${
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
            {SITE_PRIMARY_NAV.map((item) => {
              const id = item.href.replace(/^#/, "");
              const isActive = activeId === id;
              return (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={(e) => handleAnchorClick(e, item.href)}
                  tabIndex={open ? 0 : -1}
                  className={`flex items-center justify-between border-b border-[var(--hairline-soft)] py-4 font-[family-name:var(--font-zh)] text-[19px] font-medium leading-none transition-colors hover:text-[var(--foreground)] ${
                    isActive
                      ? "text-[var(--foreground)]"
                      : "text-[var(--muted-strong)]"
                  }`}
                >
                  <span>{item.labelZh}</span>
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
