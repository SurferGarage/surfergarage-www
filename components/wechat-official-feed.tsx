"use client";

import { gsap, ScrollTrigger } from "@/components/motion/gsap-register";
import {
  FOUNDER_WECHAT_PIN_END,
  mapWechatPinProgressToHorizontalScrub,
} from "@/lib/founder-wechat-pin-end";
import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";
import { WECHAT_OFFICIAL_FEED } from "@/lib/wechat-official-feed";
import Image from "next/image";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

const BASE_ROT_X = 8;
const MAX_ROT_X_POINTER = 3.2;
const LERP = 0.11;
/** 3D 随 pin 进度渐起 */
const TILT_ENV_EXPONENT = 1.08;

/** 环抱弧：展台感略加强 */
const WRAP_ROT_Y = 22;
const WRAP_LIFT = 26;
const WRAP_Z = 34;

type WechatPointerSpot = {
  readonly x: number;
  readonly y: number;
  readonly active: boolean;
};

/**
 * 单卡 3D 展台弧：在 **未变换** 的 `[data-wechat-card]` 上量几何，把 transform 写到
 * `[data-wechat-tilt]`，避免「量到的是上一帧 transform 后的盒」→ 反馈抖动。
 */
function syncCardTheaterArc(
  scroller: HTMLDivElement,
  envelope: number,
  pointer: WechatPointerSpot,
): void {
  if (envelope < 0.04) {
    scroller.querySelectorAll<HTMLElement>("[data-wechat-card]").forEach((el) => {
      const tilt = el.querySelector<HTMLElement>("[data-wechat-tilt]");
      if (tilt) {
        tilt.style.transform =
          "translateZ(0px) translateY(0px) rotateY(0deg) rotateX(0deg) scale3d(1,1,1)";
        tilt.style.opacity = "";
      }
      const spot = el.querySelector<HTMLElement>("[data-wechat-spot]");
      if (spot) {
        spot.style.opacity = "0";
        spot.style.removeProperty("--wx");
        spot.style.removeProperty("--wy");
      }
      const inner = el.querySelector<HTMLElement>("[data-wechat-card-inner]");
      if (inner) inner.style.boxShadow = "";
    });
    return;
  }

  const sr = scroller.getBoundingClientRect();
  const midX = sr.left + sr.width / 2;
  const norm = Math.max(sr.width * 0.36, 120);

  scroller.querySelectorAll<HTMLElement>("[data-wechat-card]").forEach((el) => {
    const tilt = el.querySelector<HTMLElement>("[data-wechat-tilt]");
    if (!tilt) return;

    const r = el.getBoundingClientRect();
    const cxRaw = (r.left + r.width / 2 - midX) / norm;
    const cx = Math.max(-1, Math.min(1, cxRaw));
    const w = 1 - cx * cx;
    const rotY = cx * WRAP_ROT_Y * envelope;
    const lift = -w * WRAP_LIFT * envelope;
    const tz = w * WRAP_Z * envelope;
    const ty = lift;

    let hovering = false;
    if (envelope > 0.04) {
      hovering =
        pointer.x >= r.left &&
        pointer.x <= r.right &&
        pointer.y >= r.top &&
        pointer.y <= r.bottom;
    }

    const focus = 0.9 + 0.16 * w;
    tilt.style.opacity = String(0.58 + 0.42 * w);
    tilt.style.transform = `translateZ(${tz}px) translateY(${ty}px) rotateY(${rotY}deg) rotateX(0deg) scale3d(${focus},${focus},1)`;

    const spot = el.querySelector<HTMLElement>("[data-wechat-spot]");
    if (spot) {
      if (hovering) {
        const px = ((pointer.x - r.left) / Math.max(1, r.width)) * 100;
        const py = ((pointer.y - r.top) / Math.max(1, r.height)) * 100;
        spot.style.setProperty("--wx", `${px}%`);
        spot.style.setProperty("--wy", `${py}%`);
        spot.style.opacity = String(0.28 + 0.45 * w * envelope);
      } else {
        spot.style.opacity = "0";
        spot.style.removeProperty("--wx");
        spot.style.removeProperty("--wy");
      }
    }

    const inner = el.querySelector<HTMLElement>("[data-wechat-card-inner]");
    if (inner) {
      if (w > 0.74 && envelope > 0.08) {
        inner.style.boxShadow =
          "0 0 0 1px rgba(39,215,199,0.45), 0 0 48px -8px rgba(0,9,226,0.55), 0 32px 90px -28px rgba(0,9,226,0.35)";
      } else if (hovering) {
        inner.style.boxShadow =
          "0 0 0 1px rgba(255,255,255,0.14), 0 22px 60px -22px rgba(0,0,0,0.65)";
      } else {
        inner.style.boxShadow = "";
      }
    }
  });
}

/**
 * Surfing Founders 微信专栏 · 全宽「展台」：
 * - 桌面：**pin 进度与 `scrollLeft` 在 ST `onUpdate` 内瞬时同相绑定**（竖滚在 pin 内全部「喂给」横条，跑完才离开该 pin 段）；RAF 只做展台弧与整层俯仰，**不再改写 scrollLeft**（避免滞后导致条拖不动、竖滚先跑完）。
 * - 单卡 3D：**几何在 `[data-wechat-card]` 上量、变换在 `[data-wechat-tilt]`**；桌面展台弧强度与 **`pinProgressRef`（与 `scrollLeft` 瞬时一致）** 同相。
 * - 整层轻微 rotateX + 指针俯仰。
 */
export function WeChatOfficialFeed() {
  const stageRef = useRef<HTMLDivElement>(null);
  const tiltLayerRef = useRef<HTMLDivElement>(null);
  const zoneRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  /** 桌面 md+ 且 ScrollTrigger 已挂上：由 pin 驱动横滑；否则不改写 scrollLeft（移动端手滑） */
  const desktopWechatScrubRef = useRef(false);
  const pointerClientRef = useRef({ x: 0, y: 0 });

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
      desktopWechatScrubRef.current = true;

      const bindPinToScroller = (rawProgress: number) => {
        const progress = mapWechatPinProgressToHorizontalScrub(rawProgress);
        pinProgressRef.current = progress;
        const el = scrollerRef.current;
        if (!el) return;
        const max = Math.max(0, el.scrollWidth - el.clientWidth);
        el.scrollLeft = progress * max;
      };

      /** 布局刷新或首帧：瞬时对齐 */
      const snapScrollerToProgress = (rawProgress: number) => {
        bindPinToScroller(rawProgress);
        const el = scrollerRef.current;
        if (!el) return;
        const p = pinProgressRef.current;
        syncCardTheaterArc(el, p ** TILT_ENV_EXPONENT, {
          x: pointerClientRef.current.x,
          y: pointerClientRef.current.y,
          active: pointerInsideRef.current,
        });
      };

      const st = ScrollTrigger.create({
        id: "wechat-feed-scrub-sync",
        trigger: panel,
        start: "top top",
        end: FOUNDER_WECHAT_PIN_END,
        invalidateOnRefresh: true,
        onUpdate(self) {
          bindPinToScroller(self.progress);
        },
        onRefresh(self) {
          snapScrollerToProgress(self.progress);
        },
      });

      const scroller = scrollerRef.current;
      const onImgLoad = () => {
        ScrollTrigger.refresh();
      };
      scroller?.addEventListener("load", onImgLoad, true);

      snapScrollerToProgress(st.progress);

      return () => {
        desktopWechatScrubRef.current = false;
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
          a.querySelectorAll<HTMLElement>("[data-wechat-tilt]").forEach((tilt) => {
            tilt.style.removeProperty("transform");
            tilt.style.removeProperty("opacity");
          });
          a.querySelectorAll<HTMLElement>("[data-wechat-spot]").forEach((s) => {
            s.style.opacity = "0";
            s.style.removeProperty("--wx");
            s.style.removeProperty("--wy");
          });
          a.querySelectorAll<HTMLElement>("[data-wechat-card-inner]").forEach((inner) => {
            inner.style.boxShadow = "";
          });
        });
      }
      return;
    }

    let cancelled = false;
    const loop = () => {
      if (cancelled) return;
      const rawP = Math.max(0, Math.min(1, pinProgressRef.current));
      const tiltEnv = rawP ** TILT_ENV_EXPONENT;
      const scale = 1 + 0.032 * tiltEnv;

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
        const spot: WechatPointerSpot = {
          x: pointerClientRef.current.x,
          y: pointerClientRef.current.y,
          active: pointerInsideRef.current,
        };
        let cardEnv: number;
        if (desktopWechatScrubRef.current) {
          cardEnv = pinProgressRef.current ** TILT_ENV_EXPONENT;
        } else {
          const maxW = Math.max(0, sc.scrollWidth - sc.clientWidth);
          const scrollT = maxW > 0 ? sc.scrollLeft / maxW : 0;
          cardEnv = scrollT ** TILT_ENV_EXPONENT;
        }
        syncCardTheaterArc(sc, cardEnv, spot);
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
      pointerClientRef.current = { x: e.clientX, y: e.clientY };
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
      const max = Math.max(0, el.scrollWidth - el.clientWidth);
      const scrollT = max > 0 ? el.scrollLeft / max : 0;
      const env = scrollT ** TILT_ENV_EXPONENT;
      syncCardTheaterArc(el, env, {
        x: pointerClientRef.current.x,
        y: pointerClientRef.current.y,
        active: pointerInsideRef.current,
      });
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
      {reducedMotion ? (
        <p className="mb-5 max-w-[56rem] font-[family-name:var(--font-zh)] text-[13px] leading-relaxed text-[var(--muted-strong)] md:mb-6 md:text-[15px]">
          减少动效：请横向滑动浏览专栏。
        </p>
      ) : null}

      <div className="relative left-1/2 w-screen max-w-[100vw] -translate-x-1/2 overflow-x-clip overflow-y-visible px-1 pb-16 pt-10 md:px-4 md:pb-28 md:pt-20">
        <div
          ref={stageRef}
          className="relative mx-auto w-full max-w-[100vw] [perspective:min(200vw,2000px)] [perspective-origin:50%_38%]"
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
                className="wechat-official-feed-scroll flex snap-x snap-mandatory gap-5 overflow-x-auto overflow-y-hidden overscroll-behavior-x-contain px-[max(0.75rem,calc((100vw-min(94vw,30rem))/2))] py-6 [scrollbar-width:none] [scroll-padding-inline:max(0.75rem,calc((100vw-min(94vw,30rem))/2))] md:gap-8 md:overflow-x-hidden md:overscroll-behavior-x-none md:px-[max(1rem,calc((100vw-min(78vw,40rem))/2))] md:py-10 md:[scroll-padding-inline:max(1rem,calc((100vw-min(78vw,40rem))/2))] [&::-webkit-scrollbar]:hidden"
                style={{
                  maskImage:
                    "linear-gradient(90deg, transparent 0%, #000 12%, #000 88%, transparent 100%)",
                  WebkitMaskImage:
                    "linear-gradient(90deg, transparent 0%, #000 12%, #000 88%, transparent 100%)",
                }}
              >
                {WECHAT_OFFICIAL_FEED.map((item, i) => (
                  <a
                    key={item.id}
                    data-wechat-card
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${item.titleZh}。Surfing Founders 人物访谈 微信专栏，在新标签页打开`}
                    className="relative block shrink-0 snap-center"
                  >
                    <div
                      data-wechat-tilt
                      className="origin-center will-change-transform [transform-style:preserve-3d]"
                      style={{
                        transform:
                          "translateZ(0px) translateY(0px) rotateY(0deg) rotateX(0deg) scale3d(1,1,1)",
                      }}
                    >
                      <CardContainer className="relative h-full w-full" maxTilt={11}>
                        <CardBody
                          data-wechat-card-inner
                          className="group/card relative flex w-[min(94vw,30rem)] flex-col overflow-hidden rounded-xl border border-white/[0.12] bg-white/[0.03] shadow-[0_4px_24px_-8px_rgba(0,0,0,0.45)] transition-[border-color,box-shadow] duration-300 ease-out hover:border-teal-400/30 hover:shadow-[0_28px_90px_-24px_rgba(0,9,226,0.35),0_0_0_1px_rgba(39,215,199,0.12)] sm:w-[min(90vw,34rem)] md:w-[min(78vw,40rem)] lg:w-[min(62vw,44rem)] xl:w-[min(52vw,48rem)]"
                        >
                          <div
                            data-wechat-spot
                            aria-hidden
                            className="pointer-events-none absolute inset-0 z-[6] rounded-xl opacity-0 transition-opacity duration-150"
                            style={{
                              mixBlendMode: "screen",
                              background:
                                "radial-gradient(ellipse 130% 115% at var(--wx,50%) var(--wy,48%), rgba(39,215,199,0.42), rgba(0,9,226,0.14) 38%, transparent 68%)",
                            }}
                          />
                          <CardItem
                            translateZ={56}
                            className="relative z-[1] aspect-[16/9] w-full overflow-hidden bg-[#111]"
                          >
                            <Image
                              src={item.imageSrc}
                              alt=""
                              fill
                              className="object-cover transition-transform duration-500 ease-out group-hover/card:scale-[1.07]"
                              sizes="(max-width: 640px) 94vw, (max-width: 1024px) 78vw, 52vw"
                              priority={i < 2}
                            />
                          </CardItem>
                          <CardItem
                            translateZ={42}
                            className="relative z-[1] space-y-2 border-t border-white/[0.08] bg-[linear-gradient(180deg,rgba(19,19,19,0.98)_0%,#08080a_100%)] px-5 py-5 md:space-y-2.5 md:px-6 md:py-6"
                          >
                            <p className="line-clamp-6 text-pretty font-[family-name:var(--font-zh)] text-[17px] font-medium leading-snug tracking-[-0.01em] text-[var(--foreground)] md:text-[19px] md:leading-snug lg:text-[21px]">
                              {item.titleZh}
                            </p>
                            <p className="pt-1 font-[family-name:var(--font-en)] text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--muted)] md:text-xs">
                              WeChat 专栏 · 阅读全文 ↗
                            </p>
                          </CardItem>
                        </CardBody>
                      </CardContainer>
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
