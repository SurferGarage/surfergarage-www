"use client";

import { useLenis } from "@/components/lenis-context";
import { useCallback, type MouseEvent } from "react";

/** 站内 hash 锚点：即时跳转，并精确扣除 sticky 顶栏高度。 */
export function useAnchorNav(onAfterNav?: () => void) {
  const lenis = useLenis();

  return useCallback(
    (e: MouseEvent<HTMLAnchorElement>, href: string) => {
      if (!href.startsWith("#")) return;
      const id = href.slice(1);
      const target = document.getElementById(id);
      if (!target) {
        if (typeof window !== "undefined" && window.location.pathname !== "/") {
          e.preventDefault();
          window.location.assign(`/${href}`);
        }
        return;
      }
      e.preventDefault();

      const headerHeight =
        document.querySelector<HTMLElement>("[data-site-header]")
          ?.getBoundingClientRect().height ?? 64;
      const destination =
        target.getBoundingClientRect().top +
        window.scrollY -
        Math.ceil(headerHeight + 1);

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

      if (typeof window !== "undefined") {
        window.history.replaceState(null, "", href);
        window.requestAnimationFrame(() => {
          window.dispatchEvent(new Event("scroll"));
        });
      }

      onAfterNav?.();
    },
    [lenis, onAfterNav],
  );
}
