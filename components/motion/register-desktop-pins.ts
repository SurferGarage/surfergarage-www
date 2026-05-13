import { gsap, ScrollTrigger } from "@/components/motion/gsap-register";

export type DesktopPinsRefs = {
  manifestoPin: HTMLElement | null;
  manifestoRight: HTMLElement | null;
  proof: HTMLElement | null;
  proofPin: HTMLElement | null;
  proofStreams: HTMLElement | null;
};

export function registerDesktopPins(
  markers: boolean,
  refs: DesktopPinsRefs,
): void {
  const { manifestoPin, manifestoRight, proof, proofPin, proofStreams } = refs;

  if (manifestoPin && manifestoRight) {
    ScrollTrigger.create({
      trigger: manifestoRight,
      start: "top 10%",
      end: "bottom bottom",
      pin: manifestoPin,
      pinSpacing: true,
      markers,
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
      markers,
      id: "proof-pin",
    });
  }

  const founderPanels = gsap.utils.toArray<HTMLElement>("[data-founder-panel]");
  founderPanels.forEach((panel, i) => {
    const card = panel.querySelector<HTMLElement>("[data-founder-card]");
    if (!card) return;
    gsap.fromTo(
      card,
      { scale: 1, y: 0 },
      {
        scale: 0.9,
        y: -40,
        ease: "none",
        scrollTrigger: {
          trigger: panel,
          start: "top top",
          end: "+=115%",
          pin: true,
          scrub: 0.45,
          anticipatePin: 1,
          markers,
          id: `founder-stack-${i}`,
        },
      },
    );
  });
}
