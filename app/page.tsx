import { HomeCall } from "@/components/home-call";
import { GlowRiver } from "@/components/glow-river";
import { HomeHero } from "@/components/home-hero";
import { HomeScrollChoreography } from "@/components/home-scroll-choreography";
import Image from "next/image";

const proofStreams: {
  key: string;
  titleEn: string;
  titleZh: string;
  introZh?: string;
  rows: { title: string; meta: string; href?: string }[];
}[] = [
  {
    key: "founder-talk",
    titleEn: "Founder Talk",
    titleZh: "深度访谈",
    introZh: "拒绝造神，保留失败与代价账本；讲动作，不讲神话。",
    rows: [
      {
        title: "Vol.001 真正值得听的建议，来自海里的人",
        meta: "发刊词 · 待上架",
      },
    ],
  },
  {
    key: "coffee-chat",
    titleEn: "Coffee Chat",
    titleZh: "线下碰撞",
    introZh: "带着真实问题下场，不聊空趋势，只拆可执行路径。",
    rows: [
      {
        title:
          "拒绝平庸社交：寻找长三角的 19 岁硬件极客与 AI 独立开发者",
        meta: "咖啡局 · 滚动开放",
        href: "#",
      },
    ],
  },
  {
    key: "builder-lab",
    titleEn: "Builder Lab",
    titleZh: "闭门会",
    introZh: "手搓、试错、复盘。所有讨论以可验证闭环为终点。",
    rows: [
      {
        title: "48小时黑客松复盘：从 Demo 到验证",
        meta: "Lab · 纪要向会员发放",
        href: "#",
      },
    ],
  },
];

export default function Home() {
  return (
    <div className="relative flex min-h-full flex-col">
      <GlowRiver />

      <header className="sticky top-0 z-10 border-b border-[var(--hairline)] bg-[var(--background)]/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between px-5 py-4 md:px-10 lg:px-12">
          <a
            href="#manifesto"
            className="flex items-center gap-2.5 font-[family-name:var(--font-en)] text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--foreground)] transition-opacity hover:opacity-70"
          >
            <Image
              src="/brand-sg-logo.png"
              alt="SurferGarage logo"
              width={32}
              height={32}
              className="h-8 w-8 object-contain"
              priority
            />
            <span className="text-[var(--brand-primary)]">Surfer</span>Garage
          </a>
          <nav
            className="hidden gap-9 font-[family-name:var(--font-en)] text-[11px] uppercase tracking-[0.18em] md:flex"
            aria-label="Primary"
          >
            <a
              href="#manifesto"
              className="text-[var(--muted)] transition-colors hover:text-[var(--brand-teal)]"
            >
              Manifesto
            </a>
            <a
              href="#proof"
              className="text-[var(--muted)] transition-colors hover:text-[var(--brand-teal)]"
            >
              The Proof
            </a>
            <a
              href="#call"
              className="text-[var(--muted)] transition-colors hover:text-[var(--brand-teal)]"
            >
              The Call
            </a>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <HomeHero />

        <section
          id="proof"
          className="scroll-mt-[4.5rem] border-b border-[var(--hairline)] py-20 md:py-28"
          aria-labelledby="proof-heading"
        >
          <div className="mx-auto grid w-full max-w-[1440px] grid-cols-12 gap-x-4 px-5 md:gap-x-6 lg:px-12">
            <div
              className="col-span-12 md:col-span-4 md:pr-8"
              data-proof-pin
            >
              <p
                id="proof-heading"
                className="font-[family-name:var(--font-en)] text-[11px] font-medium uppercase tracking-[0.28em] text-[var(--brand-primary)]"
              >
                The Proof
              </p>
              <p className="mt-4 font-[family-name:var(--font-zh)] text-[15px] leading-relaxed text-[var(--muted-strong)]">
                我们不讲趋势预测，只记录真实动作。每条内容都要有决策、代价、验证结果；没有证据链，就不发布。
              </p>
            </div>

            <div
              className="col-span-12 mt-14 md:col-span-7 md:col-start-6 md:mt-0"
              data-proof-streams
            >
              {proofStreams.map((stream, streamIndex) => (
                <div
                  key={stream.key}
                  data-proof-stream
                  className={
                    streamIndex === 0
                      ? ""
                      : "mt-16 border-t border-[var(--hairline)] pt-16 md:mt-20 md:pt-20"
                  }
                >
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <h2 className="font-[family-name:var(--font-en)] text-sm font-semibold uppercase tracking-[0.14em] text-[var(--foreground)]">
                      {stream.titleEn}
                    </h2>
                    <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-[var(--brand-teal)]" />
                    <span className="font-[family-name:var(--font-zh)] text-sm font-medium text-[var(--muted)]">
                      {stream.titleZh}
                    </span>
                  </div>
                  {stream.introZh ? (
                    <p className="mt-4 font-[family-name:var(--font-zh)] text-[13px] leading-relaxed text-[var(--muted)] md:text-sm">
                      {stream.introZh}
                    </p>
                  ) : null}

                  <ul className="mt-8 border-t border-[var(--hairline)]">
                    {stream.rows.map((row) => (
                      <li
                        key={`${stream.key}-${row.title}`}
                        className="border-b border-[var(--hairline)]"
                      >
                        {row.href ? (
                          <a
                            href={row.href}
                            className="group grid grid-cols-12 gap-x-4 py-5 md:py-[1.125rem] md:items-baseline"
                          >
                            <span className="col-span-12 font-[family-name:var(--font-zh)] text-[15px] font-medium leading-snug text-[var(--foreground)] transition-colors group-hover:text-[var(--muted-strong)] md:col-span-7 lg:col-span-8">
                              {row.title}
                            </span>
                            <span className="col-span-12 mt-2 font-[family-name:var(--font-en)] text-[11px] uppercase tracking-[0.16em] text-[var(--muted)] md:col-span-3 md:mt-0 lg:col-span-2">
                              {row.meta}
                            </span>
                            <span className="col-span-12 mt-3 font-[family-name:var(--font-en)] text-[11px] font-medium uppercase tracking-[0.2em] text-[var(--muted)] transition-colors group-hover:text-[var(--foreground)] md:col-span-2 md:mt-0 md:text-right">
                              View →
                            </span>
                          </a>
                        ) : (
                          <div
                            className="group grid grid-cols-12 gap-x-4 py-5 md:py-[1.125rem] md:items-baseline"
                            aria-label="内容即将上线"
                          >
                            <span className="col-span-12 font-[family-name:var(--font-zh)] text-[15px] font-medium leading-snug text-[var(--foreground)] md:col-span-7 lg:col-span-8">
                              {row.title}
                            </span>
                            <span className="col-span-12 mt-2 font-[family-name:var(--font-en)] text-[11px] uppercase tracking-[0.16em] text-[var(--muted)] md:col-span-3 md:mt-0 lg:col-span-2">
                              {row.meta}
                            </span>
                            <span className="col-span-12 mt-3 font-[family-name:var(--font-en)] text-[11px] font-medium uppercase tracking-[0.2em] text-[var(--muted)] md:col-span-2 md:mt-0 md:text-right">
                              Soon
                            </span>
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        <HomeCall />
      </main>

      <footer className="border-t border-[var(--hairline)] py-10">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-4 px-5 md:flex-row md:items-center md:justify-between md:px-10 lg:px-12">
          <div className="flex items-center gap-2">
            <span
              aria-hidden
              className="h-1.5 w-1.5 rounded-full bg-[var(--brand-teal)]"
            />
            <p className="font-[family-name:var(--font-en)] text-[11px] uppercase tracking-[0.2em] text-[var(--muted)]">
              © {new Date().getFullYear()} SurferGarage
            </p>
          </div>
          <p className="font-[family-name:var(--font-zh)] text-xs text-[var(--muted)]">
            Surfing wave, build the great.
          </p>
        </div>
      </footer>

      <HomeScrollChoreography />
    </div>
  );
}
