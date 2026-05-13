import { SOCIAL_CHANNELS } from "@/lib/social-channels";

const cardClass =
  "group flex h-full min-h-[11.5rem] flex-col rounded-sm border border-[var(--hairline)] bg-[rgba(19,19,19,0.72)] px-4 py-5 transition-[border-color,box-shadow] duration-200 hover:border-[var(--brand-teal)]/40 hover:shadow-[0_0_0_1px_rgba(39,215,199,0.08)] md:min-h-[12rem] md:px-5 md:py-6";

function channelBadge(kind: (typeof SOCIAL_CHANNELS)[number]["kind"]) {
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

export function HomeSocial() {
  return (
    <section
      id="social"
      className="scroll-mt-[4.5rem] border-b border-[var(--hairline)] py-20 md:py-28"
      aria-labelledby="social-heading"
    >
      <div className="mx-auto grid w-full max-w-[1440px] grid-cols-12 gap-x-4 px-5 md:gap-x-6 lg:px-12">
        <div className="col-span-12 md:col-span-4 md:pr-8" data-social-intro>
          <p
            id="social-heading"
            className="font-[family-name:var(--font-en)] text-[11px] font-medium uppercase tracking-[0.28em] text-[var(--foreground)]"
          >
            Connect
          </p>
          <p className="mt-4 font-[family-name:var(--font-zh)] text-[15px] leading-relaxed text-[var(--muted-strong)] md:text-[17px]">
            文章、视频、播客、社区与开源入口。可点击卡片在新标签页打开；标注「即将更新」的渠道正在补全链接。
          </p>
        </div>

        <div className="col-span-12 mt-12 min-h-0 md:col-span-8 md:col-start-5 md:mt-0">
          <div
            data-social-stage
            className="min-h-0"
          >
            <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {SOCIAL_CHANNELS.map((ch) => {
                const isHttp = /^https?:\/\//i.test(ch.href);
                const label = `${ch.labelZh} — ${ch.labelEn}`;
                const body = (
                  <>
                    <span className="font-[family-name:var(--font-en)] text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--brand-teal)]">
                      {channelBadge(ch.kind)}
                    </span>
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
                  <li key={ch.id} data-social-card className="min-h-0">
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
                      <div
                        className={`${cardClass} cursor-default hover:border-[var(--hairline)] hover:shadow-none`}
                        role="group"
                        aria-label={label}
                      >
                        {body}
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
