import {
  SOCIAL_CONNECT_SECTIONS,
  type SocialChannel,
  type SocialChannelKind,
} from "@/lib/social-channels";
import { FOUNDERS_BRIDGE_SOCIAL_PB } from "@/lib/founders-scroll-rhythm";
import { SocialChannelMark } from "@/components/social-channel-mark";

/** 扁平粗野：无渐变、无阴影、无 hover 位移；仅底色 / 边框微变 */
const cardBase =
  "group relative flex h-full min-h-[11.5rem] flex-col rounded-sm border border-white/10 bg-white/[0.02] px-4 py-5 transition-[background-color,border-color,color] duration-200 ease-out md:min-h-[12.5rem] md:px-5 md:py-6";

const cardHoverable =
  "hover:bg-white/[0.05] hover:border-[color-mix(in_oklch,var(--brand-primary)_58%,white_10%)]";

const cardStatic =
  "cursor-default hover:bg-white/[0.02] hover:border-white/10";

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

function SocialChannelCard({ ch }: { ch: SocialChannel }) {
  const isHttp = /^https?:\/\//i.test(ch.href);
  const label = `${ch.labelZh} — ${ch.labelEn}`;
  const cardClass = `${cardBase} ${isHttp ? cardHoverable : cardStatic}`;
  const body = (
    <>
      <div className="flex items-start justify-between gap-3">
        <span className="font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-[color-mix(in_oklch,var(--brand-teal)_52%,#94a3b8)]">
          {channelBadge(ch.kind)}
        </span>
        <SocialChannelMark id={ch.mark} />
      </div>
      <div className="flex min-h-[5.5rem] flex-1 flex-col justify-center py-3">
        <span className="font-[family-name:var(--font-en)] text-base font-medium leading-tight text-[#FFFFFF] md:text-[1.05rem]">
          {ch.labelEn}
        </span>
        <span className="mt-1.5 font-[family-name:var(--font-zh)] text-[12px] leading-snug text-[#A1A1AA] md:text-[13px]">
          {ch.labelZh}
        </span>
      </div>
      <span className="font-[family-name:var(--font-zh)] text-[11px] leading-relaxed text-[#A1A1AA] md:text-xs">
        {ch.descriptionZh}
      </span>
      {isHttp ? (
        <span className="mt-auto border-t border-white/[0.06] pt-3 font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-[#A1A1AA] transition-colors group-hover:text-[rgba(255,255,255,0.88)]">
          新标签页打开 ↗
        </span>
      ) : (
        <span className="mt-auto border-t border-white/[0.06] pt-3 font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-[#A1A1AA]">
          即将更新
        </span>
      )}
    </>
  );

  return (
    <li data-social-card className="min-h-0">
      {isHttp ? (
        <a
          href={ch.href}
          className={cardClass}
          rel="noopener noreferrer"
          target="_blank"
          aria-label={`${label}（在新标签页打开）`}
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

export function HomeSocial() {
  return (
    <section
      id="social"
      className={`scroll-mt-[4.5rem] border-t border-b border-[var(--hairline)] pt-16 md:pt-20 ${FOUNDERS_BRIDGE_SOCIAL_PB}`}
      aria-labelledby="social-heading"
    >
      <div className="mx-auto max-w-[1440px] px-5 md:px-10 lg:px-12">
        <div className="max-w-[48rem]" data-social-intro>
          <p
            id="social-heading"
            className="font-[family-name:var(--font-zh)] text-[11px] font-medium tracking-[0.22em] text-[var(--foreground)]"
          >
            触点
          </p>
          <p className="mt-4 max-w-[40rem] font-[family-name:var(--font-zh)] text-[15px] leading-relaxed text-[var(--muted-strong)] md:text-[17px]">
            出站矩阵：文章、视频与播客、GitHub。社群、加好友与商务入口集中在{" "}
            <a
              href="#call"
              className="text-[var(--brand-teal)] underline-offset-4 transition-colors hover:text-[var(--foreground)] hover:underline"
            >
              联络
            </a>
            。可点的卡片在新标签页打开；「即将更新」的渠道尚未挂链。
          </p>
        </div>

        <div data-social-stage className="mt-14 min-h-0 md:mt-20">
          <div className="flex flex-col gap-16 md:gap-28">
            {SOCIAL_CONNECT_SECTIONS.map((sec, i) => (
              <div
                key={sec.id}
                className={
                  i > 0
                    ? "border-t border-[var(--hairline)] pt-16 md:pt-24"
                    : undefined
                }
              >
                <header className="max-w-[48rem]">
                  <p className="font-[family-name:var(--font-en)] text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--brand-teal)]">
                    {sec.eyebrowEn}
                  </p>
                  <h2 className="mt-3 font-[family-name:var(--font-zh)] text-[1.35rem] font-medium leading-snug text-[var(--foreground)] md:text-3xl md:leading-snug">
                    {sec.titleZh}
                  </h2>
                  <p className="mt-2 font-[family-name:var(--font-en)] text-[11px] uppercase tracking-[0.18em] text-[var(--muted)]">
                    {sec.titleEn}
                  </p>
                  <p className="mt-6 font-[family-name:var(--font-zh)] text-sm leading-relaxed text-[var(--muted-strong)] md:text-[15px]">
                    {sec.leadZh}
                  </p>
                </header>

                <ul
                  className={
                    sec.id === "articles"
                      ? "mt-10 grid w-full max-w-md grid-cols-1 gap-4"
                      : "mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
                  }
                >
                  {sec.channels.map((ch) => (
                    <SocialChannelCard key={ch.id} ch={ch} />
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
