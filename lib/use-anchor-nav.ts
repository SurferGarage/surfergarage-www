"use client";

import { useLenis } from "@/components/lenis-context";
import type Lenis from "lenis";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, type MouseEvent } from "react";

function getHashTarget(href: string): HTMLElement | null {
  if (!href.startsWith("#") || href.length < 2) return null;

  let id = href.slice(1);
  try {
    id = decodeURIComponent(id);
  } catch {
    // Keep the literal id when the hash contains malformed escape sequences.
  }

  return document.getElementById(id);
}

/** Align a hash target immediately below the sticky site header. */
export function scrollToHashTarget(
  href: string,
  lenis: Lenis | null,
  options: { smooth?: boolean; focus?: boolean } = {},
): boolean {
  if (typeof window === "undefined") return false;
  const target = getHashTarget(href);
  if (!target) return false;

  const headerHeight =
    document
      .querySelector<HTMLElement>("[data-site-header]")
      ?.getBoundingClientRect().height ?? 64;
  const destination = Math.max(
    0,
    target.getBoundingClientRect().top +
      window.scrollY -
      Math.ceil(headerHeight + 1),
  );
  const smooth =
    options.smooth &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (lenis) {
    lenis.scrollTo(destination, {
      immediate: !smooth,
      duration: smooth ? 0.8 : undefined,
      force: true,
    });
  } else {
    const root = document.documentElement;
    const previousScrollBehavior = root.style.scrollBehavior;
    if (!smooth) root.style.scrollBehavior = "auto";
    window.scrollTo({ top: destination, behavior: smooth ? "smooth" : "auto" });
    root.style.scrollBehavior = previousScrollBehavior;
  }

  if (options.focus) {
    const focusTarget =
      target.querySelector<HTMLElement>("h1, h2, h3") ?? target;
    const hadTabIndex = focusTarget.hasAttribute("tabindex");
    if (!hadTabIndex) focusTarget.setAttribute("tabindex", "-1");
    focusTarget.focus({ preventScroll: true });
    if (!hadTabIndex) focusTarget.removeAttribute("tabindex");
  }

  window.requestAnimationFrame(() => {
    window.dispatchEvent(new Event("scroll"));
  });
  return true;
}

/** Restore cold-load and browser-history hashes after React hydration. */
export function useHashNavigationAlignment() {
  const lenis = useLenis();
  const pathname = usePathname();

  useEffect(() => {
    let firstFrame = 0;
    let secondFrame = 0;

    const alignCurrentHash = () => {
      if (!window.location.hash) return;
      scrollToHashTarget(window.location.hash, lenis);
    };

    firstFrame = window.requestAnimationFrame(() => {
      secondFrame = window.requestAnimationFrame(alignCurrentHash);
    });
    window.addEventListener("hashchange", alignCurrentHash);
    window.addEventListener("popstate", alignCurrentHash);

    return () => {
      window.cancelAnimationFrame(firstFrame);
      window.cancelAnimationFrame(secondFrame);
      window.removeEventListener("hashchange", alignCurrentHash);
      window.removeEventListener("popstate", alignCurrentHash);
    };
  }, [lenis, pathname]);
}

/** 只接管普通同页点击；跨页与新窗口行为交由链接本身处理。 */
export function useAnchorNav(onAfterNav?: () => void) {
  const lenis = useLenis();

  return useCallback(
    (e: MouseEvent<HTMLAnchorElement>, href: string) => {
      if (
        e.defaultPrevented ||
        e.button !== 0 ||
        e.metaKey || e.ctrlKey || e.shiftKey || e.altKey ||
        (e.currentTarget.target && e.currentTarget.target !== "_self") ||
        e.currentTarget.hasAttribute("download")
      ) return;

      const destination = new URL(href, window.location.href);
      if (destination.origin !== window.location.origin) return;
      onAfterNav?.();
      if (
        destination.pathname !== window.location.pathname ||
        !getHashTarget(destination.hash)
      ) return;

      e.preventDefault();
      const nextHref = `${destination.pathname}${destination.search}${destination.hash}`;
      if (nextHref !== `${window.location.pathname}${window.location.search}${window.location.hash}`) {
        window.history.pushState(window.history.state, "", nextHref);
      }
      scrollToHashTarget(destination.hash, lenis, { smooth: true, focus: true });
    },
    [lenis, onAfterNav],
  );
}
