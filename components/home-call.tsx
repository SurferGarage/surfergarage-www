"use client";

import { AssistantQrSlot } from "@/components/assistant-qr-slot";
import { TeamMemberPortrait } from "@/components/team-member-portrait";
import {
  DISCORD_INVITE_URL,
  MAIL_HELLO,
  MAIL_PARTNERS,
} from "@/lib/site-contact";
import { SURFER_GARAGE_TEAM } from "@/lib/site-team";
import {
  SG_BODY_ZH_CLASS,
  SG_PAGE_SHELL_CLASS,
  SG_SECTION_TITLE_CLASS,
} from "@/lib/sg-layout";
import { useCallback, useState, type ReactNode } from "react";

const WECHAT_ID = "x3167056428";

const WHAT_FOR_US: ReadonlyArray<string> = [
  "手上有可核对产出",
  "能聊代价与复盘",
  "非共识路径上的建造者",
];

const NOT_FOR_US: ReadonlyArray<string> = [
  "只要曝光 · 找媒体",
  "卖课 · 套模板",
  "投递 · 走 partners 邮箱",
];

const sectionEyebrow =
  "editorial-eyebrow font-[family-name:var(--font-zh)] text-[var(--muted)]";

type ToastState = { id: string | null; label: string };

function CallBlock({
  id,
  eyebrow,
  title,
  children,
}: {
  id: string;
  eyebrow: string;
  title?: string;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      data-call-block
      className="border-t border-[var(--hairline)] py-14 md:py-20"
      aria-labelledby={`${id}-heading`}
    >
      <div className="grid grid-cols-1 gap-8 md:grid-cols-12 md:gap-10 lg:gap-14">
        <header className="md:col-span-4 md:pt-1" data-call-intro>
          <p className={sectionEyebrow}>{eyebrow}</p>
          {title ? (
            <h3
              id={`${id}-heading`}
              className="mt-3 font-[family-name:var(--font-zh)] text-[clamp(1.35rem,2.2vw,1.75rem)] font-medium leading-snug text-[var(--foreground)]"
            >
              {title}
            </h3>
          ) : (
            <h3 id={`${id}-heading`} className="sr-only">
              {eyebrow}
            </h3>
          )}
        </header>
        <div className="md:col-span-8">{children}</div>
      </div>
    </section>
  );
}

export function HomeCall() {
  const [toast, setToast] = useState<ToastState>({ id: null, label: "" });

  const fireToast = useCallback((id: string, label: string) => {
    setToast({ id, label });
    window.setTimeout(() => {
      setToast((prev) => (prev.id === id ? { id: null, label: "" } : prev));
    }, 2400);
  }, []);

  const copyWeChat = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(WECHAT_ID);
      fireToast("wechat", "已复制微信号");
    } catch {
      window.prompt("复制微信号", WECHAT_ID);
    }
  }, [fireToast]);

  return (
    <section
      id="call"
      className="relative scroll-mt-[4.5rem] overflow-hidden border-b border-[var(--hairline)] py-20 md:py-28"
      aria-labelledby="call-heading"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -right-32 top-[18%] h-[22rem] w-[22rem] rounded-full bg-[radial-gradient(circle,rgba(39,215,199,0.22)_0%,rgba(11,12,16,0)_72%)] blur-3xl"
      />

      <div className={SG_PAGE_SHELL_CLASS}>
        <header
          className="sg-spotlight-host max-w-[46rem]"
          data-call-intro
          data-spotlight="amber"
        >
          <h2 id="call-heading" className={SG_SECTION_TITLE_CLASS}>
            联络
          </h2>
          <p className={`${SG_BODY_ZH_CLASS} mt-5 max-w-[34rem]`}>
            先认人，再选对入口。建造者、合作伙伴与社区成员，走不同的门。
          </p>
        </header>

        <div className="mt-10 md:mt-14">
          {/* —— 1. 核心成员 —— */}
          <CallBlock id="call-team" eyebrow="核心成员" title="谁在浪前">
            <ul
              className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8"
              data-call-item
            >
              {SURFER_GARAGE_TEAM.map((member) => (
                <li key={member.id} className="flex flex-col gap-5">
                  <TeamMemberPortrait
                    nameZh={member.nameZh}
                    portraitSrc={member.portraitSrc}
                  />
                  <div className="flex flex-col gap-2">
                    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                      <p className="font-[family-name:var(--font-zh)] text-[clamp(1.2rem,2vw,1.45rem)] font-medium text-[var(--foreground)]">
                        {member.nameZh}
                      </p>
                      {member.nameEn ? (
                        <span className="font-[family-name:var(--font-en)] text-[13px] tracking-[0.04em] text-[var(--muted)]">
                          {member.nameEn}
                        </span>
                      ) : null}
                    </div>
                    <p className="font-[family-name:var(--font-zh)] text-[14px] text-[var(--brand-teal)] md:text-[15px]">
                      {member.roleZh}
                    </p>
                    <p className="font-[family-name:var(--font-zh)] text-[15px] leading-[1.65] text-[var(--muted-strong)] md:text-[16px]">
                      {member.bioZh}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </CallBlock>

          {/* —— 2. 加入浪前 —— */}
          <CallBlock id="call-join" eyebrow="加入浪前" title="我们在找什么样的人">
            <div className="flex flex-col gap-10" data-call-item>
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-10">
                <div>
                  <p className="border-b border-[var(--hairline-soft)] pb-3 font-[family-name:var(--font-zh)] text-[15px] text-[var(--brand-teal)] md:text-[16px]">
                    适合
                  </p>
                  <ul className="mt-5 flex flex-col gap-4">
                    {WHAT_FOR_US.map((line) => (
                      <li key={line}>
                        <p className="font-[family-name:var(--font-zh)] text-[16px] leading-snug text-[var(--foreground)] md:text-[17px]">
                          {line}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="border-b border-[var(--hairline-soft)] pb-3 font-[family-name:var(--font-zh)] text-[15px] text-[var(--muted-strong)] md:text-[16px]">
                    不适合
                  </p>
                  <ul className="mt-5 flex flex-col gap-4">
                    {NOT_FOR_US.map((line) => (
                      <li key={line}>
                        <p className="font-[family-name:var(--font-zh)] text-[16px] leading-snug text-[var(--muted-strong)] md:text-[17px]">
                          {line}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="flex flex-col gap-5 border-t border-[var(--hairline-soft)] pt-8 md:flex-row md:items-center md:justify-between md:gap-8">
                <div className="min-w-0">
                  <p className="font-[family-name:var(--font-zh)] text-[clamp(1.15rem,2vw,1.4rem)] font-medium text-[var(--foreground)]">
                    提交手搓项目
                  </p>
                  <p className="mt-2 font-[family-name:var(--font-zh)] text-[15px] text-[var(--muted-strong)] md:text-[16px]">
                    微信添加小浪，附一句你在做什么、可核对的链接或 demo。
                  </p>
                </div>
                <button
                  type="button"
                  onClick={copyWeChat}
                  aria-label={`复制微信号 ${WECHAT_ID}`}
                  className="group inline-flex shrink-0 items-center gap-4 rounded-sm border border-[var(--hairline)] bg-[var(--paper-1)] px-5 py-4 transition-[border-color,background-color] hover:border-[color-mix(in_oklch,var(--brand-teal)_45%,var(--hairline-strong))] hover:bg-[var(--paper-2)]"
                >
                  <span className="font-[family-name:var(--font-en)] text-[clamp(1.05rem,2.5vw,1.35rem)] font-medium tracking-[-0.01em] text-[var(--foreground)]">
                    {WECHAT_ID}
                  </span>
                  <span
                    className={`font-[family-name:var(--font-zh)] text-[14px] transition-colors md:text-[15px] ${
                      toast.id === "wechat"
                        ? "text-[var(--brand-teal)]"
                        : "text-[var(--muted)] group-hover:text-[var(--foreground)]"
                    }`}
                  >
                    {toast.id === "wechat" ? toast.label : "复制"}
                  </span>
                </button>
              </div>
            </div>
          </CallBlock>

          {/* —— 3. 商务合作 —— */}
          <CallBlock id="call-partners" eyebrow="商务合作" title="媒体 · 演讲 · 生态">
            <ul className="flex flex-col divide-y divide-[var(--hairline-soft)]" data-call-item>
              <li className="py-6 first:pt-0">
                <a
                  href={`mailto:${MAIL_HELLO}`}
                  className="group block rounded-sm"
                >
                  <p className="break-all font-[family-name:var(--font-en)] text-[clamp(1.25rem,3.5vw,2rem)] font-medium leading-tight text-[var(--foreground)] transition-opacity group-hover:opacity-85">
                    {MAIL_HELLO}
                  </p>
                  <p className="mt-2 font-[family-name:var(--font-zh)] text-[15px] text-[var(--muted-strong)] md:text-[16px]">
                    品牌合作 · 演讲邀请 · 媒体采访
                  </p>
                </a>
              </li>
              <li className="py-6">
                <a
                  href={`mailto:${MAIL_PARTNERS}`}
                  className="group block rounded-sm"
                >
                  <p className="break-all font-[family-name:var(--font-en)] text-[clamp(1.25rem,3.5vw,2rem)] font-medium leading-tight text-[var(--foreground)] transition-opacity group-hover:opacity-85">
                    {MAIL_PARTNERS}
                  </p>
                  <p className="mt-2 font-[family-name:var(--font-zh)] text-[15px] text-[var(--muted-strong)] md:text-[16px]">
                    生态伙伴 · 联合出品 · 赞助与资源置换
                  </p>
                </a>
              </li>
            </ul>
          </CallBlock>

          {/* —— 4. 加入社区 —— */}
          <CallBlock id="call-community" eyebrow="加入社区" title="日常活动与讨论">
            <div
              className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-10"
              data-call-item
            >
              <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:gap-8">
                <AssistantQrSlot />
                <div className="min-w-0 flex-1">
                  <p className="font-[family-name:var(--font-zh)] text-[clamp(1.15rem,2vw,1.4rem)] font-medium text-[var(--foreground)]">
                    加小浪微信
                  </p>
                  <p className="mt-2 font-[family-name:var(--font-zh)] text-[15px] leading-[1.65] text-[var(--muted-strong)] md:text-[16px]">
                    入群通知、线下活动与季播更新。扫码或搜索微信号添加。
                  </p>
                </div>
              </div>

              <a
                href={DISCORD_INVITE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex min-h-[8.5rem] flex-col justify-between rounded-sm border border-[var(--hairline)] bg-[var(--paper-1)] px-6 py-6 transition-[border-color,background-color] hover:border-[color-mix(in_oklch,var(--brand-teal)_45%,var(--hairline-strong))] hover:bg-[var(--paper-2)] md:px-7 md:py-7"
              >
                <div>
                  <p className="font-[family-name:var(--font-zh)] text-[clamp(1.15rem,2vw,1.4rem)] font-medium text-[var(--foreground)]">
                    Discord 社群
                  </p>
                  <p className="mt-2 font-[family-name:var(--font-zh)] text-[15px] leading-[1.65] text-[var(--muted-strong)] md:text-[16px]">
                    异步讨论、活动召集与海外成员入口。
                  </p>
                </div>
                <span
                  aria-hidden
                  className="mt-6 font-[family-name:var(--font-zh)] text-[15px] text-[var(--brand-teal)] transition-colors group-hover:text-[var(--foreground)]"
                >
                  进入 Discord ↗
                </span>
              </a>
            </div>
          </CallBlock>
        </div>
      </div>
    </section>
  );
}

/** @deprecated 匹配度已并入 `#call-join`；保留空壳避免旧锚点 `#fit` 404 */
export function HomeFit() {
  return (
    <section
      id="fit"
      data-fit-panel
      className="sr-only"
      aria-hidden
      tabIndex={-1}
    />
  );
}
