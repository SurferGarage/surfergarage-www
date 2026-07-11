import { HeroFlowField } from "@/components/hero-flow-field";
import { SG_PAGE_SHELL_CLASS } from "@/lib/sg-layout";
import { getSiteStats } from "@/lib/site-stats";

export function HomeHero() {
  const stats = getSiteStats();

  return (
    <section
      id="manifesto"
      className="relative scroll-mt-[4.5rem] overflow-hidden border-b border-[var(--hairline)] bg-[#08090d]"
      aria-labelledby="hero-title"
    >
      <div className="sg-home-hero-frame relative h-[calc(100svh-8rem)] min-h-[40rem] overflow-hidden">
        <HeroFlowField />

        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 w-full bg-[linear-gradient(90deg,rgba(7,8,11,0.97)_0%,rgba(7,8,11,0.91)_34%,rgba(7,8,11,0.54)_52%,rgba(7,8,11,0.04)_78%)] md:w-[78%]"
        />

        <div className={`sg-home-hero-shell relative z-[2] flex h-full flex-col pt-16 md:pt-20 ${SG_PAGE_SHELL_CLASS}`}>
          <div className="sg-home-hero-body flex flex-1 items-center py-7 md:py-10">
            <div className="sg-home-hero-copy max-w-[48rem]">
            <div className="sg-home-hero-kicker flex flex-wrap items-center gap-x-4 gap-y-2 font-[family-name:var(--font-mono)] text-[10px] uppercase text-[var(--brand-teal)] md:text-[11px]">
              <span>SG://INDEX</span>
              <span className="h-px w-10 bg-[var(--brand-teal)]" aria-hidden />
              <span>Independent media / 2026</span>
            </div>

            <h1 id="hero-title" className="sg-home-hero-heading mt-6 text-white">
              <span className="sg-home-hero-heading-zh block font-[family-name:var(--font-serif-zh)] text-[2.85rem] font-semibold leading-none md:text-[4.5rem] lg:text-[5rem]">
                浪前
              </span>
              <span className="sg-home-hero-heading-en mt-1 block font-[family-name:var(--font-serif)] text-[3.15rem] leading-[0.94] md:text-[5rem] lg:text-[6rem]">
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
          </div>

          <dl className="sg-home-hero-stats grid grid-cols-3 border-t border-white/14 font-[family-name:var(--font-mono)] md:grid-cols-[0.7fr_0.7fr_0.7fr_1.4fr]">
            {[
              [String(stats.articles).padStart(2, "0"), "Stories"],
              [String(stats.episodes).padStart(2, "0"), "Episodes"],
              [stats.season.replace("Season ", "S"), "Archive"],
              ["Before consensus", "Editorial scope"],
            ].map(([value, label], index) => (
              <div
                key={label}
                className={`py-4 md:py-5 ${index > 0 ? "border-l border-white/12 pl-4 md:pl-6" : ""} ${index === 3 ? "hidden md:block" : ""}`}
              >
                <dt className="text-[9px] uppercase text-[var(--muted)] md:text-[10px]">{label}</dt>
                <dd className="mt-1 text-[12px] uppercase text-white md:text-[14px]">{value}</dd>
              </div>
            ))}
          </dl>

          <div className="pointer-events-none absolute right-5 top-7 hidden border-r border-[var(--brand-teal)]/35 pr-3 text-right font-[family-name:var(--font-mono)] text-[9px] uppercase leading-[1.8] text-[var(--muted)] sm:block md:right-10 md:top-9 lg:right-12 xl:right-16">
            <p className="text-[var(--brand-teal)]">Editorial field / live</p>
            <p>{String(stats.articles).padStart(2, "0")} stories · {String(stats.episodes).padStart(2, "0")} episodes</p>
            <p>Shanghai · Suzhou</p>
          </div>
        </div>
      </div>
    </section>
  );
}
