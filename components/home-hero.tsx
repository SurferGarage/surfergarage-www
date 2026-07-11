import { HeroSignalField, type HeroSignal } from "@/components/hero-signal-field";
import { SG_PAGE_SHELL_CLASS } from "@/lib/sg-layout";
import { getSiteStats } from "@/lib/site-stats";
import { SITE_EVENTS } from "@/lib/site-events";

export function HomeHero() {
  const stats = getSiteStats();
  const nextEvent = SITE_EVENTS[0];
  const signals: readonly HeroSignal[] = [
    {
      id: "latest-story",
      href: "#proof",
      label: "最新人物特稿",
      title: "泛函",
      detail: "大厂与初创在抢谁",
    },
    {
      id: "video-podcast",
      href: "#dialogue",
      label: "视频播客",
      title: "浪前对话",
      detail: `第一季 · ${String(stats.episodes).padStart(2, "0")} 期已上线`,
    },
    {
      id: "upcoming-event",
      href: "#events",
      label: "近期活动 · 苏州",
      title: "BuilderUp",
      detail: nextEvent?.dateDisplay ?? "2026.07.18",
    },
  ];

  return (
    <section
      id="manifesto"
      className="relative scroll-mt-[4.5rem] overflow-hidden border-b border-[var(--hairline)] bg-[#08090d]"
      aria-labelledby="hero-title"
    >
      <div className="sg-home-hero-frame relative min-h-[calc(100svh-5.5rem)] overflow-hidden lg:h-[calc(100svh-7.5rem)] lg:min-h-[42rem]">
        <div className={`sg-home-hero-shell relative z-[2] flex min-h-full flex-col pt-8 md:pt-10 lg:h-full lg:pt-4 ${SG_PAGE_SHELL_CLASS}`}>
          <div className="sg-home-hero-body grid flex-1 items-center gap-8 py-8 md:gap-10 md:py-10 lg:grid-cols-12 lg:gap-12 lg:py-8">
            <div className="sg-home-hero-copy max-w-[44rem] lg:col-span-6">
              <h1 id="hero-title" className="sg-home-hero-heading text-white">
                <span className="sg-home-hero-heading-zh block font-[family-name:var(--font-serif-zh)] text-[2.85rem] font-semibold leading-none md:text-[4.5rem] lg:text-[4.25rem] xl:text-[5rem]">
                  浪前
                </span>
                <span className="sg-home-hero-heading-en mt-1 block whitespace-nowrap font-[family-name:var(--font-serif)] text-[3.15rem] leading-[0.94] md:text-[5rem] lg:text-[4.5rem] xl:text-[5.5rem]">
                  Surfer Garage
                </span>
              </h1>

              <p className="sg-home-hero-tagline mt-6 font-[family-name:var(--font-serif-zh)] text-[1.45rem] leading-snug text-white md:text-[1.8rem]">
                记录正在冲浪的人。
              </p>
              <p className="sg-home-hero-description mt-4 max-w-[42rem] font-[family-name:var(--font-zh)] text-[15px] leading-[1.72] text-[var(--muted-strong)] md:text-[17px]">
                浪前是一家记录 16–28 岁极早期科技创业者的高信任科技媒体。我们在共识形成之前，留下他们的第一篇深度访谈。
              </p>

              <div className="sg-home-hero-actions mt-7 flex flex-wrap items-center gap-3">
                <a
                  href="#proof"
                  className="sg-home-hero-action inline-flex min-h-11 items-center gap-3 bg-[var(--brand-primary)] px-5 py-3 font-[family-name:var(--font-zh)] text-[15px] font-medium text-white transition-colors hover:bg-[#1420ff]"
                >
                  浏览最新记录
                  <span aria-hidden>↓</span>
                </a>
                <a
                  href="#call-join"
                  className="sg-home-hero-action inline-flex min-h-11 items-center gap-3 border border-white/24 bg-black/20 px-5 py-3 font-[family-name:var(--font-zh)] text-[15px] font-medium text-white transition-colors hover:border-white/48 hover:bg-black/34"
                >
                  提交故事
                  <span aria-hidden>→</span>
                </a>
              </div>

            </div>

            <div className="lg:col-span-6">
              <HeroSignalField signals={signals} />
            </div>
          </div>

          <dl className="sg-home-hero-stats grid grid-cols-3 border-t border-white/14 font-[family-name:var(--font-mono)] md:grid-cols-[0.7fr_0.7fr_0.7fr_1.4fr]">
            {[
              [String(stats.articles).padStart(2, "0"), "人物长文"],
              [String(stats.episodes).padStart(2, "0"), "视频节目"],
              ["第一季", "当前季"],
              ["共识形成之前", "记录时机"],
            ].map(([value, label], index) => (
              <div
                key={label}
                className={`py-4 md:py-5 ${index > 0 ? "border-l border-white/12 pl-4 md:pl-6" : ""} ${index === 3 ? "hidden md:block" : ""}`}
              >
                <dt className="text-[9px] text-[var(--muted)] md:text-[10px]">{label}</dt>
                <dd className="mt-1 text-[12px] text-white md:text-[14px]">{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
