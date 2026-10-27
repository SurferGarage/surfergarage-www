"use client";

import { SiteAnchorLink } from "@/components/site-anchor-link";
import { useLenis } from "@/components/lenis-context";
import { SITE_NAME } from "@/lib/site-metadata";
import { SITE_HOME_HREF, SITE_PRIMARY_NAV, SITE_STORY_HREF } from "@/lib/site-nav";
import { SG_PAGE_SHELL_CLASS } from "@/lib/sg-layout";
import { useHashNavigationAlignment } from "@/lib/use-anchor-nav";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useId, useRef, useState, type KeyboardEvent } from "react";

const SECTION_IDS = SITE_PRIMARY_NAV.map((item) => item.href.split("#")[1]);
const navLinkClass =
  "group relative inline-flex h-16 shrink-0 items-center px-4 text-[var(--muted-strong)] transition-colors hover:text-[var(--foreground)] focus-visible:text-[var(--foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--brand-teal)]/60";

function BrandLockup() {
  return (
    <span className="flex min-w-0 flex-col justify-center leading-none">
      <span className="font-[family-name:var(--font-zh)] text-[20px] font-semibold tracking-[-0.04em] text-[var(--foreground)]">浪前</span>
      <span className="mt-1.5 font-[family-name:var(--font-mono)] text-[9px] uppercase tracking-[0.12em] text-[var(--muted)]">Surfer Garage</span>
    </span>
  );
}

/** 顶栏下的阅读线对应当前栏目；离开首页后清除高亮。 */
function useActiveSection() {
  const pathname = usePathname();
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    if (pathname !== "/") return;
    const sections = SECTION_IDS
      .map((id) => document.getElementById(id))
      .filter((element): element is HTMLElement => element !== null);
    let frame = 0;
    const update = () => {
      frame = 0;
      const headerHeight = document.querySelector<HTMLElement>("[data-site-header]")?.getBoundingClientRect().height ?? 64;
      const readingLine = headerHeight + Math.min(window.innerHeight * 0.16, 120);
      let current: string | null = null;
      let nearestTop = Number.NEGATIVE_INFINITY;
      for (const section of sections) {
        const top = section.getBoundingClientRect().top;
        if (top <= readingLine && top > nearestTop) {
          current = section.id;
          nearestTop = top;
        }
      }
      setActive((previous) => previous === current ? previous : current);
    };
    const scheduleUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);
    return () => {
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [pathname]);

  return pathname === "/" ? active : null;
}

function MenuIcon({ close = false }: { close?: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
      <path d={close ? "M5 5L17 17M17 5L5 17" : "M3 7H19M3 15H19"} />
    </svg>
  );
}

export function SiteHeader() {
  useHashNavigationAlignment();
  const lenis = useLenis();
  const activeId = useActiveSection();
  const [open, setOpen] = useState(false);
  const drawerRef = useRef<HTMLDialogElement>(null);
  const restoreScrollRef = useRef<(() => void) | null>(null);
  const drawerId = useId();
  const titleId = useId();
  const close = useCallback(() => {
    restoreScrollRef.current?.();
    restoreScrollRef.current = null;
    if (drawerRef.current?.open) drawerRef.current.close();
    setOpen(false);
  }, []);

  useEffect(() => {
    const drawer = drawerRef.current;
    if (!drawer) return;
    if (open && !drawer.open) {
      drawer.showModal();
      drawer.querySelector<HTMLAnchorElement>("nav a")?.focus();
    } else if (!open && drawer.open) {
      drawer.close();
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    const wasStopped = lenis?.isStopped ?? false;
    let restored = false;
    document.body.style.overflow = "hidden";
    lenis?.stop();
    const restoreScroll = () => {
      if (restored) return;
      restored = true;
      document.body.style.overflow = previousOverflow;
      if (!wasStopped) lenis?.start();
    };
    restoreScrollRef.current = restoreScroll;
    return () => {
      restoreScroll();
      if (restoreScrollRef.current === restoreScroll) restoreScrollRef.current = null;
    };
  }, [open, lenis]);

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 1024px)");
    const closeOnDesktop = () => {
      if (desktop.matches) close();
    };
    desktop.addEventListener("change", closeOnDesktop);
    return () => desktop.removeEventListener("change", closeOnDesktop);
  }, [close]);

  function handleDrawerKeyDown(event: KeyboardEvent<HTMLDialogElement>) {
    if (event.key !== "Tab" || event.altKey || event.ctrlKey || event.metaKey) return;
    const drawer = event.currentTarget;
    const controls = Array.from(drawer.querySelectorAll<HTMLElement>(
      "a[href], button, input, select, textarea, [tabindex]",
    )).filter((element) =>
      element.tabIndex >= 0 &&
      !element.matches(":disabled") &&
      !element.closest("[hidden], [inert], [aria-hidden='true']") &&
      element.getClientRects().length > 0 &&
      window.getComputedStyle(element).visibility !== "hidden",
    );
    const first = controls[0];
    const last = controls[controls.length - 1];
    if (!first || !last) return;
    const active = document.activeElement;
    if (event.shiftKey && (active === first || active === drawer)) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && (active === last || active === drawer)) {
      event.preventDefault();
      first.focus();
    }
  }

  return (
    <header data-site-header className="sg-header-depth sticky top-0 z-30 border-b border-[var(--hairline)] bg-[var(--paper-0)] pt-[env(safe-area-inset-top)]">
      <div className={"flex h-16 items-center justify-between gap-4 lg:hidden " + SG_PAGE_SHELL_CLASS}>
        <SiteAnchorLink href={SITE_HOME_HREF} onClick={close} className="flex h-full items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--brand-teal)]" aria-label={SITE_NAME + "，返回首页"}>
          <BrandLockup />
        </SiteAnchorLink>
        <button type="button" onClick={() => setOpen(true)} aria-expanded={open} aria-controls={drawerId} aria-haspopup="dialog" aria-label="打开主导航" className="inline-flex h-11 w-11 items-center justify-center border border-[var(--hairline)] text-[var(--foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-teal)]">
          <MenuIcon />
        </button>
      </div>

      <div className={"hidden h-16 grid-cols-12 items-stretch lg:grid " + SG_PAGE_SHELL_CLASS}>
        <SiteAnchorLink href={SITE_HOME_HREF} className="col-span-3 flex items-center border-r border-[var(--hairline-soft)] pr-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--brand-teal)]" aria-label={SITE_NAME + "，返回首页"}>
          <BrandLockup />
        </SiteAnchorLink>
        <nav className="col-span-6 flex items-center justify-center font-[family-name:var(--font-zh)] text-[14px] font-medium xl:gap-2" aria-label="主导航">
          {SITE_PRIMARY_NAV.map((item) => {
            const isActive = activeId === item.href.split("#")[1];
            return (
              <SiteAnchorLink key={item.href} href={item.href} className={navLinkClass + (isActive ? " text-[var(--foreground)]" : "")} aria-current={isActive ? "location" : undefined}>
                {item.labelZh}
                <span aria-hidden className={"pointer-events-none absolute inset-x-4 bottom-0 h-0.5 bg-[var(--brand-teal)] " + (isActive ? "opacity-100" : "opacity-0 group-hover:opacity-50")} />
              </SiteAnchorLink>
            );
          })}
        </nav>
        <div className="col-span-3 flex items-center justify-end border-l border-[var(--hairline-soft)] pl-5">
          <SiteAnchorLink href={SITE_STORY_HREF} className="group inline-flex min-h-10 items-center gap-5 bg-[var(--brand-primary)] px-5 text-[14px] font-medium text-white transition-colors hover:bg-[var(--brand-teal)] hover:text-[var(--paper-0)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-teal)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--paper-0)]">
            分享你的故事 <span aria-hidden>↗</span>
          </SiteAnchorLink>
        </div>
      </div>
      <span aria-hidden className="sg-header-progress" />

      <dialog ref={drawerRef} id={drawerId} aria-labelledby={titleId} onKeyDown={handleDrawerKeyDown} onCancel={(event) => { event.preventDefault(); close(); }} onClose={() => setOpen(false)} onClick={(event) => { if (event.target === event.currentTarget) close(); }} className="fixed inset-0 m-0 h-dvh max-h-none w-full max-w-none overflow-y-auto overscroll-contain border-0 bg-transparent p-0 text-[var(--foreground)] backdrop:bg-black/60 lg:hidden" data-lenis-prevent>
        <div className="border-b border-[var(--hairline)] bg-[var(--paper-0)] pt-[env(safe-area-inset-top)] shadow-xl">
          <div className={"flex h-16 items-center justify-between border-b border-[var(--hairline)] " + SG_PAGE_SHELL_CLASS}>
            <p id={titleId} className="text-[18px] font-medium">浪前 <span className="ml-2 font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.08em] text-[var(--muted)]">Navigation</span></p>
            <button type="button" onClick={close} aria-label="关闭主导航" className="inline-flex h-11 w-11 items-center justify-center border border-[var(--hairline)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-teal)]">
              <MenuIcon close />
            </button>
          </div>
          <nav className={SG_PAGE_SHELL_CLASS + " flex flex-col pb-8 pt-6"} aria-label="移动主导航">
            <SiteAnchorLink href={SITE_STORY_HREF} onClick={close} className="mb-5 flex min-h-12 items-center justify-between bg-[var(--brand-primary)] px-4 text-[16px] font-medium text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-teal)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--paper-0)]">
              分享你的故事 <span aria-hidden>↗</span>
            </SiteAnchorLink>
            {SITE_PRIMARY_NAV.map((item, index) => {
              const isActive = activeId === item.href.split("#")[1];
              return (
                <SiteAnchorLink key={item.href} href={item.href} onClick={close} aria-current={isActive ? "location" : undefined} className="group flex min-h-16 items-center justify-between border-b border-[var(--hairline)] py-4 text-[21px] font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--brand-teal)]">
                  <span><span aria-hidden className="mr-5 font-[family-name:var(--font-mono)] text-[11px] text-[var(--muted)]">0{index + 1}</span>{item.labelZh}</span>
                  <span aria-hidden className={isActive ? "text-[var(--brand-teal)]" : "text-[var(--muted)]"}>↗</span>
                </SiteAnchorLink>
              );
            })}
          </nav>
        </div>
      </dialog>
    </header>
  );
}
