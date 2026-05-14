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
          className="col-span-12 mb-10 md:col-span-4 md:mb-0 md:self-start md:pr-8"
          data-manifesto-pin
        >
          <div data-hero-reveal>
            <div className="flex items-center gap-2">
              <span
                aria-hidden
                className="h-1.5 w-1.5 rounded-full bg-[var(--brand-teal)]"
              />
              <p className="font-[family-name:var(--font-en)] text-[11px] font-medium uppercase tracking-[0.28em] text-[var(--foreground)]">
                Manifesto
              </p>
            </div>
            <p className="mt-3 font-[family-name:var(--font-en)] text-[11px] font-normal uppercase tracking-[0.22em] text-[var(--muted)]">
              浪前 · 纪录与建造
            </p>
          </div>
        </div>

        <div
          className="col-span-12 space-y-16 md:col-span-7 md:col-start-6 md:space-y-24"
          data-manifesto-right
        >
          <div data-manifesto-fade>
            <h1
              id="hero-title"
              className="wordmark-display flex flex-wrap items-baseline gap-x-[0.28em] gap-y-1 text-[clamp(2.75rem,8.2vw,6.75rem)] text-[var(--foreground)]"
              data-hero-reveal
              data-hero-wordmark
            >
              <span className="font-[family-name:var(--font-zh)] font-medium tracking-tight">
                浪前
              </span>
              <span className="whitespace-nowrap">Surfer&nbsp;Garage</span>
            </h1>
            <p
              className="mt-6 max-w-[34rem] font-[family-name:var(--font-zh)] text-[clamp(1.125rem,2.4vw,1.75rem)] font-medium leading-snug tracking-tight text-[var(--foreground)] md:mt-8"
              data-hero-reveal
            >
              在非共识里造船，而不是在共识里讲故事。
            </p>
            <p
              className="mt-3 max-w-[34rem] font-[family-name:var(--font-en)] text-[clamp(1rem,2vw,1.35rem)] font-normal leading-snug tracking-tight text-[var(--muted-strong)] md:text-xl"
              data-hero-reveal
            >
              Builder instead of talker.
            </p>
            <p className="mt-4 max-w-[34rem] font-[family-name:var(--font-en)] text-sm tracking-wide text-[var(--brand-teal)]">
              We record builders still in the water — not the press kit after the exit.
            </p>
          </div>

          <div>
            <p
              className="font-[family-name:var(--font-zh)] text-[15px] leading-[1.75] text-[var(--muted-strong)] md:text-[17px] md:leading-[1.72]"
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
