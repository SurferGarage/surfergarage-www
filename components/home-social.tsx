import {
  SOCIAL_CONNECT_SECTIONS,
  type SocialChannel,
  type SocialChannelKind,
} from "@/lib/social-channels";
import { SocialChannelMark } from "@/components/social-channel-mark";

const cardBase =
  "group relative flex h-full min-h-[11.5rem] flex-col rounded-sm border border-white/[0.14] bg-[linear-gradient(165deg,rgba(255,255,255,0.1)_0%,rgba(12,20,52,0.52)_42%,rgba(5,8,26,0.84)_100%)] px-4 py-5 shadow-[0_22px_60px_-30px_rgba(0,0,0,0.72),inset_0_1px_0_rgba(255,255,255,0.12)] backdrop-blur-[6px] transition-[border-color,box-shadow,transform] duration-200 md:min-h-[12rem] md:px-5 md:py-6";

const cardHoverable =
  "hover:-translate-y-0.5 hover:border-[color-mix(in_oklch,var(--brand-teal)_52%,transparent)] hover:shadow-[0_28px_72px_-28px_rgba(0,9,226,0.42),inset_0_1px_0_rgba(255,255,255,0.16)]";

const cardStatic =
  "cursor-default hover:translate-y-0 hover:border-white/[0.14] hover:shadow-[0_22px_60px_-30px_rgba(0,0,0,0.72),inset_0_1px_0_rgba(255,255,255,0.12)]";

function channelBadge(kind: SocialChannelKind) {
  switch (kind) {
    case "article":
      return "Article";
    case "video":
      return "Video";
    case "audio":
      return "Podcast";
    case "community":
      return "Community";
    default:
      return "Open Source";
  }
}

function SocialChannelCard({ ch }: { ch: SocialChannel }) {
  const isHttp = /^https?:\/\//i.test(ch.href);
  const label = `${ch.labelZh} — ${ch.labelEn}`;
  const cardClass = `${cardBase} ${isHttp ? cardHoverable : cardStatic}`;
  const body = (
    <>
      <div className="flex items-start justify-between gap-3">
        <span className="font-[family-name:var(--font-en)] text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--brand-teal)]">
          {channelBadge(ch.kind)}
        </span>
        <SocialChannelMark id={ch.mark} />
      </div>
      <span className="mt-2 font-[family-name:var(--font-en)] text-sm font-medium text-[var(--foreground)] md:text-base">
        {ch.labelEn}
      </span>
      <span className="mt-1 font-[family-name:var(--font-zh)] text-[13px] text-[var(--muted-strong)]">
        {ch.labelZh}
      </span>
      <span className="mt-3 font-[family-name:var(--font-zh)] text-xs leading-relaxed text-[var(--muted)]">
        {ch.descriptionZh}
      </span>
      {isHttp ? (
        <span className="mt-auto pt-4 font-[family-name:var(--font-en)] text-[10px] font-medium uppercase tracking-[0.18em] text-[var(--muted)] transition-colors group-hover:text-[var(--brand-teal)]">
          新标签页打开 ↗
        </span>
      ) : (
        <span className="mt-auto pt-4 font-[family-name:var(--font-en)] text-[10px] font-medium uppercase tracking-[0.18em] text-[var(--muted)]">
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
      className="scroll-mt-[4.5rem] border-t border-b border-[var(--hairline)] pt-16 pb-24 md:pt-20 md:pb-32"
      aria-labelledby="social-heading"
    >
      <div className="mx-auto max-w-[1440px] px-5 md:px-10 lg:px-12">
        <div className="max-w-[48rem]" data-social-intro>
          <p
            id="social-heading"
            className="font-[family-name:var(--font-en)] text-[11px] font-medium uppercase tracking-[0.28em] text-[var(--foreground)]"
          >
            Connect
          </p>
          <p className="mt-4 max-w-[40rem] font-[family-name:var(--font-zh)] text-[15px] leading-relaxed text-[var(--muted-strong)] md:text-[17px]">
            出站矩阵：文章、映像与播客、GitHub。社群、加好友与商务入口集中在{" "}
            <a
              href="#call"
              className="text-[var(--brand-teal)] underline-offset-4 transition-colors hover:text-[var(--foreground)] hover:underline"
            >
              The Call
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

                <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
