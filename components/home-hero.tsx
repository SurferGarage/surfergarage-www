import { SG_PAGE_SHELL_CLASS } from "@/lib/sg-layout";
import { formatHeroTicker, getSiteStats } from "@/lib/site-stats";
import type { CSSProperties } from "react";

/** 影院化 Hero：左下时间码、右下数据 ticker、底部 scroll cue、字标字符级 stagger（由 register-hero-wordmark-stagger 接管） */
export function HomeHero() {
  const stats = getSiteStats();
  const tickerText = formatHeroTicker(stats);

  const now = new Date();
  const recYear = now.getUTCFullYear();
  const recMonth = String(now.getUTCMonth() + 1).padStart(2, "0");
  const seasonCode = `${stats.season.toUpperCase().replace(/\s+/g, "")} · VOL ${String(
    stats.episodes,
  ).padStart(2, "0")}`;

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
      {/* 主体网格 */}
      <div
        className={`relative z-[3] grid w-full grid-cols-12 gap-x-4 pb-16 md:gap-x-6 md:pb-20 ${SG_PAGE_SHELL_CLASS} [text-shadow:0_1px_2px_rgba(0,0,0,0.55),0_12px_48px_rgba(0,0,0,0.35)]`}
      >
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
              <p className="editorial-eyebrow text-[var(--foreground)]">
                § 01 — 宣言
              </p>
            </div>
            <p className="mt-3 editorial-eyebrow text-[var(--muted)]">
              浪前 · 记录与建造
            </p>
          </div>
        </div>

        <div
          className="col-span-12 space-y-14 md:col-span-9 md:col-start-3 md:space-y-20 lg:col-span-8 lg:col-start-3"
          data-manifesto-right
        >
          <div data-manifesto-fade>
            <h1 id="hero-title" className="text-left" data-hero-reveal>
              <div
                className="flex max-w-[min(100%,92rem)] flex-col items-start"
                data-hero-wordmark
              >
                <span className="mb-2 font-[family-name:var(--font-zh)] text-[13px] font-light leading-none tracking-[0.14em] text-[#A1A1AA] md:mb-2.5 md:text-[15px] md:tracking-[0.18em]">
                  浪前
                </span>
                <span
                  className="wordmark-display block w-full overflow-hidden uppercase text-[clamp(2.4rem,6.2vw,7.25rem)] text-[var(--foreground)]"
                  data-hero-letters
                >
                  SURFERGARAGE
                </span>
              </div>
            </h1>

            <div className="mt-7 max-w-[48rem] md:mt-9" data-hero-reveal>
              <p className="font-[family-name:var(--font-zh)] text-[clamp(1.125rem,2.2vw,1.75rem)] font-medium leading-snug tracking-tight text-[var(--foreground)]">
                在非共识里造船，而不是在共识里讲故事。
              </p>
            </div>
          </div>

          <div>
            <p
              className="max-w-[48rem] font-[family-name:var(--font-zh)] text-[15px] leading-[1.75] text-[var(--muted-strong)] md:text-[17px] md:leading-[1.72]"
              data-hero-scrub
            >
              只收可核对样本：动作、代价、复盘。
            </p>
          </div>
        </div>
      </div>

      {/* ---- 影院级角标层 ---- */}
      <div
        aria-hidden
        className={`pointer-events-none absolute inset-x-0 bottom-6 z-[3] md:bottom-8 ${SG_PAGE_SHELL_CLASS}`}
      >
        <div className="flex items-end justify-between gap-6">
          {/* 左下：录制时间码 */}
          <div
            data-hero-reveal
            className="flex items-end gap-3 text-[var(--muted-strong)] [text-shadow:0_1px_2px_rgba(0,0,0,0.6)]"
          >
            <span className="mt-0.5 h-2 w-2 shrink-0 animate-pulse rounded-full bg-[var(--brand-teal)]" />
            <div className="leading-none">
              <p className="editorial-mono text-[10px] uppercase tracking-[0.22em] text-[var(--muted)]">
                REC · Live
              </p>
              <p className="mt-1.5 editorial-mono-tabular text-[11px] uppercase tracking-[0.12em] text-[var(--foreground)] md:text-[12px]">
                REC · {recYear}.{recMonth}
              </p>
              <p className="mt-1 editorial-mono text-[10px] uppercase tracking-[0.18em] text-[var(--muted)]">
                {seasonCode}
              </p>
            </div>
          </div>

          {/* 中：呼吸 scroll cue（仅桌面，避免与移动端 ticker 挤） */}
          <div className="hidden flex-col items-center gap-2 text-[var(--muted)] md:flex">
            <span aria-hidden className="sg-scroll-cue-line" />
            <p className="editorial-eyebrow text-[10px]">
              Scroll
            </p>
          </div>

          {/* 右下：站点数据 ticker */}
          <div
            data-hero-reveal
            className="text-right text-[var(--muted-strong)] [text-shadow:0_1px_2px_rgba(0,0,0,0.6)]"
          >
            <p className="editorial-eyebrow text-[var(--muted)]">
              Index
            </p>
            <p className="mt-1.5 editorial-mono-tabular text-[10.5px] uppercase tracking-[0.16em] text-[var(--foreground)] md:text-[11.5px]">
              {tickerText}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
