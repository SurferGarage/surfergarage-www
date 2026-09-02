import type { CSSProperties } from "react";
import type { Metadata } from "next";

import { RecruitForm } from "@/components/recruit-form";
import { MAIL_HELLO } from "@/lib/site-contact";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { buildSiteMetadata } from "@/lib/site-metadata";
import { SG_PAGE_SHELL_CLASS, SG_SECTION_TITLE_CLASS } from "@/lib/sg-layout";
import { resolveRecruitSource } from "@/lib/recruit-source";
import { SgAmbientGrid } from "@/components/sg-ambient-grid";

export const metadata: Metadata = {
  ...buildSiteMetadata(),
  title: "加入浪前 · 一起造浪 浪前 Surfer Garage",
  description:
    "浪前招聘入口：Surfing Founder 编辑、业务商务、线下渠道与 Agency Intern。加入平均年龄 20 的 05 后创业团队，从 0 到 1 上手真实业务。",
  alternates: { canonical: "/join" },
};

const ROLES = [
  {
    title: "Surfing Founder 编辑实习生",
    tag: "内容 · 采访",
    desc: "有商业媒体经验，能在一个月内独立产出 SF 访谈文章；深度理解科技与创业文化，会采访、会写、有亲和力。",
    perk: "100–150 / 日 · 行业头部水平",
  },
  {
    title: "业务商务实习生",
    tag: "商业化",
    desc: "有媒体商务经验，理解商务与谈判全流程；有快速合作资源者加分，与团队一起搭建 SF 商业化管线。",
    perk: "100–150 / 日 · 行业头部水平",
  },
  {
    title: "线下渠道 & 活动运营 Intern",
    tag: "增长 · 线下",
    desc: "负责西浦百团/演讲等线下渠道与雇主营销；稳定投入、学习快、做事细致，把已有 SOP 的管线跑起来。",
    perk: "实习证明 + 团建 + 转正机会",
  },
  {
    title: "Agency Intern（探索实习生）",
    tag: "新方向探索",
    desc: "好奇心强、执行力强、能结构化复盘；用低成本探索不确定性机会，remote 可选。",
    perk: "实习证明 + 转正机会",
  },
] as const;

const PRINCIPLES = [
  ["招人是为了解决问题", "先想清楚要解决什么问题；业务初期如果带人反而是负担，就不急着招。"],
  ["AI-Native 先行", "招人之前先问：这件事 Agent 能不能稳定交付？先跑通业务，再上 AI。"],
  ["30% 探索", "一个创新组织至少有 30% 时间与投入花在探索新价值与创新上。"],
  ["线下优先", "长期线下 > 一周线下 1–2 天 + remote，远远大于长期 remote。"],
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
            把事做成的人，
            <br />
            到这里<span className="text-[var(--brand-teal)]">汇聚</span>
          </h1>
          <p className="mt-9 max-w-[44rem] text-[16px] leading-[1.85] text-[var(--muted-strong)] md:text-[18px]">
            我们是一支平均年龄 20 的极早期创业团队，记录 16–28 岁科技创业者的真实现场。招聘不是填空位，是找能一起解决问题、把管线跑通的人。
          </p>
        </section>

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

          <p className="mt-8 max-w-[44rem] text-[14px] text-[var(--muted)]">
            核心正职按需面议，欢迎直接投递说明你能解决的问题。联系邮箱{" "}
            <a href={"mailto:" + MAIL_HELLO} className="text-[var(--brand-teal)] underline-offset-4 hover:underline">
              {MAIL_HELLO}
            </a>
          </p>
        </section>

        {/* PRINCIPLES */}
        <section className="border-t border-[var(--hairline)] py-20 md:py-28">
          <h2 className={SG_SECTION_TITLE_CLASS}>我们的原则</h2>
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
