import { HeroFlowField } from "@/components/hero-flow-field";
import { SiteAnchorLink } from "@/components/site-anchor-link";
import { SG_PAGE_SHELL_CLASS } from "@/lib/sg-layout";

export function HomeHero() {
  return (
    <section
      id="manifesto"
      className="relative scroll-mt-[4.5rem] overflow-hidden border-b border-[var(--hairline)] bg-[#08090d]"
      aria-labelledby="hero-title"
    >
      <div className="sg-home-hero-frame relative min-h-[calc(100svh-5.5rem)] overflow-hidden lg:h-[calc(100svh-7.5rem)] lg:min-h-[42rem]">
        <HeroFlowField />

        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 z-[1] w-full bg-[linear-gradient(90deg,rgba(7,8,11,0.97)_0%,rgba(7,8,11,0.91)_34%,rgba(7,8,11,0.54)_52%,rgba(7,8,11,0.04)_78%)] md:w-[78%]"
        />

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
                浪前是一家面向 16–28 岁极早期科技创业者的深度媒体。我们在共识形成之前，记录真实的产品进展、判断与转折。
              </p>

              <div className="sg-home-hero-actions mt-7 flex flex-wrap items-center gap-3">
                <SiteAnchorLink
                  href="#proof"
                  className="sg-home-hero-action inline-flex min-h-11 items-center gap-3 bg-[var(--brand-primary)] px-5 py-3 font-[family-name:var(--font-zh)] text-[15px] font-medium text-white transition-colors hover:bg-[#1420ff]"
                >
                  阅读最新特稿
                  <span aria-hidden>↓</span>
                </SiteAnchorLink>
                <SiteAnchorLink
                  href="#call-join"
                  className="sg-home-hero-action inline-flex min-h-11 items-center gap-3 border border-white/24 bg-black/20 px-5 py-3 font-[family-name:var(--font-zh)] text-[15px] font-medium text-white transition-colors hover:border-white/48 hover:bg-black/34"
                >
                  提交故事
                  <span aria-hidden>→</span>
                </SiteAnchorLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
