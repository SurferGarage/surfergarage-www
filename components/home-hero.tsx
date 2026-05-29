import { SG_BODY_ZH_CLASS, SG_PAGE_SHELL_CLASS } from "@/lib/sg-layout";
import type { CSSProperties } from "react";

/** Hero：字标 + 主张，桌面垂直居中、移动底对齐 */
export function HomeHero() {
  return (
    <section
      id="manifesto"
      className="relative flex h-[100svh] max-md:min-h-0 flex-col md:min-h-[46rem] scroll-mt-[4.5rem] overflow-x-clip overflow-y-visible pt-[max(5rem,calc(4.5rem+env(safe-area-inset-top)))] md:pt-28"
      aria-labelledby="hero-title"
      data-hero-wave
      style={
        {
          "--wave-distortion": 1,
          "--wave-opacity": 0.72,
          "--hero-cam-x": 0,
          "--hero-cam-y": 3.12,
          "--hero-cam-z": 7.6,
          "--hero-look-x": 0,
          "--hero-look-y": 0.12,
          "--hero-look-z": 0,
        } as CSSProperties
      }
    >
      <div aria-hidden className="sg-hero-vignette pointer-events-none absolute inset-0 z-[1]" />
      <div aria-hidden className="sg-hero-scan pointer-events-none absolute inset-0 z-[2]" />

      <div
        className={`relative z-[3] flex flex-1 flex-col justify-end pb-28 md:justify-center md:pb-32 ${SG_PAGE_SHELL_CLASS} [text-shadow:0_1px_2px_rgba(0,0,0,0.55),0_12px_48px_rgba(0,0,0,0.35)]`}
      >
        <div
          className="max-w-[min(100%,54rem)]"
          data-manifesto-pin
          data-manifesto-right
        >
          <div data-manifesto-fade>
            <h1 id="hero-title" className="text-left" data-hero-reveal>
              <div
                className="flex max-w-[min(100%,92rem)] flex-col items-start gap-4 md:gap-5"
                data-hero-wordmark
              >
                <span className="font-[family-name:var(--font-zh)] text-[14px] font-light tracking-[0.12em] text-[var(--muted-strong)] md:text-[15px]">
                  浪前
                </span>
                <span
                  className="wordmark-display block w-full overflow-hidden uppercase text-[clamp(1.35rem,10vw,7rem)] text-[var(--foreground)] md:text-[clamp(2.5rem,6vw,7rem)]"
                  data-hero-letters
                >
                  SURFERGARAGE
                </span>
              </div>
            </h1>

            <div className="mt-10 max-w-[42rem] md:mt-12" data-hero-reveal>
              <p className="font-[family-name:var(--font-zh)] text-[clamp(1.25rem,2.5vw,1.9rem)] font-medium leading-[1.35] tracking-tight text-[var(--foreground)]">
                在非共识里造船，而不是在共识里讲故事。
              </p>
            </div>
          </div>

          <p
            className={`mt-8 max-w-[34rem] md:mt-10 ${SG_BODY_ZH_CLASS}`}
            data-hero-scrub
          >
            只收可核对样本：动作、代价、复盘。
          </p>
        </div>
      </div>

      <div
        aria-hidden
        className={`pointer-events-none absolute inset-x-0 bottom-8 z-[3] flex justify-center md:bottom-10 ${SG_PAGE_SHELL_CLASS}`}
      >
        <div data-hero-reveal className="flex flex-col items-center gap-2.5">
          <span className="sg-scroll-cue-line" />
        </div>
      </div>
    </section>
  );
}
