import type { CSSProperties } from "react";

export function HomeHero() {
  return (
    <section
      id="manifesto"
      className="relative h-[100svh] min-h-[46rem] scroll-mt-[4.5rem] overflow-hidden pt-24 md:pt-28"
      aria-labelledby="hero-title"
      data-hero-wave
      style={
        {
          "--wave-distortion": 1,
          "--wave-opacity": 0.86,
          "--hero-cam-x": 0,
          "--hero-cam-y": 3.12,
          "--hero-cam-z": 7.6,
          "--hero-look-x": 0,
          "--hero-look-y": 0.12,
          "--hero-look-z": 0,
        } as CSSProperties
      }
    >
      <div className="relative z-[3] mx-auto grid w-full max-w-[1440px] grid-cols-12 gap-x-4 px-5 pb-16 md:gap-x-6 md:pb-20 lg:px-12 [text-shadow:0_1px_2px_rgba(0,0,0,0.55),0_12px_48px_rgba(0,0,0,0.35)]">
        <div
          className="col-span-12 mb-8 md:col-span-2 md:col-start-1 md:mb-0 md:self-start"
          data-manifesto-pin
        >
          <div data-hero-reveal>
            <div className="flex items-center gap-2">
              <span
                aria-hidden
                className="h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--brand-teal)]"
              />
              <p className="font-[family-name:var(--font-zh)] text-[11px] font-medium tracking-[0.22em] text-[var(--foreground)]">
                宣言
              </p>
            </div>
            <p className="mt-3 font-[family-name:var(--font-en)] text-[11px] font-normal uppercase tracking-[0.22em] text-[var(--muted)]">
              浪前 · 记录与建造
            </p>
          </div>
        </div>

        <div
          className="col-span-12 space-y-14 md:col-span-9 md:col-start-3 md:space-y-20 lg:col-span-8 lg:col-start-3"
          data-manifesto-right
        >
          <div data-manifesto-fade>
            <h1
              id="hero-title"
              className="text-left"
              data-hero-reveal
            >
              <div
                className="flex max-w-[min(100%,92rem)] flex-col items-start"
                data-hero-wordmark
              >
                <span className="mb-2 font-[family-name:var(--font-zh)] text-[13px] font-light leading-none tracking-[0.14em] text-[#A1A1AA] md:mb-2.5 md:text-[15px] md:tracking-[0.18em]">
                  浪前
                </span>
                <span className="wordmark-display block w-full uppercase text-[clamp(2.4rem,6.2vw,7.25rem)] text-[var(--foreground)]">
                  SURFERGARAGE
                </span>
              </div>
            </h1>
            <p
              className="mt-7 max-w-[40rem] font-[family-name:var(--font-zh)] text-[clamp(1.125rem,2.2vw,1.65rem)] font-medium leading-snug tracking-tight text-[var(--foreground)] md:mt-9"
              data-hero-reveal
            >
              在非共识里造船，而不是在共识里讲故事。
            </p>
            <p
              className="mt-3 max-w-[40rem] font-[family-name:var(--font-en)] text-[clamp(1rem,1.85vw,1.3rem)] font-normal leading-snug tracking-tight text-[var(--muted-strong)] md:text-xl"
              data-hero-reveal
            >
              Builder instead of talker.
            </p>
            <p
              className="mt-4 max-w-[40rem] font-[family-name:var(--font-en)] text-sm leading-relaxed tracking-tight text-[rgba(255,255,255,0.72)] md:text-[15px]"
              data-hero-reveal
            >
              We record builders still in the water — not the press kit after the exit.
            </p>
          </div>

          <div>
            <p
              className="max-w-[40rem] font-[family-name:var(--font-zh)] text-[15px] leading-[1.75] text-[var(--muted-strong)] md:text-[17px] md:leading-[1.72]"
              data-hero-scrub
            >
              我们只收「可核对」的样本：动作、代价、结果与复盘；拒绝神话叙事与空泛人设。
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
