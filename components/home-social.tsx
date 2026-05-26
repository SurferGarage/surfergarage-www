import {
  SOCIAL_CONNECT_SECTIONS,
  isSocialChannelLive,
  type SocialChannel,
  type SocialChannelKind,
} from "@/lib/social-channels";
import { WECHAT_FEED_DIRECTORY } from "@/lib/wechat-official-feed";
import { FOUNDERS_BRIDGE_SOCIAL_PB } from "@/lib/founders-scroll-rhythm";
import {
  SG_EDITORIAL_WIDE_CLASS,
  SG_PAGE_SHELL_CLASS,
  SG_STAGE_CLASS,
} from "@/lib/sg-layout";
import { SocialChannelMark } from "@/components/social-channel-mark";

/** Bento span 映射：核心运营渠道 hero、Coming soon 渠道小卡 */
const BENTO_SPAN: Record<string, string> = {
  bilibili: "lg:col-span-7",
  xiaohongshu: "lg:col-span-5",
  xiaoyuzhou: "lg:col-span-6",
  twitter: "lg:col-span-3",
  youtube: "lg:col-span-3",
};

/** Hero 尺寸渠道：latest 用大 serif、min-h 更高 */
const HERO_CHANNEL_IDS = new Set(["bilibili", "xiaoyuzhou"]);

/** Bento 排序权重：数字越小越靠前 */
const BENTO_ORDER: Record<string, number> = {
  bilibili: 0,
  xiaohongshu: 1,
  xiaoyuzhou: 2,
  twitter: 3,
  youtube: 4,
};

const cardBase =
  "group relative flex h-full min-h-[14.5rem] flex-col rounded-sm border border-[var(--hairline)] bg-[var(--paper-1)] px-5 py-5 transition-[background-color,border-color,color,box-shadow] duration-200 ease-out md:min-h-[16rem] md:px-6 md:py-6";

const cardHero =
  "group relative flex h-full min-h-[18rem] flex-col rounded-sm border border-[var(--hairline)] bg-[var(--paper-1)] px-5 py-5 transition-[background-color,border-color,color,box-shadow] duration-200 ease-out md:min-h-[22rem] md:px-7 md:py-7 lg:min-h-[24rem]";

const cardHoverable =
  "hover:border-[color-mix(in_oklch,var(--brand-teal)_45%,var(--hairline-strong))] hover:bg-[var(--paper-2)]";

const cardStatic = "cursor-default";

function channelBadge(kind: SocialChannelKind) {
  switch (kind) {
    case "article":
      return "ARTICLE";
    case "video":
      return "VIDEO";
    case "audio":
      return "PODCAST";
    case "community":
      return "COMMUNITY";
    default:
      return "OPEN SOURCE";
  }
}

function isNavigableHref(href: string): boolean {
  return (
    /^https?:\/\//i.test(href) || href.startsWith("/") || href.startsWith("#")
  );
}

function SocialChannelCard({
  ch,
  variant = "default",
}: {
  ch: SocialChannel;
  variant?: "default" | "hero";
}) {
  const navigable = isNavigableHref(ch.href);
  const external = /^https?:\/\//i.test(ch.href);
  const label = `${ch.labelZh} — ${ch.labelEn}`;
  const isHero = variant === "hero";
  const cardClass = `${isHero ? cardHero : cardBase} ${
    navigable ? cardHoverable : cardStatic
  }`;

  const body = (
    <>
      {/* 段 1 — 顶部 meta：标签 + follower */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-2">
          <span className="editorial-mono text-[10px] uppercase tracking-[0.18em] text-[color-mix(in_oklch,var(--brand-teal)_55%,var(--muted))]">
            {channelBadge(ch.kind)}
          </span>
          <span className="editorial-mono text-[10px] uppercase tracking-[0.14em] text-[var(--muted)]">
            {ch.followerLabel ?? "—"}
          </span>
        </div>
        <SocialChannelMark id={ch.mark} />
      </div>

      {/* 段 2 — 平台名 + 中文副标 + 最新摘要（hero 时 latest 用大 serif） */}
      <div className={`flex flex-1 flex-col ${isHero ? "mt-7 gap-5" : "mt-5 gap-3"}`}>
        <div>
          <p
            className={`font-[family-name:var(--font-en)] font-medium leading-tight text-[var(--foreground)] ${
              isHero
                ? "text-[clamp(1.65rem,2.6vw,2rem)] tracking-[-0.02em]"
                : "text-[clamp(1.05rem,2vw,1.2rem)]"
            }`}
          >
            {ch.labelEn}
          </p>
          <p
            className={`font-[family-name:var(--font-zh)] leading-snug text-[var(--muted-strong)] ${
              isHero
                ? "mt-2 text-[14px] tracking-[0.04em] md:text-[15px]"
                : "mt-1.5 text-[12.5px] md:text-[13px]"
            }`}
          >
            {ch.labelZh}
          </p>
        </div>

        {ch.latest ? (
          isHero ? (
            <div className="border-l-2 border-[var(--brand-teal)]/45 pl-3.5 md:pl-4">
              <span className="editorial-mono mb-1.5 block text-[9.5px] uppercase tracking-[0.22em] text-[var(--accent-amber)]">
                Latest · 最新
              </span>
              <p className="line-clamp-3 editorial-serif text-[clamp(1.05rem,1.5vw,1.25rem)] leading-snug text-[var(--foreground)]">
                {ch.latest}
              </p>
            </div>
          ) : (
            <p className="line-clamp-3 font-[family-name:var(--font-zh)] text-[12.5px] leading-[1.55] text-[var(--muted-strong)] md:text-[13px]">
              <span className="editorial-mono mr-1.5 text-[9.5px] uppercase tracking-[0.18em] text-[var(--accent-amber)]">
                latest
              </span>
              {ch.latest}
            </p>
          )
        ) : null}
      </div>

      {/* 段 3 — CTA + 短说明 */}
      <div
        className={`flex min-w-0 items-center justify-between gap-3 border-t border-[var(--hairline-soft)] ${
          isHero ? "mt-7 pt-4" : "mt-5 pt-3"
        }`}
      >
        <span
          className={`min-w-0 font-[family-name:var(--font-zh)] leading-relaxed text-[var(--muted)] ${
            isHero ? "text-[12.5px] md:text-[13px]" : "text-[11.5px] md:text-[12px]"
          }`}
        >
          {ch.descriptionZh}
        </span>
        {navigable ? (
          <span className="editorial-mono shrink-0 pl-3 text-[10px] uppercase tracking-[0.14em] text-[var(--muted-strong)] transition-colors group-hover:text-[var(--brand-teal)]">
            {external ? "打开 ↗" : "前往 →"}
          </span>
        ) : (
          <span className="editorial-mono shrink-0 pl-3 text-[10px] uppercase tracking-[0.14em] text-[var(--muted-soft)]">
            即将更新
          </span>
        )}
      </div>
    </>
  );

  return (
    <li data-social-card className="min-h-0">
      {navigable ? (
        <a
          href={ch.href}
          className={cardClass}
          {...(external ? { rel: "noopener noreferrer", target: "_blank" } : {})}
          aria-label={
            external ? `${label}（在新标签页打开）` : `${label}（站内跳转）`
          }
        >
          {body}
        </a>
      ) : (
        <div className={cardClass} role="group" aria-label={label}>
          {body}
        </div>
      )}
    </li>
  );
}

/** Open Source 区 GitHub 单卡 hero 升级版 */
function OpenSourceHero({ ch }: { ch: SocialChannel }) {
  return (
    <a
      data-social-card
      href={ch.href}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative flex w-full flex-col gap-6 overflow-hidden rounded-sm border border-[var(--hairline)] bg-[var(--paper-1)] px-6 py-7 transition-[background-color,border-color] duration-200 hover:border-[color-mix(in_oklch,var(--brand-teal)_45%,var(--hairline-strong))] hover:bg-[var(--paper-2)] md:flex-row md:items-stretch md:gap-10 md:px-10 md:py-10 lg:px-14 lg:py-12"
      aria-label={`${ch.labelZh} — ${ch.labelEn}（在新标签页打开）`}
    >
      {/* 左：mark + 标签 + org / repo 大字 */}
      <div className="flex min-w-0 flex-1 flex-col gap-5 md:gap-6">
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-col gap-2">
            <span className="editorial-mono text-[10px] uppercase tracking-[0.18em] text-[color-mix(in_oklch,var(--brand-teal)_55%,var(--muted))]">
              OPEN SOURCE
            </span>
            <span className="editorial-mono text-[10px] uppercase tracking-[0.14em] text-[var(--muted)]">
              {ch.followerLabel ?? "Public org"}
            </span>
          </div>
          <SocialChannelMark id={ch.mark} />
        </div>

        <div>
          <p className="font-[family-name:var(--font-en)] text-[clamp(1.5rem,7vw,3rem)] font-medium leading-[0.96] tracking-[-0.03em] text-[var(--foreground)] break-all">
            github.com/SurferGarage
          </p>
          <p className="mt-3 font-[family-name:var(--font-zh)] text-[14px] tracking-[0.04em] text-[var(--brand-teal)] md:text-[15px]">
            {ch.labelZh}
          </p>
        </div>

        <p className="max-w-[44ch] font-[family-name:var(--font-zh)] text-[13px] leading-[1.7] text-[var(--muted-strong)] md:text-[14.5px]">
          仓库 · Playbook · 本站源码
        </p>
      </div>

      {/* 右：仓库列表 + latest commit */}
      <div className="flex w-full shrink-0 flex-col gap-4 border-t border-[var(--hairline)] pt-5 md:w-[280px] md:border-l md:border-t-0 md:pl-8 md:pt-0 lg:w-[320px]">
        <p className="editorial-eyebrow text-[var(--foreground)]">Repositories</p>
        <ul className="flex flex-col divide-y divide-[var(--hairline-soft)]">
          {[
            {
              name: "Startup-playbook",
              hint: "开源手册",
            },
            {
              name: "surfergarage-www",
              hint: "官网源码",
            },
          ].map((repo) => (
            <li key={repo.name} className="py-3 first:pt-0">
              <p className="font-[family-name:var(--font-en)] text-[13px] font-medium text-[var(--foreground)] md:text-[13.5px]">
                {repo.name}
              </p>
              <p className="mt-1 font-[family-name:var(--font-zh)] text-[11.5px] leading-snug text-[var(--muted)] md:text-[12px]">
                {repo.hint}
              </p>
            </li>
          ))}
        </ul>

        {ch.latest ? (
          <div className="mt-auto border-t border-[var(--hairline-soft)] pt-3">
            <span className="editorial-mono block text-[9.5px] uppercase tracking-[0.18em] text-[var(--accent-amber)]">
              Latest · 最新
            </span>
            <p className="mt-1 line-clamp-2 font-[family-name:var(--font-zh)] text-[12px] leading-[1.55] text-[var(--muted-strong)] md:text-[12.5px]">
              {ch.latest}
            </p>
          </div>
        ) : null}

        <span className="editorial-mono mt-2 inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.16em] text-[var(--muted-strong)] transition-colors group-hover:text-[var(--brand-teal)]">
          Open on GitHub
          <span aria-hidden>↗</span>
        </span>
      </div>
    </a>
  );
}

/** 文章区专栏归档侧栏 — 仅显示最近 5 条 */
function ColumnArchiveAside() {
  const items = WECHAT_FEED_DIRECTORY.slice(0, 5);
  return (
    <aside
      data-social-card
      data-column-archive
      className="flex h-full min-h-0 flex-col rounded-sm border border-[var(--hairline)] bg-[var(--paper-1)] px-5 py-5 md:px-6 md:py-6"
      aria-labelledby="column-archive-heading"
    >
      <div className="flex items-baseline justify-between gap-3 border-b border-[var(--hairline-soft)] pb-3">
        <p
          id="column-archive-heading"
          className="editorial-eyebrow text-[var(--foreground)]"
        >
          最新文章
        </p>
        <p className="editorial-mono text-[10px] uppercase tracking-[0.14em] text-[var(--muted)]">
          {items.length}/{WECHAT_FEED_DIRECTORY.length}
        </p>
      </div>
      <ul className="mt-1 flex flex-1 flex-col divide-y divide-[var(--hairline-soft)]">
        {items.map((d) => (
          <li key={d.id} className="py-2.5 first:pt-3">
            <a
              href={d.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-baseline gap-3 transition-colors"
            >
              <span className="editorial-mono-tabular shrink-0 text-[10.5px] uppercase tracking-[0.1em] text-[var(--muted)] group-hover:text-[var(--brand-teal)]">
                {d.ordinal}
              </span>
              <span className="line-clamp-2 font-[family-name:var(--font-zh)] text-[12.5px] leading-[1.5] text-[var(--muted-strong)] group-hover:text-[var(--foreground)] md:text-[13px]">
                {d.titleZh}
              </span>
            </a>
          </li>
        ))}
      </ul>
      <a
        href="#founders"
        className="mt-3 inline-flex items-center justify-between gap-2 border-t border-[var(--hairline-soft)] pt-3 editorial-mono text-[10px] uppercase tracking-[0.16em] text-[var(--muted-strong)] transition-colors hover:text-[var(--brand-teal)]"
      >
        全部专栏 →
        <span aria-hidden>→</span>
      </a>
    </aside>
  );
}

export function HomeSocial() {
  return (
    <section
      id="social"
      className={`scroll-mt-[4.5rem] border-t border-b border-[var(--hairline)] pt-16 md:pt-24 ${FOUNDERS_BRIDGE_SOCIAL_PB}`}
      aria-labelledby="social-heading"
    >
      <div className={SG_PAGE_SHELL_CLASS}>
        <div
          className={`${SG_EDITORIAL_WIDE_CLASS} sg-spotlight-host`}
          data-social-intro
          data-spotlight
        >
          <div className="flex items-baseline gap-3">
            <span className="editorial-mono text-[11px] uppercase tracking-[0.22em] text-[var(--accent-amber)]">
              § 04
            </span>
            <p
              id="social-heading"
              className="editorial-eyebrow text-[var(--foreground)]"
            >
              触点 · Connect
            </p>
          </div>
          <h2 className="mt-4 editorial-serif text-[clamp(2rem,4.2vw,3rem)] leading-[1.04] text-[var(--foreground)]">
            出站矩阵
          </h2>
        </div>

        <div data-social-stage className="mt-14 min-h-0 md:mt-20">
          <div className="flex flex-col gap-16 md:gap-24">
            {SOCIAL_CONNECT_SECTIONS.map((sec, i) => {
              // 视频区按 BENTO_ORDER 重排
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
                      ? "border-t border-[var(--hairline)] pt-14 md:pt-20"
                      : undefined
                  }
                >
                  <header className={SG_EDITORIAL_WIDE_CLASS}>
                    <div className="flex items-baseline gap-3">
                      <span className="editorial-mono text-[10.5px] uppercase tracking-[0.22em] text-[var(--accent-amber)]">
                        § 04.{sec.index}
                      </span>
                      <p className="editorial-eyebrow text-[var(--brand-teal)]">
                        {sec.eyebrowEn}
                      </p>
                    </div>
                    <h3 className="mt-4 editorial-serif text-[clamp(1.5rem,3.2vw,2.1rem)] leading-[1.06] text-[var(--foreground)]">
                      {sec.titleZh}
                    </h3>
                    <p className="mt-2 editorial-eyebrow text-[var(--muted)]">
                      {sec.titleEn}
                    </p>
                    {sec.leadZh ? (
                      <p className="mt-5 font-[family-name:var(--font-zh)] text-sm leading-relaxed text-[var(--muted-strong)] md:text-[15px]">
                        {sec.leadZh}
                      </p>
                    ) : null}
                  </header>

                  <div className={`${SG_STAGE_CLASS} mt-8 md:mt-10`}>
                    {sec.id === "articles" ? (
                      /* 文章区：hero card + 归档侧栏 */
                      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:gap-6">
                        <ul className="grid grid-cols-1 lg:col-span-5">
                          {ordered.map((ch) => (
                            <SocialChannelCard
                              key={ch.id}
                              ch={ch}
                              variant="hero"
                            />
                          ))}
                        </ul>
                        <div className="lg:col-span-7">
                          <ColumnArchiveAside />
                        </div>
                      </div>
                    ) : sec.id === "video" ? (
                      /* 视频区：bento 不等宽 */
                      <ul className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-12 lg:gap-5">
                        {ordered.map((ch) => {
                          const span = BENTO_SPAN[ch.id] ?? "lg:col-span-4";
                          const isHero = HERO_CHANNEL_IDS.has(ch.id);
                          return (
                            <li
                              key={ch.id}
                              data-social-card
                              className={`min-h-0 ${span}`}
                            >
                              <BentoChannelCard
                                ch={ch}
                                variant={isHero ? "hero" : "default"}
                              />
                            </li>
                          );
                        })}
                      </ul>
                    ) : (
                      /* 开源区：GitHub 单卡 hero */
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

/** Bento 单卡：与 SocialChannelCard 共享内部 body，但外层不包 li（li 由父级直接给） */
function BentoChannelCard({
  ch,
  variant = "default",
}: {
  ch: SocialChannel;
  variant?: "default" | "hero";
}) {
  const navigable = isNavigableHref(ch.href);
  const external = /^https?:\/\//i.test(ch.href);
  const label = `${ch.labelZh} — ${ch.labelEn}`;
  const isHero = variant === "hero";
  const cardClass = `${isHero ? cardHero : cardBase} ${
    navigable ? cardHoverable : cardStatic
  }`;

  const body = (
    <>
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-2">
          <span className="editorial-mono text-[10px] uppercase tracking-[0.18em] text-[color-mix(in_oklch,var(--brand-teal)_55%,var(--muted))]">
            {channelBadge(ch.kind)}
          </span>
          <span className="editorial-mono text-[10px] uppercase tracking-[0.14em] text-[var(--muted)]">
            {ch.followerLabel ?? "—"}
          </span>
        </div>
        <SocialChannelMark id={ch.mark} />
      </div>

      <div className={`flex flex-1 flex-col ${isHero ? "mt-7 gap-5" : "mt-5 gap-3"}`}>
        <div>
          <p
            className={`font-[family-name:var(--font-en)] font-medium leading-tight text-[var(--foreground)] ${
              isHero
                ? "text-[clamp(1.65rem,2.6vw,2rem)] tracking-[-0.02em]"
                : "text-[clamp(1.05rem,2vw,1.2rem)]"
            }`}
          >
            {ch.labelEn}
          </p>
          <p
            className={`font-[family-name:var(--font-zh)] leading-snug text-[var(--muted-strong)] ${
              isHero
                ? "mt-2 text-[14px] tracking-[0.04em] md:text-[15px]"
                : "mt-1.5 text-[12.5px] md:text-[13px]"
            }`}
          >
            {ch.labelZh}
          </p>
        </div>

        {ch.latest ? (
          isHero ? (
            <div className="border-l-2 border-[var(--brand-teal)]/45 pl-3.5 md:pl-4">
              <span className="editorial-mono mb-1.5 block text-[9.5px] uppercase tracking-[0.22em] text-[var(--accent-amber)]">
                Latest · 最新
              </span>
              <p className="line-clamp-3 editorial-serif text-[clamp(1.05rem,1.5vw,1.25rem)] leading-snug text-[var(--foreground)]">
                {ch.latest}
              </p>
            </div>
          ) : (
            <p className="line-clamp-3 font-[family-name:var(--font-zh)] text-[12.5px] leading-[1.55] text-[var(--muted-strong)] md:text-[13px]">
              <span className="editorial-mono mr-1.5 text-[9.5px] uppercase tracking-[0.18em] text-[var(--accent-amber)]">
                latest
              </span>
              {ch.latest}
            </p>
          )
        ) : null}
      </div>

      <div
        className={`flex min-w-0 items-center justify-between gap-3 border-t border-[var(--hairline-soft)] ${
          isHero ? "mt-7 pt-4" : "mt-5 pt-3"
        }`}
      >
        <span
          className={`min-w-0 font-[family-name:var(--font-zh)] leading-relaxed text-[var(--muted)] ${
            isHero ? "text-[12.5px] md:text-[13px]" : "text-[11.5px] md:text-[12px]"
          }`}
        >
          {ch.descriptionZh}
        </span>
        {navigable ? (
          <span className="editorial-mono shrink-0 pl-3 text-[10px] uppercase tracking-[0.14em] text-[var(--muted-strong)] transition-colors group-hover:text-[var(--brand-teal)]">
            {external ? "打开 ↗" : "前往 →"}
          </span>
        ) : (
          <span className="editorial-mono shrink-0 pl-3 text-[10px] uppercase tracking-[0.14em] text-[var(--muted-soft)]">
            即将更新
          </span>
        )}
      </div>
    </>
  );

  return navigable ? (
    <a
      href={ch.href}
      className={cardClass}
      {...(external ? { rel: "noopener noreferrer", target: "_blank" } : {})}
      aria-label={external ? `${label}（在新标签页打开）` : `${label}（站内跳转）`}
    >
      {body}
    </a>
  ) : (
    <div className={cardClass} role="group" aria-label={label}>
      {body}
    </div>
  );
}
