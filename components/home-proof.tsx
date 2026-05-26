import { SG_PAGE_SHELL_CLASS } from "@/lib/sg-layout";
import { getSiteStats } from "@/lib/site-stats";
import { SURFING_FOUNDERS_SEASON_01 } from "@/lib/surfing-founders-video-season";

/** Proof Section — 出水线承载，单屏紧凑过渡区
 * 设计目标：尺寸接近 60svh，色温从 Hero（水下）过渡到 editorial paper；
 * 内容只用一行 stat strip + 一行嘉宾 chip 名单，不堆"卡片墙"。
 */
export function HomeProof() {
  const stats = getSiteStats();

  return (
    <section
      id="proof"
      data-home-proof
      className="relative scroll-mt-[4.5rem] py-14 md:py-20"
      aria-labelledby="proof-heading"
    >
      {/* 顶缘 1px teal 渐变 — "出水线"视觉锚点（无 hairline 框，只一条细光） */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-[8%] top-0 h-px bg-[linear-gradient(90deg,transparent_0%,var(--brand-teal)_50%,transparent_100%)] opacity-60"
      />

      <div className={SG_PAGE_SHELL_CLASS}>
        {/* 顶行：编号 + 标题 — 单行 horizontal，背后 radial spotlight */}
        <div
          className="sg-spotlight-host flex flex-col gap-4 md:flex-row md:items-baseline md:justify-between md:gap-8"
          data-spotlight
        >
          <div>
            <div className="flex items-baseline gap-3">
              <span className="editorial-mono text-[11px] uppercase tracking-[0.22em] text-[var(--accent-amber)]">
                § 02
              </span>
              <p
                id="proof-heading"
                className="editorial-eyebrow text-[var(--foreground)]"
              >
                证据 · Proof
              </p>
            </div>
            <h2 className="mt-3 editorial-serif text-[clamp(1.5rem,3.4vw,2.25rem)] leading-[1.06] text-[var(--foreground)]">
              先看可核对的样本。
            </h2>
          </div>
        </div>

        {/* 中行：3 个 inline stats（横条而非大卡片，避免堆叠） */}
        <ul className="mt-10 grid grid-cols-1 gap-px divide-y divide-[var(--hairline)] border-y border-[var(--hairline)] sm:grid-cols-3 sm:divide-x sm:divide-y-0 md:mt-14">
          <li className="flex flex-col gap-2 px-4 py-5 md:px-6 md:py-7">
            <span className="editorial-mono text-[9.5px] uppercase tracking-[0.18em] text-[var(--muted)]">
              Articles
            </span>
            <span className="editorial-serif text-[clamp(2rem,5.5vw,3.6rem)] leading-none tracking-[-0.02em] text-[var(--foreground)]">
              {String(stats.articles).padStart(2, "0")}
            </span>
            <span className="font-[family-name:var(--font-zh)] text-[11.5px] leading-snug text-[var(--muted-strong)] md:text-[12.5px]">
              微信长文
            </span>
          </li>
          <li className="flex flex-col gap-2 px-4 py-5 md:px-6 md:py-7">
            <span className="editorial-mono text-[9.5px] uppercase tracking-[0.18em] text-[var(--muted)]">
              Episodes
            </span>
            <span className="editorial-serif text-[clamp(2rem,5.5vw,3.6rem)] leading-none tracking-[-0.02em] text-[var(--foreground)]">
              {String(stats.episodes).padStart(2, "0")}
            </span>
            <span className="font-[family-name:var(--font-zh)] text-[11.5px] leading-snug text-[var(--muted-strong)] md:text-[12.5px]">
              B 站视频
            </span>
          </li>
          <li className="flex flex-col gap-2 px-4 py-5 md:px-6 md:py-7">
            <span className="editorial-mono text-[9.5px] uppercase tracking-[0.18em] text-[var(--muted)]">
              Guests
            </span>
            <span className="editorial-serif text-[clamp(2rem,5.5vw,3.6rem)] leading-none tracking-[-0.02em] text-[var(--foreground)]">
              {stats.liveGuests}
              <span className="text-[clamp(1.1rem,2.8vw,1.8rem)] text-[var(--muted-soft)]">
                /{stats.guestSlots}
              </span>
            </span>
            <span className="font-[family-name:var(--font-zh)] text-[11.5px] leading-snug text-[var(--muted-strong)] md:text-[12.5px]">
              本季 {stats.guestSlots} 席
            </span>
          </li>
        </ul>

        {/* 底行：6 席嘉宾 — 横向 chip strip，不再大卡块 */}
        <div className="mt-8 md:mt-10">
          <div className="flex items-baseline justify-between gap-3">
            <p className="editorial-eyebrow text-[var(--foreground)]">
              本季嘉宾
            </p>
            <p className="editorial-mono text-[10px] uppercase tracking-[0.18em] text-[var(--muted)]">
              {stats.season} · {stats.guestSlots} 席
            </p>
          </div>
          <ul className="mt-4 flex flex-wrap gap-2 md:gap-2.5">
            {SURFING_FOUNDERS_SEASON_01.guests.map((g, i) => {
              const live = !g.comingSoon && g.episodes.length > 0;
              return (
                <li key={g.id}>
                  <span
                    className={`inline-flex items-baseline gap-2 rounded-sm border px-3 py-1.5 transition-colors md:px-3.5 md:py-2 ${
                      live
                        ? "border-[var(--hairline-strong)] bg-[var(--paper-2)] text-[var(--foreground)]"
                        : "border-dashed border-[var(--hairline)] bg-transparent text-[var(--muted-strong)]"
                    }`}
                  >
                    <span className="editorial-mono text-[9.5px] uppercase tracking-[0.18em] text-[var(--muted)]">
                      0{i + 1}
                    </span>
                    <span className="font-[family-name:var(--font-zh)] text-[12.5px] font-medium md:text-[13px]">
                      {g.nameZh}
                    </span>
                    <span
                      className={`editorial-mono text-[9px] uppercase tracking-[0.16em] ${
                        live
                          ? "text-[var(--brand-teal)]"
                          : "text-[var(--muted-soft)]"
                      }`}
                    >
                      {live ? "Live" : "TBA"}
                    </span>
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
