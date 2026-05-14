import { FounderArticleActions } from "@/components/founder-article-actions";
import { GithubRepoCard } from "@/components/github-repo-card";
import { WeChatOfficialFeed } from "@/components/wechat-official-feed";
import { FOUNDER_STACK_MODULES } from "@/lib/founder-panels";
import { githubRepoUrl } from "@/lib/github-repo-card";
import {
  DISCORD_INVITE_URL,
  MAIL_HELLO,
  MAIL_PARTNERS,
} from "@/lib/site-contact";
import type { ReactNode } from "react";

function ModuleShell({
  eyebrow,
  titleZh,
  titleEn,
  leadZh,
  children,
}: {
  eyebrow: string;
  titleZh: string;
  titleEn: string;
  leadZh?: string;
  children?: ReactNode;
}) {
  return (
    <>
      <p className="font-[family-name:var(--font-en)] text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--brand-teal)]">
        {eyebrow}
      </p>
      <h2 className="mt-3 max-w-[48rem] font-[family-name:var(--font-zh)] text-[1.35rem] font-medium leading-snug text-[var(--foreground)] md:text-3xl md:leading-snug">
        {titleZh}
      </h2>
      <p className="mt-2 font-[family-name:var(--font-en)] text-[11px] uppercase tracking-[0.18em] text-[var(--muted)]">
        {titleEn}
      </p>
      {leadZh ? (
        <p className="mt-8 max-w-[40rem] font-[family-name:var(--font-zh)] text-sm leading-relaxed text-[var(--muted-strong)]">
          {leadZh}
        </p>
      ) : null}
      {children}
    </>
  );
}

/** 空白占位：虚线框 + 极弱提示，供后续替换为公众号 / 宣传图等。 */
function EmptyModuleCanvas({ label }: { label: string }) {
  return (
    <div
      className="mt-10 flex min-h-[min(40svh,22rem)] w-full min-w-0 flex-col items-center justify-center rounded-sm border border-dashed border-[var(--hairline)] bg-[rgba(19,19,19,0.35)] px-6 py-16 md:mt-12 md:min-h-[min(44svh,26rem)]"
      aria-label={label}
    >
      <span className="font-[family-name:var(--font-en)] text-[10px] uppercase tracking-[0.24em] text-[var(--muted)]">
        Reserved
      </span>
      <span className="sr-only">{label} 内容待定</span>
    </div>
  );
}

/** 叠卡每一屏：与区块 intro 同宽左对齐；桌面 ≥ 一屏高 + 内容垂直居中（pin 时全模块统一） */
const FOUNDER_CARD_BASE =
  "flex w-full min-h-[52svh] min-w-0 flex-col py-10 md:min-h-[100dvh] md:justify-center md:py-8 lg:py-12";

function FounderPanelColumn({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex w-full shrink-0 flex-col md:gap-10">{children}</div>
  );
}

/** Founder Media：五屏全高叠卡；动效钩子与 `register-desktop-pins` 约定不变。 */
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
              全屏模块 · 纵向叠卡
            </span>
          </div>
          <p className="mt-4 max-w-[40rem] font-[family-name:var(--font-zh)] text-sm leading-relaxed text-[var(--muted-strong)] md:text-[15px]">
            以下五屏各占约一整视窗高度：向下滚动时当前屏略向后撤，下一屏接棒（桌面端 pin +
            scrub 与此前一致）。除文案与占位外，布局与动效编排不变。
          </p>
        </div>

        <div
          className="mt-14 divide-y divide-[var(--hairline)] md:mt-20"
          data-founders-stack
        >
          {FOUNDER_STACK_MODULES.map((m) => (
            <article
              key={m.id}
              data-founder-panel
              data-founder-module={m.kind}
              className="relative first:pt-0"
            >
              <div data-founder-card className={FOUNDER_CARD_BASE}>
                {m.kind === "wechat_oa" ? (
                  <div className="flex w-full shrink-0 flex-col md:gap-12">
                    <div className="shrink-0">
                      <ModuleShell
                        eyebrow={m.eyebrow}
                        titleZh={m.titleZh}
                        titleEn={m.titleEn}
                      />
                    </div>
                    <div className="flex w-full md:justify-center">
                      <WeChatOfficialFeed />
                    </div>
                  </div>
                ) : null}

                {m.kind === "video_channel" ? (
                  <FounderPanelColumn>
                    <ModuleShell
                      eyebrow={m.eyebrow}
                      titleZh={m.titleZh}
                      titleEn={m.titleEn}
                      leadZh={m.leadZh}
                    >
                      <div className="mt-10 rounded-sm border border-[var(--hairline)] bg-[rgba(19,19,19,0.45)] px-5 py-10 md:mt-12 md:px-8 md:py-14">
                        <p className="font-[family-name:var(--font-zh)] text-sm text-[var(--muted)] md:text-[15px]">
                          视频列表与封面网格将接在矩阵投放策略确定后配置；当前为结构占位。
                        </p>
                      </div>
                    </ModuleShell>
                  </FounderPanelColumn>
                ) : null}

                {m.kind === "github_repo" && m.githubRepo ? (
                  <FounderPanelColumn>
                    <ModuleShell
                      eyebrow={m.eyebrow}
                      titleZh={m.titleZh}
                      titleEn={m.titleEn}
                      leadZh={m.leadZh}
                    >
                      <GithubRepoCard config={m.githubRepo} />
                      <FounderArticleActions
                        href={githubRepoUrl(m.githubRepo)}
                        linkLabel="在 GitHub 打开 Startup Playbook"
                      />
                    </ModuleShell>
                  </FounderPanelColumn>
                ) : null}

                {m.kind === "promo_visual" ? (
                  <FounderPanelColumn>
                    <ModuleShell
                      eyebrow={m.eyebrow}
                      titleZh={m.titleZh}
                      titleEn={m.titleEn}
                    >
                      <EmptyModuleCanvas label="宣传图片" />
                    </ModuleShell>
                  </FounderPanelColumn>
                ) : null}

                {m.kind === "contact" ? (
                  <FounderPanelColumn>
                    <ModuleShell
                      eyebrow={m.eyebrow}
                      titleZh={m.titleZh}
                      titleEn={m.titleEn}
                      leadZh={m.leadZh}
                    >
                      <div className="mt-10 flex max-w-[40rem] flex-col gap-3 sm:flex-row sm:flex-wrap md:mt-12">
                        <a
                          href="#call"
                          className="inline-flex items-center justify-center rounded-sm border border-[var(--hairline)] bg-[rgba(19,19,19,0.55)] px-5 py-3 font-[family-name:var(--font-zh)] text-sm text-[var(--foreground)] transition-colors hover:border-[var(--brand-teal)]/45 hover:text-[var(--brand-teal)]"
                        >
                          前往 The Call（社群与二维码）
                        </a>
                        <a
                          href={DISCORD_INVITE_URL}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center rounded-sm border border-[var(--hairline)] px-5 py-3 font-[family-name:var(--font-en)] text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--muted-strong)] transition-colors hover:border-[var(--brand-teal)]/40 hover:text-[var(--brand-teal)]"
                        >
                          Discord ↗
                        </a>
                        <a
                          href={`mailto:${MAIL_HELLO}`}
                          className="inline-flex items-center justify-center rounded-sm border border-[var(--hairline)] px-5 py-3 font-[family-name:var(--font-en)] text-[11px] uppercase tracking-[0.12em] text-[var(--muted-strong)] transition-colors hover:border-[var(--brand-teal)]/40 hover:text-[var(--foreground)]"
                        >
                          {MAIL_HELLO}
                        </a>
                        <a
                          href={`mailto:${MAIL_PARTNERS}`}
                          className="inline-flex items-center justify-center rounded-sm border border-[var(--hairline)] px-5 py-3 font-[family-name:var(--font-en)] text-[11px] uppercase tracking-[0.12em] text-[var(--muted-strong)] transition-colors hover:border-[var(--brand-teal)]/40 hover:text-[var(--foreground)]"
                        >
                          {MAIL_PARTNERS}
                        </a>
                      </div>
                    </ModuleShell>
                  </FounderPanelColumn>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
