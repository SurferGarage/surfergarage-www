import { FounderVideoStudio } from "@/components/founder-video-studio";
import { FounderWechatColumn } from "@/components/founder-wechat-column";
import { GithubPlaybookBlock } from "@/components/github-playbook-block";
import { SgModuleShell } from "@/components/sg-module-shell";
import { VisualGarage } from "@/components/visual-garage";
import { FOUNDER_STACK_MODULES } from "@/lib/founder-panels";
import {
  FOUNDER_BREATH_MIN_H,
  FOUNDERS_BRIDGE_SECTION_PT,
} from "@/lib/founders-scroll-rhythm";
import { SG_PAGE_SHELL_CLASS } from "@/lib/sg-layout";
import { Fragment } from "react";

/** 单屏 pin 容器 — 始终 100dvh − header，overflow-hidden 防止溢出 */
const PANEL_CARD_BASE =
  "relative flex w-full min-h-0 min-w-0 flex-col overflow-hidden md:h-[calc(100dvh-4.5rem)]";

/** 居中网格内（Playbook / Visual 用） — 标题区 + 内容 padding；顶部 padding 加大避免被 sticky header 切 */
const PANEL_INNER_CENTERED =
  "flex h-full w-full min-h-0 flex-col gap-5 px-5 pt-10 pb-8 md:gap-7 md:px-10 md:pt-14 md:pb-10 lg:px-14 lg:pt-20 lg:pb-12 xl:px-16";

/** 全宽 breakout panel（wechat / video 用） — 两行标题区 + 主体撑满
 * Row 1: § 编号 + eyebrow + metaRight（小字 mono / eyebrow）
 * Row 2: titleZh（大 serif） + titleEn（mono）
 * pt 大幅加大避免被 sticky header 切，加 paper-2 微底色区分层级 */
function FullBleedPanel({
  index,
  eyebrow,
  titleZh,
  titleEn,
  metaRight,
  children,
}: {
  index: string;
  eyebrow: string;
  titleZh: string;
  titleEn: string;
  metaRight?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-full w-full min-h-0 flex-col">
      {/* 顶部双行标题区：明显的 paper-2 暗背 + 大 pt 留白，确保滚到 pin 时清晰可见 */}
      <div className="shrink-0 border-b border-[var(--hairline)] bg-[var(--paper-2)] px-5 pb-5 pt-12 md:px-10 md:pb-6 md:pt-16 lg:px-14 lg:pb-7 lg:pt-20 xl:px-16">
        {/* Row 1：编号 + eyebrow + meta（单行可扫读） */}
        <div className="flex items-baseline justify-between gap-4 max-md:flex-col max-md:items-start max-md:gap-1">
          <div className="flex items-baseline gap-3">
            <span className="editorial-mono text-[10.5px] uppercase tracking-[0.22em] text-[var(--accent-amber)]">
              § {index}
            </span>
            <p className="editorial-eyebrow text-[var(--brand-teal)]">
              {eyebrow}
            </p>
          </div>
          {metaRight ? (
            <p className="editorial-mono text-[10px] uppercase tracking-[0.18em] text-[var(--muted)]">
              {metaRight}
            </p>
          ) : null}
        </div>

        {/* Row 2：大标题（serif） + 英文小标 */}
        <div className="mt-3 flex flex-col gap-2 md:mt-4 md:flex-row md:items-baseline md:gap-5">
          <p className="editorial-serif text-[clamp(1.6rem,3vw,2.4rem)] leading-[1.04] text-[var(--foreground)]">
            {titleZh}
          </p>
          <p className="editorial-eyebrow text-[var(--muted)]">{titleEn}</p>
        </div>
      </div>

      {/* 主体撑满剩余高度 */}
      <div className="min-h-0 flex-1" data-founders-intro>
        {children}
      </div>
    </div>
  );
}

/** 浪前片场 — 三屏 sticky stack（V3）：
 * - 03.a 微信专栏（全宽 breakout）
 * - 03.b 视频播客（全宽 breakout）
 * - 03.c Startup Playbook（居中网格）
 * 桌面 pin/scrub 由 register-desktop-pins 不变接管。 */
export function HomeFounders() {
  return (
    <section
      id="founders"
      className={`scroll-mt-[4.5rem] border-b border-[var(--hairline)] pb-12 md:pb-16 ${FOUNDERS_BRIDGE_SECTION_PT}`}
      aria-label="浪前片场"
    >
      <div className="divide-y divide-[var(--hairline)]" data-founders-stack>
        {FOUNDER_STACK_MODULES.map((m, stackIdx) => {
          const isFullBleed =
            m.kind === "wechat_column" || m.kind === "video_studio";

          return (
            <Fragment key={m.id}>
              <article
                data-founder-panel
                data-founder-module={m.kind}
                className="relative first:pt-0"
              >
                <div data-founder-card className={PANEL_CARD_BASE}>
                  {m.kind === "wechat_column" ? (
                    <FullBleedPanel
                      index={m.index}
                      eyebrow={m.eyebrow}
                      titleZh={m.titleZh}
                      titleEn={m.titleEn}
                      metaRight="点 vol 换篇"
                    >
                      <FounderWechatColumn />
                    </FullBleedPanel>
                  ) : null}

                  {m.kind === "video_studio" ? (
                    <FullBleedPanel
                      index={m.index}
                      eyebrow={m.eyebrow}
                      titleZh={m.titleZh}
                      titleEn={m.titleEn}
                      metaRight="点嘉宾切换"
                    >
                      <FounderVideoStudio />
                    </FullBleedPanel>
                  ) : null}

                  {m.kind === "github_repo" && m.githubRepo ? (
                    <div className={`${SG_PAGE_SHELL_CLASS} ${PANEL_INNER_CENTERED}`}>
                      <SgModuleShell
                        eyebrow={m.eyebrow}
                        sectionIndex={m.index}
                        titleZh={m.titleZh}
                        titleEn={m.titleEn}
                        leadZh={m.leadZh}
                      />
                      <div className="min-h-0 flex-1" data-founders-intro>
                        <GithubPlaybookBlock config={m.githubRepo} />
                      </div>
                    </div>
                  ) : null}

                  {m.kind === "brand_visual" ? (
                    <div className={`${SG_PAGE_SHELL_CLASS} ${PANEL_INNER_CENTERED}`}>
                      <SgModuleShell
                        eyebrow={m.eyebrow}
                        sectionIndex={m.index}
                        titleZh={m.titleZh}
                        titleEn={m.titleEn}
                        leadZh={m.leadZh}
                      />
                      <div className="min-h-0 flex-1" data-founders-intro>
                        <VisualGarage />
                      </div>
                    </div>
                  ) : null}
                  {/* 仅 padding 调试用占位（开发者侧） */}
                  {isFullBleed ? null : null}
                </div>
              </article>
              {stackIdx < FOUNDER_STACK_MODULES.length - 1 ? (
                <div
                  data-founder-breath
                  aria-hidden
                  className={`relative w-screen max-w-[100vw] shrink-0 overflow-hidden ml-[calc(50%-50vw)] ${FOUNDER_BREATH_MIN_H}`}
                >
                  <div
                    data-breath-glow
                    className="sg-founder-breath-glow pointer-events-none absolute inset-[10%_6%] opacity-[0.12] md:inset-[12%_8%]"
                  />
                </div>
              ) : null}
            </Fragment>
          );
        })}
      </div>
    </section>
  );
}
