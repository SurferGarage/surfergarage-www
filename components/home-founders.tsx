import { FounderArticleActions } from "@/components/founder-article-actions";
import { FounderLazyBilibili } from "@/components/founder-lazy-bilibili";
import { GithubRepoCard } from "@/components/github-repo-card";
import { FOUNDER_PANELS } from "@/lib/founder-panels";

/** 创业者访谈叠卡区：桌面端 pin + 内层 transform scrub 见 `home-scroll-choreography`。 */
export function HomeFounders() {
  return (
    <section
      id="founders"
      className="scroll-mt-[4.5rem] border-b border-[var(--hairline)] py-16 md:py-20"
      aria-labelledby="founders-heading"
    >
      <div className="mx-auto max-w-[1440px] px-5 md:px-10 lg:px-12">
        <div data-founders-intro>
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <p
              id="founders-heading"
              className="font-[family-name:var(--font-en)] text-[11px] font-medium uppercase tracking-[0.28em] text-[var(--foreground)]"
            >
              Founder Media
            </p>
            <span
              aria-hidden
              className="h-1.5 w-1.5 rounded-full bg-[var(--brand-teal)]"
            />
            <span className="font-[family-name:var(--font-zh)] text-xs font-medium text-[var(--muted)]">
              访谈 · 栏目
            </span>
          </div>
          <p className="mt-4 max-w-[40rem] font-[family-name:var(--font-zh)] text-sm leading-relaxed text-[var(--muted-strong)] md:text-[15px]">
            同一视域内逐张推进：当前卡随滚动略向后撤，下一张接棒。视频仅在进入视口后挂载
            iframe；离开视口会卸载以节省资源。
          </p>
        </div>

        <div
          className="mt-14 divide-y divide-[var(--hairline)] md:mt-20"
          data-founders-stack
        >
          {FOUNDER_PANELS.map((p) => (
            <article
              key={p.id}
              data-founder-panel
              className="relative first:pt-0"
            >
              <div
                data-founder-card
                className="mx-auto flex min-h-[48svh] max-w-[56rem] flex-col justify-center py-14 md:min-h-[min(85svh,52rem)] md:py-24"
              >
                <p className="font-[family-name:var(--font-en)] text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--brand-teal)]">
                  {p.vol}
                </p>
                <h2 className="mt-3 max-w-[48rem] font-[family-name:var(--font-zh)] text-[1.35rem] font-medium leading-snug text-[var(--foreground)] md:text-3xl md:leading-snug">
                  {p.titleZh}
                </h2>
                <p className="mt-4 font-[family-name:var(--font-en)] text-[11px] uppercase tracking-[0.18em] text-[var(--muted)]">
                  {p.meta}
                </p>
                <p className="mt-8 max-w-[40rem] font-[family-name:var(--font-zh)] text-sm leading-relaxed text-[var(--muted-strong)]">
                  {p.leadZh}
                </p>

                {p.kind === "article" ? (
                  <>
                    {p.githubRepo ? (
                      <GithubRepoCard config={p.githubRepo} />
                    ) : null}
                    <FounderArticleActions
                      href={p.articleHref}
                      linkLabel={p.articleLabel}
                    />
                  </>
                ) : null}

                {p.kind === "video" ? (
                  <FounderLazyBilibili bvid={p.bvid} title={p.titleZh} />
                ) : null}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
