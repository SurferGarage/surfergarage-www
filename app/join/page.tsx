import type { CSSProperties } from "react";
import type { Metadata } from "next";

import { RecruitForm } from "@/components/recruit-form";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { buildSiteMetadata } from "@/lib/site-metadata";
import { SG_PAGE_SHELL_CLASS, SG_SECTION_TITLE_CLASS } from "@/lib/sg-layout";
import { RECRUIT_ARTICLE_URL, resolveRecruitSource } from "@/lib/recruit-source";
import { SgAmbientGrid } from "@/components/sg-ambient-grid";

export const metadata: Metadata = {
  ...buildSiteMetadata(),
  title: "加入浪前 · 一起造浪 浪前 Surfer Garage",
  description:
    "浪前招募编辑、市场营销、全媒体运营与创业者生态实习生。与我们一起，记录最具创新与冒险精神的一代，在时代浪前看见传统路径之外的可能性。",
  alternates: { canonical: "/join" },
};

const ROLES = [
  {
    title: "编辑实习生",
    tag: "上海 · 内容与采访",
    desc: "负责 Surfing Founders 栏目的深度人物访谈。期待你对人、科技、创业和故事有真实的好奇心。",
    perk: "100–150 元/天",
  },
  {
    title: "市场营销实习生",
    tag: "上海 / 苏州 · 活动与合作",
    desc: "负责浪前生态活动、合作与营销策划。期待你有独特创新的想法，把 Idea 从纸面推到真实场景，让更多用户看到、理解并参与。",
    perk: "100–150 元/天",
  },
  {
    title: "全媒体运营实习生",
    tag: "上海 / 苏州 · 社媒与增长",
    desc: "负责公众号、小红书等平台的社媒运营与增长策略验证。期待你理解什么值得传播、为什么传播，并通过一次次实验找到有效的增长方法。",
    perk: "100–120 元/天",
  },
  {
    title: "创业者生态实习生",
    tag: "上海 / 远程 · 发现与连接",
    desc: "负责创业者 Sourcing、建联、关系维护，以及在场关键科技与创业活动。期待你主动发现值得认识的创业者，走进真实现场，建立长期关系。",
    perk: "100–120 元/天",
  },
] as const;

const PRINCIPLES = [
  ["Winner · 把事情做成", "始终寻找如何把事情做成，对结果负责，在自己的位置上帮助团队赢。"],
  ["Builder · 真正做出来", "从粗糙的想法、模糊的方向开始，在行动中完善和校准。编辑的文章、市场的活动，都是你亲手构建的产品。"],
  ["Genius · 打磨独特能力", "找到自己的兴趣、审美和独特能力，把它们打磨成能够创造价值的本领。我们看见的天赋，远比一份标准履历丰富。"],
  ["Good Guy · 共同创造价值", "真正倾听，愿意理解尚不成熟的想法，珍惜伙伴的利益。面对团队、嘉宾与用户，先问我们可以共同创造什么。"],
] as const;

type JoinPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function first(value: string | string[] | undefined): string {
  if (Array.isArray(value)) return value[0] ?? "";
  return value ?? "";
}

export default async function JoinPage({ searchParams }: JoinPageProps) {
  const sp = await searchParams;
  const source = resolveRecruitSource(first(sp?.src), first(sp?.ref));

  return (
    <div
      style={{ "--surface-mode": 1 } as CSSProperties}
      className="relative isolate flex min-h-full min-w-0 flex-col overflow-x-clip bg-[var(--paper-0)]"
    >
      <SgAmbientGrid />
      <SiteHeader />

      <main className={"relative z-[3] flex-1 " + SG_PAGE_SHELL_CLASS}>
        {/* HERO */}
        <section className="py-24 md:py-32 lg:py-40">
          <h1 className="font-[family-name:var(--font-serif-zh)] text-[clamp(2.6rem,6.2vw,5.5rem)] font-semibold leading-[1.08] tracking-[-0.01em] text-[var(--foreground)]">
            在时代浪前，
            <br />
            与我们一起<span className="text-[var(--brand-teal)]">造浪</span>
          </h1>
          <p className="mt-9 max-w-[44rem] text-[16px] leading-[1.85] text-[var(--muted-strong)] md:text-[18px]">
            我们通过深度人物访谈、视频播客和线下活动，发现、理解和连接 16–28 岁科技创业者。与我们一起，记录最具创新与冒险精神的一代，让更多年轻人看见传统路径之外的可能性。
          </p>
        </section>

        <a
          href={RECRUIT_ARTICLE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mb-12 inline-flex min-h-11 items-center gap-3 text-[15px] text-[var(--brand-teal)] underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-teal)]"
        >
          阅读招募全文：我们在时代浪潮之前，招募船员
          <span aria-hidden>↗</span>
        </a>

        {/* ROLES */}
        <section className="border-t border-[var(--hairline)] py-20 md:py-28">
          <h2 className={SG_SECTION_TITLE_CLASS}>空缺席位</h2>

          <div className="mt-10">
            {ROLES.map((role) => (
              <article
                key={role.title}
                className="grid gap-4 border-b border-[var(--hairline)] py-10 transition-colors hover:bg-[var(--paper-1)] md:grid-cols-12 md:gap-10 md:px-2"
              >
                <div className="md:col-span-8">
                  <h3 className="text-[22px] font-medium text-[var(--foreground)] md:text-[26px]">{role.title}</h3>
                  <p className="mt-3 max-w-[46rem] text-[15px] leading-[1.8] text-[var(--muted-strong)]">{role.desc}</p>
                </div>
                <div className="md:col-span-4 md:pt-1 md:text-right">
                  <p className="text-[14px] text-[var(--brand-teal)]">{role.tag}</p>
                  <p className="mt-2 text-[14px] text-[var(--muted-strong)]">{role.perk}</p>
                </div>
              </article>
            ))}
          </div>

          <p className="mt-8 max-w-[44rem] text-[15px] leading-[1.8] text-[var(--muted-strong)]">
            实习岗位面向国内外在读本科生 / 研究生开放。每周至少投入 4 天，至少实习 3 个月，能够连续投入半年者优先。
          </p>
          <p className="mt-3 max-w-[44rem] text-[14px] leading-[1.8] text-[var(--muted)]">
            核心正职按需面议，欢迎直接投递说明你能解决的问题。
          </p>
        </section>

        {/* PRINCIPLES */}
        <section className="border-t border-[var(--hairline)] py-20 md:py-28">
          <h2 className={SG_SECTION_TITLE_CLASS}>我们在找怎样的人</h2>
          <div className="mt-12 grid gap-x-16 gap-y-12 md:grid-cols-2">
            {PRINCIPLES.map(([title, body]) => (
              <div key={title}>
                <h3 className="text-[19px] font-medium text-[var(--foreground)]">{title}</h3>
                <p className="mt-3 max-w-[32rem] text-[15px] leading-[1.8] text-[var(--muted-strong)]">{body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* APPLY */}
        <section id="apply" className="border-t border-[var(--hairline)] py-20 md:py-28">
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <h2 className={SG_SECTION_TITLE_CLASS}>投递简历</h2>
              <p className="mt-6 max-w-[24rem] text-[15px] leading-[1.8] text-[var(--muted-strong)]">
                留下联系方式与一段自我介绍。我们不看模板，看你解决了什么问题、怎么想、能带来什么。
              </p>
            </div>
            <div className="lg:col-span-8">
              <RecruitForm source={source.label} sourceCode={source.code} refCode={source.refCode} />
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
