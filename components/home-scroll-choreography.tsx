"use client";

import "@/components/motion/gsap-register";
import { useEffect, useLayoutEffect, useState } from "react";
import { ScrollTrigger } from "@/components/motion/gsap-register";
import { registerCallReveal } from "@/components/motion/register-call-reveal";
import { registerDesktopPins } from "@/components/motion/register-desktop-pins";
import { registerFoundersIntro } from "@/components/motion/register-founders-intro";
import { registerGithubRepoCards } from "@/components/motion/register-github-repo-cards";
import { registerHeroChoreography } from "@/components/motion/register-hero-choreography";
import { registerManifestoScroll } from "@/components/motion/register-manifesto-scroll";
import { registerProofStreams } from "@/components/motion/register-proof-streams";
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
      return;
    }

    const manifestoRight = document.querySelector<HTMLElement>(
      "[data-manifesto-right]",
    );
    const manifestoPin = document.querySelector<HTMLElement>(
      "[data-manifesto-pin]",
    );
    const heroScrub = document.querySelector<HTMLElement>("[data-hero-scrub]");
    const heroWave = document.querySelector<HTMLElement>("[data-hero-wave]");
    const heroMarquee = document.querySelector<HTMLElement>("[data-hero-marquee]");
    const proof = document.querySelector<HTMLElement>("#proof");
    const proofPin = document.querySelector<HTMLElement>("[data-proof-pin]");
    const proofStreams = document.querySelector<HTMLElement>(
      "[data-proof-streams]",
    );
    const callSection = document.querySelector<HTMLElement>("#call");

    const ctx = gsap.context(() => {
      registerManifestoScroll(ST_MARKERS);
      registerHeroChoreography(ST_MARKERS, {
        heroScrub,
        heroWave,
        heroMarquee,
        proof,
      });
      registerProofStreams(ST_MARKERS);
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
        proof,
        proofPin,
        proofStreams,
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
