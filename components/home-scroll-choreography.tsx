"use client";

import "@/components/motion/gsap-register";
import { useEffect, useLayoutEffect, useState } from "react";
import { ScrollTrigger } from "@/components/motion/gsap-register";
import { registerCallReveal } from "@/components/motion/register-call-reveal";
import { registerDesktopPins } from "@/components/motion/register-desktop-pins";
import { registerGlobalDepthScrub } from "@/components/motion/register-global-depth-scrub";
import { registerFoundersIntro } from "@/components/motion/register-founders-intro";
import { registerGithubRepoCards } from "@/components/motion/register-github-repo-cards";
import { registerHeroChoreography } from "@/components/motion/register-hero-choreography";
import { registerManifestoScroll } from "@/components/motion/register-manifesto-scroll";
import { registerSocialExpand } from "@/components/motion/register-social-expand";
import gsap from "gsap";

const ST_MARKERS =
  typeof process !== "undefined" &&
  process.env.NEXT_PUBLIC_GSAP_DEBUG === "1";

export function HomeScrollChoreography() {
  const [reduced, setReduced] = useState<boolean | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useLayoutEffect(() => {
    if (reduced === null) return;

    if (reduced) {
      document.documentElement.style.setProperty("--depth-t", "0");
      return () => {
        document.documentElement.style.removeProperty("--depth-t");
      };
    }

    const manifestoRight = document.querySelector<HTMLElement>(
      "[data-manifesto-right]",
    );
    const manifestoPin = document.querySelector<HTMLElement>(
      "[data-manifesto-pin]",
    );
    const heroScrub = document.querySelector<HTMLElement>("[data-hero-scrub]");
    const heroWave = document.querySelector<HTMLElement>("[data-hero-wave]");
    const socialSection = document.querySelector<HTMLElement>("#social");
    const callSection = document.querySelector<HTMLElement>("#call");

    const ctx = gsap.context(() => {
      registerGlobalDepthScrub(ST_MARKERS);
      registerManifestoScroll(ST_MARKERS);
      registerHeroChoreography(ST_MARKERS, {
        heroScrub,
        heroWave,
        waveCalmTrigger: socialSection,
      });
      registerFoundersIntro(ST_MARKERS);
      registerGithubRepoCards(ST_MARKERS);
      registerSocialExpand(ST_MARKERS);
      registerCallReveal(ST_MARKERS, callSection);
    });

    const mm = gsap.matchMedia();
    mm.add("(min-width: 768px)", () => {
      registerDesktopPins(ST_MARKERS, {
        manifestoPin,
        manifestoRight,
      });
    });

    ScrollTrigger.refresh();

    let resizeT: ReturnType<typeof setTimeout> | undefined;
    const onResize = () => {
      if (resizeT) clearTimeout(resizeT);
      resizeT = setTimeout(() => {
        resizeT = undefined;
        ScrollTrigger.refresh();
      }, 120);
    };
    window.addEventListener("resize", onResize);

    let fontsCancelled = false;
    void document.fonts?.ready?.then(() => {
      if (!fontsCancelled) ScrollTrigger.refresh();
    });

    return () => {
      fontsCancelled = true;
      window.removeEventListener("resize", onResize);
      if (resizeT) clearTimeout(resizeT);
      mm.revert();
      ctx.revert();
    };
  }, [reduced]);

  return null;
}
