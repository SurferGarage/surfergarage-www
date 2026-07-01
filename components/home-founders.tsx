import dynamic from "next/dynamic";
import { GithubPlaybookBlock } from "@/components/github-playbook-block";
import { SgModuleShell } from "@/components/sg-module-shell";
import { FOUNDER_STACK_MODULES } from "@/lib/founder-panels";
import { SgVisSectionHeader } from "@/components/sg-vis-section-header";
import { visPillForFounderKind, type SgVisPillId } from "@/lib/sg-vis";
import {
  FOUNDER_BREATH_MIN_H,
  FOUNDERS_BRIDGE_SECTION_PT,
} from "@/lib/founders-scroll-rhythm";
import { SG_PAGE_SHELL_CLASS } from "@/lib/sg-layout";
import { Fragment } from "react";

const FounderWechatColumn = dynamic(
  () =>
    import("@/components/founder-wechat-column").then((m) => ({
      default: m.FounderWechatColumn,
    })),
  { ssr: true },
);

const FounderVideoStudio = dynamic(
  () =>
    import("@/components/founder-video-studio").then((m) => ({
      default: m.FounderVideoStudio,
    })),
  { ssr: true },
);

const VisualGarage = dynamic(
  () =>
    import("@/components/visual-garage").then((m) => ({
      default: m.VisualGarage,
    })),
  { ssr: true },
);

/** 单屏 pin 容器 — 始终 100dvh − header，overflow-hidden 防止溢出 */
const PANEL_CARD_BASE =
  "relative flex w-full min-h-0 min-w-0 flex-col overflow-hidden md:h-[calc(100dvh-4.5rem)]";

/** 居中网格内（Playbook / Visual 用） — 标题区 + 内容 padding；顶部 padding 加大避免被 sticky header 切 */
const PANEL_INNER_CENTERED =
  "flex h-full w-full min-h-0 flex-col gap-6 px-5 pt-12 pb-10 md:gap-8 md:px-10 md:pt-16 md:pb-12 lg:px-14 lg:pt-20 lg:pb-14 xl:px-16";

function FullBleedPanel({
  titleZh,
  pill,
  titleEn,
  children,
}: {
  titleZh: string;
  pill: SgVisPillId;
  titleEn?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-full w-full min-h-0 flex-col">
      <div className="shrink-0 border-b border-[var(--hairline)] px-5 pb-6 pt-12 md:px-10 md:pb-7 md:pt-16 lg:px-14 lg:pt-20 xl:px-16">
        <SgVisSectionHeader titleZh={titleZh} pill={pill} titleEn={titleEn} />
      </div>
      <div className="min-h-0 flex-1 bg-[var(--paper-1)]" data-founders-intro>
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
                      titleZh={m.titleZh}
                      pill={visPillForFounderKind(m.kind)}
                      titleEn="SURFING FOUNDERS"
                    >
                      <FounderWechatColumn />
                    </FullBleedPanel>
                  ) : null}

                  {m.kind === "video_studio" ? (
                    <FullBleedPanel
                      titleZh={m.titleZh}
                      pill={visPillForFounderKind(m.kind)}
                      titleEn="VIDEO PODCAST"
                    >
                      <FounderVideoStudio />
                    </FullBleedPanel>
                  ) : null}

                  {m.kind === "github_repo" && m.githubRepo ? (
                    <div className={`${SG_PAGE_SHELL_CLASS} ${PANEL_INNER_CENTERED}`}>
                      <SgModuleShell
                        titleZh={m.titleZh}
                        visPill={visPillForFounderKind(m.kind)}
                        titleEn="STARTUP PLAYBOOK"
                      />
                      <div className="min-h-0 flex-1" data-founders-intro>
                        <GithubPlaybookBlock config={m.githubRepo} />
                      </div>
                    </div>
                  ) : null}

                  {m.kind === "brand_visual" ? (
                    <div className={`${SG_PAGE_SHELL_CLASS} ${PANEL_INNER_CENTERED}`}>
                      <SgModuleShell
                        titleZh={m.titleZh}
                        visPill={visPillForFounderKind(m.kind)}
                        titleEn="BRAND KIT"
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
