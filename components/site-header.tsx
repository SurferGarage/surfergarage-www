"use client";

import { SITE_NAME } from "@/lib/site-metadata";
import { SITE_PRIMARY_NAV } from "@/lib/site-nav";
import { SG_PAGE_SHELL_CLASS } from "@/lib/sg-layout";
import { useAnchorNav } from "@/lib/use-anchor-nav";
import { useCallback, useEffect, useId, useMemo, useState } from "react";

/** 入口 CTA 主操作：直接落到故事提交规则。 */
const HEADER_CTA_HREF = "#call-join";

const navLinkClass =
  "group relative inline-flex h-16 shrink-0 items-center px-4 text-[var(--muted-strong)] transition-colors hover:text-[var(--foreground)] focus-visible:text-[var(--foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--brand-teal)]/45";

const navLinkActiveClass = "text-[var(--foreground)]";

/** 当前栏目使用一段信号线，避免装饰性圆点。 */
function ActiveRail({ active }: { active: boolean }) {
  return (
    <span
      aria-hidden
      className={`pointer-events-none absolute inset-x-3 bottom-0 h-0.5 origin-left bg-[var(--brand-teal)] transition-transform duration-200 ${
        active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-50"
      }`}
    />
  );
}

function BrandLockup() {
  return (
    <span className="flex min-w-0 flex-col justify-center leading-none">
      <span className="font-[family-name:var(--font-zh)] text-[18px] font-medium text-[var(--foreground)]">
        浪前
      </span>
      <span className="mt-1 hidden font-[family-name:var(--font-mono)] text-[9px] uppercase text-[var(--muted)] sm:block">
        Surfer Garage
      </span>
    </span>
  );
}

/** 以顶栏下方的阅读线跟踪当前栏目，确保点击定位后立即匹配。 */
function useActiveSection(sectionIds: readonly string[]) {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (!sections.length) return;

    let frame = 0;

    const update = () => {
      frame = 0;
      const headerHeight =
        document.querySelector<HTMLElement>("[data-site-header]")
          ?.getBoundingClientRect().height ?? 64;
      const readingLine = headerHeight + Math.min(window.innerHeight * 0.16, 120);
      let current: string | null = null;

      sections.forEach((section) => {
        if (section.getBoundingClientRect().top <= readingLine) {
          current = section.id;
        }
      });

      setActive((previous) => (previous === current ? previous : current));
    };

    const scheduleUpdate = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);

    return () => {
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      if (frame) window.cancelAnimationFrame(frame);
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

    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("wheel", preventBackgroundScroll);
      document.removeEventListener("touchmove", preventBackgroundScroll);
    };
  }, [open, close]);

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
        <span>{labelZh}</span>
        <ActiveRail active={isActive} />
      </a>
    );
  }

  return (
    <header
      data-site-header
      className="sg-header-depth sticky top-0 z-30 border-b border-[color-mix(in_oklch,var(--hairline)_85%,transparent)] bg-[color-mix(in_oklch,var(--paper-1)_88%,transparent)] pt-[env(safe-area-inset-top)] backdrop-blur-md"
    >
      {/* Mobile / tablet: brand left, menu right. */}
      <div
        className={`flex h-16 items-center justify-between gap-4 lg:hidden ${SG_PAGE_SHELL_CLASS}`}
      >
        <a
          href="#manifesto"
          onClick={(e) => handleAnchorClick(e, "#manifesto")}
          className="flex h-full items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--brand-teal)]/45"
          aria-label={`${SITE_NAME}，返回首页`}
        >
          <BrandLockup />
        </a>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls={drawerId}
          aria-label={open ? "关闭主导航" : "打开主导航"}
          className="inline-flex h-11 w-11 items-center justify-center border-l border-[var(--hairline)] bg-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--brand-teal)]/45"
        >
          <HamburgerIcon open={open} />
        </button>
      </div>

      {/* Desktop editorial signal rail. */}
      <div
        className={`hidden h-16 grid-cols-12 items-stretch lg:grid ${SG_PAGE_SHELL_CLASS}`}
      >
        <a
          href="#manifesto"
          onClick={(e) => handleAnchorClick(e, "#manifesto")}
          className="col-span-3 flex h-16 items-center border-r border-[var(--hairline-soft)] pr-6 transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--brand-teal)]/45"
          aria-label={`${SITE_NAME}，返回首页`}
        >
          <BrandLockup />
        </a>

        <nav
          className="col-span-6 flex h-16 items-center justify-center font-[family-name:var(--font-zh)] text-[14px] font-medium xl:gap-2"
          aria-label="主导航"
        >
          {SITE_PRIMARY_NAV.map((item) => (
            <DesktopNavLink
              key={item.href}
              href={item.href}
              labelZh={item.labelZh}
            />
          ))}
        </nav>

        <div className="col-span-3 flex h-16 items-stretch justify-end border-l border-[var(--hairline-soft)]">
          <a
            href={HEADER_CTA_HREF}
            onClick={(e) => handleAnchorClick(e, HEADER_CTA_HREF)}
            data-magnet
            className="group inline-flex h-16 shrink-0 items-center gap-3 border-l border-[var(--hairline-soft)] px-5 font-[family-name:var(--font-zh)] text-[14px] font-medium text-[var(--foreground)] transition-colors duration-200 hover:bg-[var(--brand-primary)] focus-visible:bg-[var(--brand-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--brand-teal)]/55 xl:px-6"
            aria-label="提交故事"
          >
            <span className="sg-magnet-target inline-flex items-center gap-3">
              <span>提交故事</span>
              <span
                aria-hidden
                className="font-[family-name:var(--font-en)] text-[var(--brand-teal)] transition-[color,transform] duration-200 group-hover:translate-x-0.5 group-hover:text-white"
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
        data-lenis-prevent
        aria-hidden={!open}
        className={`fixed inset-x-0 top-[calc(4rem+env(safe-area-inset-top))] z-[39] touch-none overscroll-none lg:hidden ${
          open ? "pointer-events-auto" : "pointer-events-none"
        }`}
      >
        <div
          className={`absolute inset-x-0 top-0 origin-top bg-[color-mix(in_oklch,var(--paper-1)_94%,transparent)] backdrop-blur-md transition-all duration-300 ease-out ${
            open ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0"
          }`}
        >
          <nav
            className={`${SG_PAGE_SHELL_CLASS} flex flex-col py-6`}
            aria-label="移动主导航"
          >
            <a
              href={HEADER_CTA_HREF}
              onClick={(e) => handleAnchorClick(e, HEADER_CTA_HREF)}
              tabIndex={open ? 0 : -1}
              className="mb-5 flex min-h-12 items-center justify-between bg-[var(--brand-primary)] px-4 font-[family-name:var(--font-zh)] text-[16px] font-medium text-white"
            >
              <span>提交故事</span>
              <span aria-hidden>↗</span>
            </a>
            {SITE_PRIMARY_NAV.map((item) => {
              const id = item.href.replace(/^#/, "");
              const isActive = activeId === id;
              return (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={(e) => handleAnchorClick(e, item.href)}
                  tabIndex={open ? 0 : -1}
                  className={`flex items-center justify-between border-b border-[var(--hairline-soft)] py-4 font-[family-name:var(--font-zh)] text-[18px] font-medium leading-none transition-colors hover:text-[var(--foreground)] ${
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
