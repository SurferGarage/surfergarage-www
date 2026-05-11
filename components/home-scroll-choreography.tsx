"use client";

import { useEffect, useLayoutEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

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
    const callItems = gsap.utils.toArray<HTMLElement>("[data-call-item]");

    const ctx = gsap.context(() => {
      gsap.from("[data-hero-reveal]", {
        y: 28,
        duration: 0.95,
        stagger: 0.06,
        ease: "power3.out",
        delay: 0.06,
      });

      if (heroScrub) {
        gsap.fromTo(
          heroScrub,
          { y: 10 },
          {
            y: 0,
            ease: "none",
            scrollTrigger: {
              trigger: heroScrub,
              start: "top 88%",
              end: "top 48%",
              scrub: true,
              markers: ST_MARKERS,
              id: "manifesto-scrub",
            },
          },
        );
      }

      if (heroWave && proof) {
        gsap.to(heroWave, {
          "--wave-distortion": 0.08,
          "--wave-opacity": 0.12,
          ease: "none",
          scrollTrigger: {
            trigger: proof,
            start: "top 95%",
            end: "top 40%",
            scrub: true,
            markers: ST_MARKERS,
            id: "hero-wave-calm",
          },
        });
      }

      if (heroMarquee && proof) {
        gsap.to(heroMarquee, {
          yPercent: 115,
          clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
          ease: "none",
          scrollTrigger: {
            trigger: proof,
            start: "top 98%",
            end: "top 45%",
            scrub: true,
            markers: ST_MARKERS,
            id: "hero-marquee-out",
          },
        });
      }

      document.querySelectorAll<HTMLElement>("[data-proof-stream]").forEach(
        (el) => {
          gsap.from(el, {
            y: 20,
            duration: 0.62,
            ease: "power2.out",
            scrollTrigger: {
              trigger: el,
              start: "top 90%",
              toggleActions: "play none none reverse",
            },
          });
        },
      );

      if (callSection && callItems.length) {
        gsap.fromTo(
          callItems,
          {
            clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
            y: 40,
          },
          {
            clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
            y: 0,
            duration: 1.2,
            ease: "expo.out",
            stagger: 0.15,
            scrollTrigger: {
              trigger: callSection,
              start: "top 85%",
              toggleActions: "play none none reverse",
              markers: ST_MARKERS,
              id: "call-reveal",
            },
          },
        );
      }
    });

    const mm = gsap.matchMedia();
    mm.add("(min-width: 768px)", () => {
      if (manifestoPin && manifestoRight) {
        ScrollTrigger.create({
          trigger: manifestoRight,
          start: "top 10%",
          end: "bottom bottom",
          pin: manifestoPin,
          pinSpacing: true,
          markers: ST_MARKERS,
          id: "manifesto-pin",
        });
      }

      if (proof && proofPin && proofStreams) {
        ScrollTrigger.create({
          trigger: proof,
          start: "center center",
          endTrigger: proofStreams,
          end: "bottom bottom",
          pin: proofPin,
          pinSpacing: true,
          markers: ST_MARKERS,
          id: "proof-pin",
        });
      }
    });

    ScrollTrigger.refresh();

    return () => {
      mm.revert();
      ctx.revert();
    };
  }, [reduced]);

  return null;
}
