import { gsap } from "@/components/motion/gsap-register";

/**
 * The Proof：左侧导语 + 右侧「舞台」clip-path 展开，与每条 stream 的 y stagger scrub 同轨，气质对齐 `social-expand`。
 */
export function registerProofStreams(markers: boolean): void {
  const proof = document.querySelector<HTMLElement>("#proof");
  const stage = document.querySelector<HTMLElement>("[data-proof-streams]");
  const intro = document.querySelector<HTMLElement>("[data-proof-intro]");
  const streams = gsap.utils.toArray<HTMLElement>("[data-proof-stream]");

  if (!proof || !stage) return;

  gsap.set(stage, { clipPath: "inset(0 9% 0 9%)" });
  if (intro) gsap.set(intro, { y: 22, opacity: 0.86 });
  if (streams.length) gsap.set(streams, { y: 26, opacity: 0.94 });

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: proof,
      start: "top 80%",
      end: "top 22%",
      scrub: 0.9,
      invalidateOnRefresh: true,
      markers,
      id: "proof-choreography",
    },
  });

  if (intro) {
    tl.to(
      intro,
      { y: 0, opacity: 1, ease: "none", duration: 1 },
      0,
    );
  }

  tl.to(
    stage,
    { clipPath: "inset(0 0% 0 0%)", ease: "none", duration: 1 },
    0,
  );

  if (streams.length) {
    tl.to(
      streams,
      {
        y: 0,
        opacity: 1,
        ease: "none",
        duration: 1,
        stagger: { each: 0.11 },
      },
      0,
    );
  }
}
