import {
  SOCIAL_CONNECT_SECTIONS,
  isSocialChannelLive,
  type SocialChannel,
} from "@/lib/social-channels";
import { WECHAT_FEED_DIRECTORY, WECHAT_OFFICIAL_FEED } from "@/lib/wechat-official-feed";
import { FOUNDERS_BRIDGE_SOCIAL_PB } from "@/lib/founders-scroll-rhythm";
import {
  SG_EDITORIAL_WIDE_CLASS,
  SG_INLINE_LINK_CLASS,
  SG_PAGE_SHELL_CLASS,
  SG_SECTION_PY_CLASS,
  SG_SECTION_TITLE_CLASS,
  SG_STAGE_CLASS,
} from "@/lib/sg-layout";
import { SocialChannelMark } from "@/components/social-channel-mark";
import Image from "next/image";
import type { ReactNode } from "react";

const BENTO_SPAN: Record<string, string> = {
  bilibili: "lg:col-span-7",
  xiaohongshu: "lg:col-span-5",
  xiaoyuzhou: "lg:col-span-6",
  twitter: "lg:col-span-3",
  youtube: "lg:col-span-3",
};

const BENTO_ORDER: Record<string, number> = {
  bilibili: 0,
  xiaohongshu: 1,
  xiaoyuzhou: 2,
  twitter: 3,
  youtube: 4,
};

const channelShell =
  "group relative flex h-full overflow-hidden rounded-sm border border-[var(--hairline)] bg-[var(--paper-1)] transition-[border-color,background-color] duration-300 hover:border-[color-mix(in_oklch,var(--brand-teal)_40%,var(--hairline-strong))] hover:bg-[var(--paper-2)]";

const channelShellStatic =
  "group relative flex h-full overflow-hidden rounded-sm border border-[var(--hairline)] bg-[var(--paper-1)]";

const sectionEyebrow =
  "editorial-eyebrow font-[family-name:var(--font-zh)] text-[var(--muted)]";

function isNavigableHref(href: string): boolean {
  return (
    /^https?:\/\//i.test(href) || href.startsWith("/") || href.startsWith("#")
  );
}

function ChannelMeta({ ch }: { ch: SocialChannel }) {
  const navigable = isNavigableHref(ch.href);
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex min-w-0 items-center gap-3">
        <SocialChannelMark id={ch.mark} />
        <span className="truncate font-[family-name:var(--font-zh)] text-[15px] font-medium text-[var(--foreground)] md:text-[16px]">
          {ch.labelZh}
        </span>
      </div>
      {navigable ? (
        <span
          aria-hidden
          className="shrink-0 font-[family-name:var(--font-zh)] text-[15px] text-[var(--brand-teal)] opacity-0 transition-[opacity,color] duration-300 group-hover:opacity-100 group-hover:text-[var(--foreground)] md:text-[16px]"
        >
          ↗
        </span>
      ) : (
        <span className="shrink-0 font-[family-name:var(--font-zh)] text-[13px] text-[var(--muted)] md:text-[14px]">
          筹备中
        </span>
      )}
    </div>
  );
}

function ChannelLink({
  ch,
  className,
  children,
}: {
  ch: SocialChannel;
  className: string;
  children: ReactNode;
}) {
  const navigable = isNavigableHref(ch.href);
  const external = /^https?:\/\//i.test(ch.href);
  const label = ch.labelZh;

  if (navigable) {
    return (
      <a
        href={ch.href}
        data-social-card
        className={className}
        {...(external ? { rel: "noopener noreferrer", target: "_blank" } : {})}
        aria-label={
          external ? `${label}（在新标签页打开）` : `${label}（站内跳转）`
        }
      >
        {children}
      </a>
    );
  }

  return (
    <div
      data-social-card
      className={className}
      role="group"
      aria-label={label}
    >
      {children}
    </div>
  );
}

/** 微信公众号 — 独立产品位，带封面 */
function WechatFeatureCard({ ch }: { ch: SocialChannel }) {
  const featured =
    WECHAT_OFFICIAL_FEED.find((item) => item.id === "wx-08") ??
    WECHAT_OFFICIAL_FEED[WECHAT_OFFICIAL_FEED.length - 1];

  return (
    <ChannelLink ch={ch} className={`${channelShell} flex-col`}>
      <div className="relative aspect-[16/10] w-full shrink-0 overflow-hidden bg-[var(--paper-2)]">
        <Image
          src={featured.imageSrc}
          alt=""
          fill
          sizes="(max-width: 1024px) 100vw, 42vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,transparent_45%,rgba(11,12,16,0.55)_100%)]"
        />
      </div>
      <div className="flex flex-1 flex-col gap-5 px-5 py-6 md:px-6 md:py-7">
        <ChannelMeta ch={ch} />
        {ch.latest ? (
          <p className="line-clamp-4 editorial-serif text-[clamp(1.05rem,1.55vw,1.28rem)] leading-[1.45] text-[var(--muted-strong)]">
            {ch.latest}
          </p>
        ) : null}
      </div>
    </ChannelLink>
  );
}

/** B 站 — 封面 + 最新一期 */
function BilibiliFeatureCard({ ch }: { ch: SocialChannel }) {
  return (
    <ChannelLink
      ch={ch}
      className={`${channelShell} flex-col lg:flex-row lg:items-stretch`}
    >
      {ch.coverSrc ? (
        <div className="relative aspect-video w-full shrink-0 overflow-hidden bg-[var(--paper-2)] lg:aspect-auto lg:w-[44%] lg:min-h-[13rem]">
          <Image
            src={ch.coverSrc}
            alt=""
            fill
            sizes="(max-width: 1024px) 100vw, 32vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(0,9,226,0.12)_0%,transparent_55%)]"
          />
        </div>
      ) : null}
      <div className="flex min-w-0 flex-1 flex-col justify-center gap-5 px-5 py-6 md:px-7 md:py-8">
        <ChannelMeta ch={ch} />
        {ch.latest ? (
          <p className="line-clamp-3 editorial-serif text-[clamp(1.05rem,1.5vw,1.25rem)] leading-[1.42] text-[var(--muted-strong)]">
            {ch.latest}
          </p>
        ) : null}
      </div>
    </ChannelLink>
  );
}

/** 次要视频渠道 — 紧凑 editorial 卡 */
function CompactChannelCard({ ch }: { ch: SocialChannel }) {
  const navigable = isNavigableHref(ch.href);
  const shell = navigable ? channelShell : channelShellStatic;
  const summary = ch.latest ?? ch.descriptionZh;

  return (
    <ChannelLink
      ch={ch}
      className={`${shell} flex-col justify-between gap-8 px-5 py-6 md:px-6 md:py-7 lg:min-h-[13rem]`}
    >
      <ChannelMeta ch={ch} />
      {summary ? (
        <p className="font-[family-name:var(--font-zh)] text-[15px] leading-[1.6] text-[var(--muted-strong)] md:text-[16px]">
          {summary}
        </p>
      ) : null}
    </ChannelLink>
  );
}

/** 文章区专栏目录 — 与微信卡并列的独立产品 */
function ColumnArchiveAside() {
  const items = WECHAT_FEED_DIRECTORY.slice(0, 5);

  return (
    <aside
      data-social-card
      data-column-archive
      className="flex h-full min-h-0 flex-col border-y border-[var(--hairline)] lg:border lg:rounded-sm lg:bg-[var(--paper-1)] lg:px-6 lg:py-6"
      aria-labelledby="column-archive-heading"
    >
      <p
        id="column-archive-heading"
        className={`${sectionEyebrow} border-b border-[var(--hairline-soft)] py-4 lg:pb-5`}
      >
        最新文章
      </p>
      <ul className="flex flex-1 flex-col">
        {items.map((d) => (
          <li
            key={d.id}
            className="border-b border-[var(--hairline-soft)] last:border-b-0"
          >
            <a
              href={d.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-baseline gap-4 py-4 transition-colors lg:py-[1.125rem]"
            >
              <span className="editorial-mono-tabular w-12 shrink-0 text-[12px] text-[var(--muted)] md:text-[13px]">
                {d.ordinal}
              </span>
              <span className="line-clamp-2 min-w-0 flex-1 font-[family-name:var(--font-zh)] text-[15px] leading-[1.55] text-[var(--muted-strong)] transition-colors group-hover:text-[var(--foreground)] md:text-[16px]">
                {d.titleZh}
              </span>
            </a>
          </li>
        ))}
      </ul>
      <a href="#founders" className={`${SG_INLINE_LINK_CLASS} mt-5 lg:mt-6`}>
        全部专栏
      </a>
    </aside>
  );
}

/** GitHub 开源区 */
function OpenSourceHero({ ch }: { ch: SocialChannel }) {
  return (
    <a
      data-social-card
      href={ch.href}
      target="_blank"
      rel="noopener noreferrer"
      className={`${channelShell} w-full flex-col gap-8 px-6 py-7 md:flex-row md:items-stretch md:gap-12 md:px-10 md:py-10 lg:px-14 lg:py-12`}
      aria-label={`${ch.labelZh}（在新标签页打开）`}
    >
      <div className="flex min-w-0 flex-1 flex-col gap-6 md:gap-7">
        <ChannelMeta ch={ch} />
        <p className="break-all font-[family-name:var(--font-en)] text-[clamp(1.15rem,3.5vw,2rem)] font-medium leading-tight tracking-[-0.02em] text-[var(--muted-strong)]">
          github.com/SurferGarage
        </p>
        {ch.latest ? (
          <p className="max-w-[36rem] font-[family-name:var(--font-zh)] text-[15px] leading-[1.6] text-[var(--muted-strong)] md:text-[16px]">
            {ch.latest}
          </p>
        ) : null}
      </div>

      <ul className="flex w-full shrink-0 flex-col divide-y divide-[var(--hairline-soft)] border-t border-[var(--hairline-soft)] md:w-[240px] md:border-t-0 md:border-l md:pl-8 lg:w-[280px]">
        {[
          { name: "Startup-playbook", hint: "创业进攻手册" },
          { name: "failure-manual", hint: "失败复盘手册" },
          { name: "surfergarage-www", hint: "官网源码" },
        ].map((repo) => (
          <li key={repo.name} className="py-4 first:md:pt-0">
            <p className="font-[family-name:var(--font-en)] text-[14px] font-medium text-[var(--foreground)] md:text-[15px]">
              {repo.name}
            </p>
            <p className="mt-1 font-[family-name:var(--font-zh)] text-[14px] text-[var(--muted)]">
              {repo.hint}
            </p>
          </li>
        ))}
      </ul>
    </a>
  );
}

function renderVideoCard(ch: SocialChannel) {
  if (ch.id === "bilibili") {
    return <BilibiliFeatureCard ch={ch} />;
  }
  return <CompactChannelCard ch={ch} />;
}

export function HomeSocial() {
  return (
    <section
      id="social"
      className={`scroll-mt-[4.5rem] border-t border-b border-[var(--hairline)] ${SG_SECTION_PY_CLASS} ${FOUNDERS_BRIDGE_SOCIAL_PB}`}
      aria-labelledby="social-heading"
    >
      <div className={SG_PAGE_SHELL_CLASS}>
        <div
          className={`${SG_EDITORIAL_WIDE_CLASS} sg-spotlight-host`}
          data-social-intro
          data-spotlight
        >
          <h2 id="social-heading" className={SG_SECTION_TITLE_CLASS}>
            各平台
          </h2>
        </div>

        <div data-social-stage className="mt-12 min-h-0 md:mt-16">
          <div className="flex flex-col gap-16 md:gap-[4.5rem]">
            {SOCIAL_CONNECT_SECTIONS.map((sec, i) => {
              const ordered =
                sec.id === "video"
                  ? [...sec.channels]
                      .filter((ch) => isSocialChannelLive(ch.href))
                      .sort(
                        (a, b) =>
                          (BENTO_ORDER[a.id] ?? 99) - (BENTO_ORDER[b.id] ?? 99),
                      )
                  : sec.channels;

              return (
                <div
                  key={sec.id}
                  className={
                    i > 0
                      ? "border-t border-[var(--hairline)] pt-16 md:pt-[4.5rem]"
                      : undefined
                  }
                >
                  <header className={SG_EDITORIAL_WIDE_CLASS}>
                    <h3 className={sectionEyebrow}>{sec.titleZh}</h3>
                  </header>

                  <div className={`${SG_STAGE_CLASS} mt-6 md:mt-8`}>
                    {sec.id === "articles" ? (
                      <div className="grid grid-cols-1 items-stretch gap-5 lg:grid-cols-12 lg:gap-6">
                        <div className="lg:col-span-5">
                          {ordered.map((ch) => (
                            <WechatFeatureCard key={ch.id} ch={ch} />
                          ))}
                        </div>
                        <div className="lg:col-span-7">
                          <ColumnArchiveAside />
                        </div>
                      </div>
                    ) : sec.id === "video" ? (
                      <ul className="grid w-full grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-12 lg:items-stretch lg:gap-6">
                        {ordered.map((ch) => {
                          const span = BENTO_SPAN[ch.id] ?? "lg:col-span-4";
                          return (
                            <li key={ch.id} className={`min-h-0 ${span}`}>
                              {renderVideoCard(ch)}
                            </li>
                          );
                        })}
                      </ul>
                    ) : (
                      <div className="w-full">
                        {ordered.map((ch) => (
                          <OpenSourceHero key={ch.id} ch={ch} />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
