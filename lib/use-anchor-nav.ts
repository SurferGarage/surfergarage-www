"use client";

import { useLenis } from "@/components/lenis-context";
import type Lenis from "lenis";
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

  if (lenis) {
    lenis.scrollTo(destination, {
      immediate: true,
      lock: true,
      force: true,
    });
  } else {
    const root = document.documentElement;
    const previousScrollBehavior = root.style.scrollBehavior;
    root.style.scrollBehavior = "auto";
    window.scrollTo({ top: destination });
    root.style.scrollBehavior = previousScrollBehavior;
  }

  window.requestAnimationFrame(() => {
    window.dispatchEvent(new Event("scroll"));
  });
  return true;
}

/** Restore cold-load and browser-history hashes after React hydration. */
export function useHashNavigationAlignment() {
  const lenis = useLenis();

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

    return () => {
      window.cancelAnimationFrame(firstFrame);
      window.cancelAnimationFrame(secondFrame);
      window.removeEventListener("hashchange", alignCurrentHash);
    };
  }, [lenis]);
}

/** 站内 hash 锚点：即时跳转，并精确扣除 sticky 顶栏高度。 */
export function useAnchorNav(onAfterNav?: () => void) {
  const lenis = useLenis();

  return useCallback(
    (e: MouseEvent<HTMLAnchorElement>, href: string) => {
      if (!href.startsWith("#")) return;
      const target = getHashTarget(href);
      if (!target) {
        if (typeof window !== "undefined" && window.location.pathname !== "/") {
          e.preventDefault();
          window.location.assign(`/${href}`);
        }
        return;
      }
      e.preventDefault();
      scrollToHashTarget(href, lenis);

      if (typeof window !== "undefined") {
        window.history.replaceState(null, "", href);
      }

      onAfterNav?.();
    },
    [lenis, onAfterNav],
  );
}
