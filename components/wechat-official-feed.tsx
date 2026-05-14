"use client";

import { gsap, ScrollTrigger } from "@/components/motion/gsap-register";
import { FOUNDER_WECHAT_PIN_END } from "@/lib/founder-wechat-pin-end";
import { WECHAT_OFFICIAL_FEED } from "@/lib/wechat-official-feed";
import Image from "next/image";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

const BASE_ROT_X = 12;
const MAX_ROT_X_POINTER = 4;
const LERP = 0.09;
/** 3D 幅度相对滚动进度晚一点起来：开头几乎平视，越往下越「张扬」 */
const TILT_ENV_EXPONENT = 1.38;

/** 相对视口中心的环抱弧（carousel）：左右 rotateY 对称，中间略抬、略推向镜头 */
const WRAP_ROT_Y = 22;
const WRAP_LIFT = 28;
const WRAP_Z = 20;

function syncCardTheaterArc(
  scroller: HTMLDivElement,
  envelope: number,
): void {
  if (envelope < 0.04) {
    scroller.querySelectorAll<HTMLElement>("[data-wechat-card]").forEach((el) => {
      el.style.transform = "translateZ(0px) translateY(0px) rotateY(0deg)";
    });
    return;
  }

  const sr = scroller.getBoundingClientRect();
  const midX = sr.left + sr.width / 2;
  /** 略小于半宽，让最靠边仍有一点弧度，避免「只有一侧在弯」 */
  const norm = Math.max(sr.width * 0.38, 120);

  scroller.querySelectorAll<HTMLElement>("[data-wechat-card]").forEach((el) => {
    const r = el.getBoundingClientRect();
    const cxRaw = (r.left + r.width / 2 - midX) / norm;
    const cx = Math.max(-1, Math.min(1, cxRaw));
    const w = 1 - cx * cx;
    const rotY = cx * WRAP_ROT_Y * envelope;
    const lift = -w * WRAP_LIFT * envelope;
    const tz = w * WRAP_Z * envelope;
    el.style.transform = `translateZ(${tz}px) translateY(${lift}px) rotateY(${rotY}deg)`;
  });
}

/**
 * 微信公众号 · 全宽「展台」：
 * - 桌面：ScrollTrigger **进度 → 横滑**；单卡 **以 scroller 视口中心为轴** 的环抱弧（对称 rotateY + 抛物线抬升），随 scrub 幅度渐强。
 * - 整层仅保留轻微 rotateX（进度 + 可选指针俯仰），**不再叠整层 rotateY/rotateZ**，避免与环抱弧打架成「斜弧」。
 */
export function WeChatOfficialFeed() {
  const stageRef = useRef<HTMLDivElement>(null);
  const tiltLayerRef = useRef<HTMLDivElement>(null);
  const zoneRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);

  const [reducedMotion, setReducedMotion] = useState(false);
  const pinProgressRef = useRef(0);
  const pointerInsideRef = useRef(false);
  const pointerCyRef = useRef(0);

  const targetTilt = useRef({ rx: 0, ry: 0, rz: 0 });
  const curTilt = useRef({ rx: 0, ry: 0, rz: 0 });
  const rafTilt = useRef<number | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => {
      const next = mq.matches;
      setReducedMotion(next);
      if (next) {
        ScrollTrigger.getById("wechat-feed-scrub-sync")?.kill();
        ScrollTrigger.refresh();
      }
    };
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useLayoutEffect(() => {
    const mqReduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (mqReduce) return;

    const panel = zoneRef.current?.closest<HTMLElement>("[data-founder-panel]");
    if (!panel) return;

    const mm = gsap.matchMedia();

    mm.add("(min-width: 768px)", () => {
      const syncScrollToProgress = (progress: number) => {
        pinProgressRef.current = progress;
        const el = scrollerRef.current;
        if (!el) return;
        const max = Math.max(0, el.scrollWidth - el.clientWidth);
        el.scrollLeft = progress * max;
        const env = progress ** TILT_ENV_EXPONENT;
        syncCardTheaterArc(el, env);
      };

      const st = ScrollTrigger.create({
        id: "wechat-feed-scrub-sync",
        trigger: panel,
        start: "top top",
        end: FOUNDER_WECHAT_PIN_END,
        invalidateOnRefresh: true,
        onUpdate(self) {
          syncScrollToProgress(self.progress);
        },
        onRefresh(self) {
          syncScrollToProgress(self.progress);
        },
      });

      const scroller = scrollerRef.current;
      const onImgLoad = () => {
        ScrollTrigger.refresh();
      };
      scroller?.addEventListener("load", onImgLoad, true);

      syncScrollToProgress(st.progress);

      return () => {
        scroller?.removeEventListener("load", onImgLoad, true);
        st.kill();
      };
    });

    ScrollTrigger.refresh();

    return () => {
      mm.revert();
    };
  }, []);

  const applyTiltTransform = useCallback((scale: number) => {
    const el = tiltLayerRef.current;
    if (!el) return;
    const { rx, ry, rz } = curTilt.current;
    el.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg) rotateZ(${rz}deg) scale3d(${scale},${scale},1)`;
  }, []);

  useEffect(() => {
    if (reducedMotion) {
      const el = tiltLayerRef.current;
      if (el) {
        el.style.transform =
          "rotateX(6deg) rotateY(0deg) rotateZ(0deg) scale3d(1,1,1)";
      }
      const sc = scrollerRef.current;
      if (sc) {
        sc.querySelectorAll<HTMLElement>("[data-wechat-card]").forEach((a) => {
          a.style.removeProperty("transform");
        });
      }
      return;
    }

    let cancelled = false;
    const loop = () => {
      if (cancelled) return;
      const rawP = Math.max(0, Math.min(1, pinProgressRef.current));
      const tiltEnv = rawP ** TILT_ENV_EXPONENT;
      const scale = 1 + 0.035 * tiltEnv;

      const inside = pointerInsideRef.current;
      const cy = pointerCyRef.current;

      let trx: number;
      if (!inside) {
        trx = BASE_ROT_X * tiltEnv;
      } else {
        trx = BASE_ROT_X * tiltEnv + cy * MAX_ROT_X_POINTER * tiltEnv;
      }
      /** 整层不再用 ry/rz，环抱完全交给单卡 theater 弧 */
      targetTilt.current = { rx: trx, ry: 0, rz: 0 };

      const tgt = targetTilt.current;
      const cur = curTilt.current;
      cur.rx += (tgt.rx - cur.rx) * LERP;
      cur.ry += (tgt.ry - cur.ry) * LERP;
      cur.rz += (tgt.rz - cur.rz) * LERP;
      applyTiltTransform(scale);

      const sc = scrollerRef.current;
      if (sc) {
        syncCardTheaterArc(sc, tiltEnv);
      }

      rafTilt.current = requestAnimationFrame(loop);
    };
    rafTilt.current = requestAnimationFrame(loop);
    return () => {
      cancelled = true;
      if (rafTilt.current != null) cancelAnimationFrame(rafTilt.current);
    };
  }, [reducedMotion, applyTiltTransform]);

  useEffect(() => {
    if (reducedMotion) return;

    const onPointerMove = (e: PointerEvent) => {
      const stage = stageRef.current;
      if (!stage) return;
      const r = stage.getBoundingClientRect();
      const inside =
        e.clientX >= r.left &&
        e.clientX <= r.right &&
        e.clientY >= r.top &&
        e.clientY <= r.bottom;
      pointerInsideRef.current = inside;
      if (!inside) return;

      const ny = (e.clientY - r.top - r.height / 2) / (r.height / 2);
      pointerCyRef.current = Math.max(-1, Math.min(1, ny));
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onPointerMove);
    };
  }, [reducedMotion]);

  useEffect(() => {
    if (reducedMotion) return;
    const el = scrollerRef.current;
    if (!el) return;

    const bump = () => {
      const rawP = pinProgressRef.current;
      const env = rawP ** TILT_ENV_EXPONENT;
      syncCardTheaterArc(el, env);
    };

    el.addEventListener("scroll", bump, { passive: true });
    window.addEventListener("resize", bump);
    requestAnimationFrame(bump);

    return () => {
      el.removeEventListener("scroll", bump);
      window.removeEventListener("resize", bump);
    };
  }, [reducedMotion]);

  return (
    <div className="mt-4 w-full md:mt-0">
      <p className="mb-4 max-w-[56rem] font-[family-name:var(--font-en)] text-[10px] uppercase tracking-[0.2em] text-[var(--muted)]">
        {reducedMotion
          ? "减少动效：请横向滑动浏览全部文章"
          : "向下滚动本屏：环抱弧随进度渐强；悬停在卡片上滚轮仍可正常翻页"}
      </p>

      <div className="relative left-1/2 w-screen max-w-[100vw] -translate-x-1/2 overflow-x-clip overflow-y-visible px-1 pb-16 pt-10 md:px-4 md:pb-28 md:pt-20">
        <div
          ref={stageRef}
          className="relative mx-auto w-full max-w-[100vw] [perspective:min(175vw,1750px)] [perspective-origin:50%_42%]"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-8 left-[8%] right-[8%] h-40 rounded-[100%] bg-[radial-gradient(ellipse_at_center,rgba(0,9,226,0.22)_0%,rgba(39,215,199,0.08)_35%,transparent_70%)] blur-3xl md:-bottom-12 md:h-52"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-4 left-1/2 h-24 w-[min(92%,56rem)] -translate-x-1/2 rounded-[100%] bg-black/55 blur-2xl"
          />

          <div
            ref={tiltLayerRef}
            className="relative origin-[50%_92%] [transform-style:preserve-3d] will-change-transform"
            style={{
              transform: "rotateX(0deg) rotateY(0deg) rotateZ(0deg) scale3d(1,1,1)",
            }}
          >
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 top-0 z-10 h-10 bg-[linear-gradient(180deg,rgba(19,19,19,0.35)_0%,transparent_100%)] md:h-12"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-20 bg-[linear-gradient(0deg,rgba(19,19,19,0.45)_0%,transparent_100%)]"
            />

            <div
              ref={zoneRef}
              data-wechat-official-feed
              className="relative z-20 [transform-style:preserve-3d] md:touch-pan-y"
            >
              <div
                ref={scrollerRef}
                className="wechat-official-feed-scroll flex snap-x snap-mandatory gap-5 overflow-x-auto overflow-y-hidden overscroll-behavior-x-contain px-0 py-6 [scrollbar-width:none] md:snap-none md:gap-8 md:overflow-x-hidden md:overscroll-behavior-x-none md:py-10 [&::-webkit-scrollbar]:hidden"
                style={{
                  maskImage:
                    "linear-gradient(90deg, transparent 0%, #000 5%, #000 95%, transparent 100%)",
                  WebkitMaskImage:
                    "linear-gradient(90deg, transparent 0%, #000 5%, #000 95%, transparent 100%)",
                }}
              >
                {WECHAT_OFFICIAL_FEED.map((item, i) => (
                  <a
                    key={item.id}
                    data-wechat-card
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${item.titleZh}，在新标签页打开微信公众号文章`}
                    className="relative shrink-0 snap-center [transform-style:preserve-3d]"
                    style={{
                      transform: "translateZ(0px) translateY(0px) rotateY(0deg)",
                    }}
                  >
                    <div className="group/card flex w-[min(94vw,30rem)] flex-col overflow-hidden rounded-lg border-2 border-[rgba(0,0,0,0.85)] bg-[#0a0a0c] shadow-[0_28px_80px_-12px_rgba(0,0,0,0.85),0_0_0_1px_rgba(255,255,255,0.06)_inset,0_0_60px_-20px_rgba(39,215,199,0.12)] transition-[transform,box-shadow] duration-300 group-hover/card:-translate-y-1 group-hover/card:shadow-[0_36px_100px_-16px_rgba(0,9,226,0.35),0_0_0_1px_rgba(39,215,199,0.2)_inset] sm:w-[min(90vw,34rem)] md:w-[min(78vw,40rem)] lg:w-[min(62vw,44rem)] xl:w-[min(52vw,48rem)]">
                      <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#111]">
                        <Image
                          src={item.imageSrc}
                          alt=""
                          fill
                          className="object-cover transition-transform duration-500 group-hover/card:scale-[1.03]"
                          sizes="(max-width: 640px) 94vw, (max-width: 1024px) 78vw, 52vw"
                          priority={i < 2}
                        />
                        <span
                          aria-hidden
                          className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#0009e2]/95 via-[#0009e2]/55 to-transparent px-3 pb-2.5 pt-10 font-[family-name:var(--font-en)] text-[10px] font-semibold uppercase tracking-[0.2em] text-white md:text-[11px]"
                        >
                          Surfing Founders
                        </span>
                      </div>
                      <div className="space-y-2 border-t border-white/[0.06] bg-[linear-gradient(180deg,rgba(19,19,19,0.98)_0%,#08080a_100%)] px-4 py-4 md:px-5 md:py-5">
                        <p className="line-clamp-4 text-pretty font-[family-name:var(--font-zh)] text-[14px] font-medium leading-snug text-[var(--foreground)] md:text-[15px] md:leading-snug">
                          {item.titleZh}
                        </p>
                        <p className="font-[family-name:var(--font-en)] text-[10px] uppercase tracking-[0.2em] text-[var(--brand-teal)]">
                          WeChat Official · 打开 ↗
                        </p>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
