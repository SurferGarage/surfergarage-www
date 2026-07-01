"use client";

import { gsap } from "@/components/motion/gsap-register";
import { useEffect } from "react";

const HERO_SELECTOR = "[data-hero-wave]";
/** Hero 几乎离开视口后暂停全页装饰动画（blur 光河等），回到 Hero 自动恢复 */
const HERO_PAUSE_RATIO = 0.1;

function syncDocHidden(): void {
  const hidden = document.hidden;
  document.documentElement.toggleAttribute("data-doc-hidden", hidden);
  if (hidden) gsap.ticker.sleep();
  else gsap.ticker.wake();
}

function syncHeroAtmospherePaused(intersecting: boolean, ratio: number): void {
  const paused = !intersecting || ratio < HERO_PAUSE_RATIO;
  document.documentElement.toggleAttribute("data-sg-atmosphere-paused", paused);
}

/** 零视觉影响的运行时节能：隐藏标签 / Hero 离屏时暂停装饰动画与部分 JS 更新 */
export function SgPerformanceGuards() {
  useEffect(() => {
    syncDocHidden();
    document.addEventListener("visibilitychange", syncDocHidden);

    let heroIo: IntersectionObserver | undefined;
    let observed: Element | null = null;

    const attachHeroIo = () => {
      const hero = document.querySelector<HTMLElement>(HERO_SELECTOR);
      if (!hero || hero === observed) return;
      heroIo?.disconnect();
      observed = hero;
      heroIo = new IntersectionObserver(
        (entries) => {
          const e = entries[0];
          if (!e) return;
          syncHeroAtmospherePaused(e.isIntersecting, e.intersectionRatio);
        },
        { root: null, threshold: [0, HERO_PAUSE_RATIO, 0.2] },
      );
      heroIo.observe(hero);
    };

    attachHeroIo();
    const domMo = new MutationObserver(() => {
      attachHeroIo();
      if (observed) domMo.disconnect();
    });
    domMo.observe(document.documentElement, { childList: true, subtree: true });

    return () => {
      document.removeEventListener("visibilitychange", syncDocHidden);
      domMo.disconnect();
      heroIo?.disconnect();
      observed = null;
      document.documentElement.removeAttribute("data-doc-hidden");
      document.documentElement.removeAttribute("data-sg-atmosphere-paused");
    };
  }, []);

  return null;
}

/** 供 Client 组件读取：是否应暂停水下氛围 JS 更新 */
export function isSgAtmospherePaused(): boolean {
  if (typeof document === "undefined") return false;
  return (
    document.hidden ||
    document.documentElement.hasAttribute("data-sg-atmosphere-paused")
  );
}
