import {
  SG_PAGE_SHELL_CLASS,
  SG_SECTION_TITLE_CLASS,
} from "@/lib/sg-layout";
import { getSiteStats } from "@/lib/site-stats";
import { SURFING_FOUNDERS_SEASON_01 } from "@/lib/surfing-founders-video-season";

/** Proof — 出水线：数字 + 嘉宾，统一 section 节奏 */
export function HomeProof() {
  const stats = getSiteStats();
  const liveGuests = SURFING_FOUNDERS_SEASON_01.guests.filter(
    (g) => !g.comingSoon && g.episodes.length > 0,
  );
  const pendingCount = stats.guestSlots - liveGuests.length;

  const statItems = [
    { label: "长文", value: String(stats.articles).padStart(2, "0") },
    { label: "视频", value: String(stats.episodes).padStart(2, "0") },
    {
      label: "嘉宾",
      value: `${stats.liveGuests}/${stats.guestSlots}`,
      tabular: true,
    },
  ] as const;

  return (
    <section
      id="proof"
      data-home-proof
      className="relative -mt-[6vh] scroll-mt-[4.5rem] pt-[calc(6vh+4.5rem)] pb-20 md:pt-[calc(6vh+6rem)] md:pb-28"
      aria-labelledby="proof-heading"
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-[8%] top-0 z-[1] h-px bg-[linear-gradient(90deg,transparent_0%,color-mix(in_oklch,var(--brand-teal)_50%,transparent)_50%,transparent_100%)] opacity-40"
      />

      <div className={SG_PAGE_SHELL_CLASS}>
        <header className="relative z-[2] overflow-visible pt-1">
          <h2 id="proof-heading" className={SG_SECTION_TITLE_CLASS}>
            内容一览
          </h2>
        </header>

        <ul className="mt-12 grid grid-cols-1 gap-px divide-y divide-[var(--hairline)] border-y border-[var(--hairline)] sm:mt-14 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {statItems.map((item) => (
            <li
              key={item.label}
              className="flex flex-col gap-4 px-6 py-9 sm:px-8 sm:py-11 md:py-12"
            >
              <span className="font-[family-name:var(--font-zh)] text-[16px] text-[var(--muted-strong)]">
                {item.label}
              </span>
              <span
                className={`editorial-serif text-[clamp(2.75rem,7vw,4.5rem)] leading-none tracking-[-0.025em] text-[var(--foreground)] ${
                  "tabular" in item && item.tabular
                    ? "editorial-mono-tabular"
                    : ""
                }`}
              >
                {item.value}
              </span>
            </li>
          ))}
        </ul>

        {(liveGuests.length > 0 || pendingCount > 0) && (
          <div className="mt-14 flex min-h-[9rem] flex-col items-center justify-center gap-7 border-t border-[var(--hairline)] pt-12 sm:mt-16 sm:min-h-[10rem] sm:gap-8 sm:pt-14 md:min-h-[11rem]">
            {liveGuests.map((g) => (
              <p
                key={g.id}
                className="font-[family-name:var(--font-zh)] text-[clamp(1.5rem,3.2vw,2.15rem)] leading-[1.25] text-[var(--foreground)]"
              >
                {g.nameZh}
              </p>
            ))}
            {pendingCount > 0 ? (
              <p className="font-[family-name:var(--font-zh)] text-[16px] tracking-[0.02em] text-[var(--muted)] md:text-[17px]">
                另有 {pendingCount} 席待公布
              </p>
            ) : null}
          </div>
        )}
      </div>
    </section>
  );
}
