import Image from "next/image";
import { HeroFlowField } from "@/components/hero-flow-field";
import { SiteAnchorLink } from "@/components/site-anchor-link";
import { SG_PAGE_SHELL_CLASS } from "@/lib/sg-layout";
import { WECHAT_OFFICIAL_FEED } from "@/lib/wechat-official-feed";

export function HomeHero() {
  const latest = WECHAT_OFFICIAL_FEED.at(-1)!;

  return (
    <section id="manifesto" className="sg-ed-hero" aria-labelledby="hero-title">
      <HeroFlowField />
      <div aria-hidden className="sg-ed-hero-shade" />
      <div className={`${SG_PAGE_SHELL_CLASS} sg-ed-hero-shell`}>
        <p className="sg-ed-kicker sg-ed-hero-kicker">
          <span className="sg-ed-live-dot" aria-hidden />
          SURFER GARAGE <span className="sg-ed-kicker-divider">/</span> 独立科技人物媒体
        </p>
        <div className="sg-ed-hero-body">
          <div className="sg-ed-hero-copy">
            <h1 id="hero-title" className="sg-ed-hero-title">
              <span>记录正在</span>
              <span>冲浪的人<span className="text-[var(--brand-teal)]">。</span></span>
            </h1>
            <p className="sg-ed-hero-description">
              面向 16–28 岁极早期科技创业者。
              <br />
              在共识形成之前，记录真实的产品、判断与转折。
            </p>
            <div className="sg-ed-hero-actions">
              <SiteAnchorLink href="#proof" className="sg-ed-button sg-ed-button--primary">
                阅读人物特稿 <span aria-hidden>↓</span>
              </SiteAnchorLink>
              <SiteAnchorLink href="#call-join" className="sg-ed-button sg-ed-button--quiet">
                提交你的故事 <span aria-hidden>↗</span>
              </SiteAnchorLink>
            </div>
          </div>
          <p className="sg-ed-hero-note" aria-hidden>
            Ride the wave.<br /><em>Build what matters.</em>
          </p>
        </div>
        <a className="sg-ed-latest" href={latest.href} target="_blank" rel="noopener noreferrer">
          <span className="sg-ed-latest-label">最新特稿 <span className="sg-ed-latest-date">{latest.publishedAt?.replaceAll("-", ".")}</span></span>
          <span className="sg-ed-latest-thumb">
            <Image src={latest.imageSrc} alt="" fill sizes="80px" className="object-cover" />
          </span>
          <span className="sg-ed-latest-title">{latest.stageTitleZh}</span>
          <span className="sg-ed-latest-arrow" aria-hidden>↗</span>
        </a>
      </div>
    </section>
  );
}
