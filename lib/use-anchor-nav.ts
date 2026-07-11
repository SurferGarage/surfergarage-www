"use client";

import { useLenis } from "@/components/lenis-context";
import { useCallback, type MouseEvent } from "react";

/** 站内 hash 锚点：即时跳转（绕过 Lenis 平滑滚），与顶栏行为一致 */
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

      if (lenis) {
        lenis.scrollTo(target, { immediate: true, lock: true, force: true });
      } else {
        target.scrollIntoView({ behavior: "auto", block: "start" });
      }

      if (typeof window !== "undefined") {
        window.history.replaceState(null, "", href);
      }

      onAfterNav?.();
    },
    [lenis, onAfterNav],
  );
}
