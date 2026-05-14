import type { ReactNode } from "react";
import { FounderArticleActions } from "@/components/founder-article-actions";
import { GithubRepoCard } from "@/components/github-repo-card";
import {
  FOUNDER_MEDIA_GITHUB_PAGE_URL,
  FOUNDER_MEDIA_GITHUB_REPO,
} from "@/lib/founder-media-modules";
import {
  DISCORD_INVITE_URL,
  MAIL_HELLO,
  MAIL_PARTNERS,
} from "@/lib/site-contact";

function ModuleShell({
  id,
  titleEn,
  titleZh,
  children,
}: {
  id: string;
  titleEn: string;
  titleZh: string;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      className="scroll-mt-[4.5rem] border-b border-[var(--hairline)] py-14 md:py-16"
      aria-labelledby={`${id}-heading`}
    >
      <div className="mx-auto max-w-[56rem]">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <p
            id={`${id}-heading`}
            className="font-[family-name:var(--font-en)] text-[11px] font-medium uppercase tracking-[0.28em] text-[var(--foreground)]"
          >
            {titleEn}
          </p>
          <span
            aria-hidden
            className="h-1.5 w-1.5 rounded-full bg-[var(--brand-teal)]"
          />
          <span className="font-[family-name:var(--font-zh)] text-xs font-medium text-[var(--muted)]">
            {titleZh}
          </span>
        </div>
        <div className="mt-8">{children}</div>
      </div>
    </section>
  );
}

/** Founder Media：微信公众号 / 视频号 / GitHub / 宣传图 / 联系 — 五大子区块（桌面叠卡 pin 已移除）。 */
export function HomeFounders() {
  return (
    <div
      id="founders"
      className="scroll-mt-[4.5rem] border-b border-[var(--hairline)]"
      aria-labelledby="founders-heading"
    >
      <div className="mx-auto max-w-[1440px] px-5 md:px-10 lg:px-12">
        <div className="py-16 md:py-20" data-founders-intro>
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
              品牌与内容矩阵
            </span>
          </div>
          <p className="mt-4 max-w-[40rem] font-[family-name:var(--font-zh)] text-sm leading-relaxed text-[var(--muted-strong)] md:text-[15px]">
            以下分区独立编排：公众号、视频号、开源仓库、宣传物料与联系入口。各区块可单独迭代内容与动效。
          </p>
        </div>
      </div>

      <div data-founders-modules>
        <div className="mx-auto max-w-[1440px] px-5 md:px-10 lg:px-12">
          <ModuleShell
            id="founders-wechat"
            titleEn="WeChat Official"
            titleZh="微信公众号"
          >
            <div
              className="flex min-h-[14rem] items-center justify-center rounded-sm border border-dashed border-[var(--hairline)] bg-[rgba(19,19,19,0.35)] px-6 py-12"
              aria-label="微信公众号内容待定"
            >
              <p className="max-w-md text-center font-[family-name:var(--font-zh)] text-sm leading-relaxed text-[var(--muted)]">
                此区域预留给微信公众号相关内容；版式与文案后续再定义。
              </p>
            </div>
          </ModuleShell>
        </div>

        <div className="mx-auto max-w-[1440px] px-5 md:px-10 lg:px-12">
          <ModuleShell
            id="founders-video"
            titleEn="Video Channels"
            titleZh="视频号"
          >
            <p className="max-w-[40rem] font-[family-name:var(--font-zh)] text-sm leading-relaxed text-[var(--muted-strong)]">
              面向各视频媒体矩阵投放的栏目与单条内容将汇总在此；具体列表与播放器形态后续接入。
            </p>
            <div
              className="mt-8 flex min-h-[12rem] items-center justify-center rounded-sm border border-dashed border-[var(--hairline)] bg-[rgba(19,19,19,0.35)] px-6 py-10"
              aria-label="视频号内容占位"
            >
              <p className="text-center font-[family-name:var(--font-zh)] text-sm text-[var(--muted)]">
                内容占位 · 待定
              </p>
            </div>
          </ModuleShell>
        </div>

        <div className="mx-auto max-w-[1440px] px-5 md:px-10 lg:px-12">
          <ModuleShell
            id="founders-github"
            titleEn="GitHub"
            titleZh="开源仓库"
          >
            <p className="max-w-[40rem] font-[family-name:var(--font-zh)] text-sm leading-relaxed text-[var(--muted-strong)]">
              展示仓库侧动态与说明；实时 Stars 等数据接入后在此开启遥测展示。
            </p>
            <div className="mt-6 md:mt-8">
              <GithubRepoCard config={FOUNDER_MEDIA_GITHUB_REPO} />
            </div>
            <FounderArticleActions
              href={FOUNDER_MEDIA_GITHUB_PAGE_URL}
              linkLabel="在 GitHub 打开 Startup Playbook"
            />
          </ModuleShell>
        </div>

        <div className="mx-auto max-w-[1440px] px-5 md:px-10 lg:px-12">
          <ModuleShell
            id="founders-promo"
            titleEn="Press Kit"
            titleZh="宣传图片"
          >
            <div
              className="flex min-h-[16rem] items-center justify-center rounded-sm border border-dashed border-[var(--hairline)] bg-[rgba(19,19,19,0.35)] px-6 py-14"
              aria-label="宣传图片待定"
            >
              <p className="max-w-md text-center font-[family-name:var(--font-zh)] text-sm leading-relaxed text-[var(--muted)]">
                此区域预留给品牌与活动宣传图；栅格与裁切比例后续再定。
              </p>
            </div>
          </ModuleShell>
        </div>

        <div className="mx-auto max-w-[1440px] px-5 md:px-10 lg:px-12">
          <ModuleShell
            id="founders-contact"
            titleEn="Contact Me"
            titleZh="联系与社群"
          >
            <p className="max-w-[40rem] font-[family-name:var(--font-zh)] text-sm leading-relaxed text-[var(--muted-strong)]">
              加入社群、添加助手或联系 Founders：完整流程与二维码见下方 The Call；此处提供直达入口。
            </p>
            <ul className="mt-8 flex flex-col gap-3 font-[family-name:var(--font-zh)] text-sm text-[var(--foreground)] md:flex-row md:flex-wrap md:gap-4">
              <li>
                <a
                  href="#call"
                  className="rounded-sm border border-[var(--hairline)] px-4 py-2.5 transition-colors hover:border-[var(--brand-teal)]/45 hover:text-[var(--brand-teal)]"
                >
                  前往 The Call（助手与二维码）
                </a>
              </li>
              <li>
                <a
                  href={DISCORD_INVITE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-sm border border-[var(--hairline)] px-4 py-2.5 transition-colors hover:border-[var(--brand-teal)]/45 hover:text-[var(--brand-teal)]"
                >
                  Discord 社群
                  <span className="font-[family-name:var(--font-en)] text-xs text-[var(--muted)]">
                    ↗
                  </span>
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${MAIL_HELLO}`}
                  className="rounded-sm border border-[var(--hairline)] px-4 py-2.5 transition-colors hover:border-[var(--brand-teal)]/45 hover:text-[var(--brand-teal)]"
                >
                  {MAIL_HELLO}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${MAIL_PARTNERS}`}
                  className="rounded-sm border border-[var(--hairline)] px-4 py-2.5 transition-colors hover:border-[var(--brand-teal)]/45 hover:text-[var(--brand-teal)]"
                >
                  合作 · {MAIL_PARTNERS}
                </a>
              </li>
            </ul>
          </ModuleShell>
        </div>
      </div>
    </div>
  );
}
