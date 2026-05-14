import { HomeCall } from "@/components/home-call";
import { HomeFounders } from "@/components/home-founders";
import { HomeSocial } from "@/components/home-social";
import { GlowRiver } from "@/components/glow-river";
import { HomeHero } from "@/components/home-hero";
import { HomeScrollChoreography } from "@/components/home-scroll-choreography";
import { UnderwaterLightStage } from "@/components/underwater-light-stage";
import { WaterVolumeFx } from "@/components/water-volume-fx";
import { PROOF_STREAMS } from "@/lib/proof-streams";
import Image from "next/image";

export default function Home() {
  return (
    <div className="relative isolate flex min-h-full min-w-0 flex-col overflow-x-clip">
      <div className="pointer-events-none absolute inset-0 z-0 sg-main-depth" aria-hidden />

      <GlowRiver />

      <div className="pointer-events-none absolute inset-0 z-[2]">
        <WaterVolumeFx />
        <UnderwaterLightStage />
      </div>

      <a
        href="#manifesto"
        className="fixed left-4 top-4 z-[100] -translate-y-[160%] rounded-sm border border-[var(--hairline)] bg-[var(--background)] px-4 py-2 font-[family-name:var(--font-zh)] text-sm text-[var(--foreground)] shadow-lg transition-transform duration-200 focus:translate-y-0"
      >
        跳到主要内容
      </a>

      <header className="sg-header-depth sticky top-0 z-10 border-b border-[var(--hairline)] backdrop-blur-sm">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between px-5 py-4 md:px-10 lg:px-12">
          <a
            href="#manifesto"
            className="flex items-center gap-3.5 rounded-sm font-[family-name:var(--font-en)] text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--foreground)] transition-opacity hover:opacity-85"
          >
            <Image
              src="/brand-sg-logo.png"
              alt="SurferGarage logo"
              width={40}
              height={40}
              className="h-10 w-10 shrink-0 object-contain"
              priority
            />
            <span className="text-[var(--foreground)]">Surfer</span>
            <span className="text-[var(--foreground)]">Garage</span>
          </a>
          <nav
            className="hidden gap-9 font-[family-name:var(--font-en)] text-[11px] uppercase tracking-[0.18em] md:flex"
            aria-label="Primary"
          >
            <a
              href="#manifesto"
              className="rounded-sm px-1.5 py-1 text-[var(--muted)] transition-colors hover:text-[var(--brand-teal)]"
            >
              Manifesto
            </a>
            <a
              href="#proof"
              className="rounded-sm px-1.5 py-1 text-[var(--muted)] transition-colors hover:text-[var(--brand-teal)]"
            >
              The Proof
            </a>
            <a
              href="#social"
              className="rounded-sm px-1.5 py-1 text-[var(--muted)] transition-colors hover:text-[var(--brand-teal)]"
            >
              Connect
            </a>
            <a
              href="#founders"
              className="rounded-sm px-1.5 py-1 text-[var(--muted)] transition-colors hover:text-[var(--brand-teal)]"
            >
              Founders
            </a>
            <a
              href="#call"
              className="rounded-sm px-1.5 py-1 text-[var(--muted)] transition-colors hover:text-[var(--brand-teal)]"
            >
              The Call
            </a>
          </nav>
        </div>
      </header>

      <main className="relative z-[3] flex-1">
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
              <div data-proof-intro>
                <p
                  id="proof-heading"
                  className="font-[family-name:var(--font-en)] text-[11px] font-medium uppercase tracking-[0.28em] text-[var(--foreground)]"
                >
                  The Proof
                </p>
                <p className="mt-4 font-[family-name:var(--font-zh)] text-[15px] leading-relaxed text-[var(--muted-strong)]">
                  我们不讲趋势预测，只记录真实动作。每条内容都要有决策、代价、验证结果；没有证据链，就不发布。
                </p>
              </div>
            </div>

            <div
              className="col-span-12 mt-14 md:col-span-7 md:col-start-6 md:mt-0"
              data-proof-streams
            >
              {PROOF_STREAMS.map((stream, streamIndex) => (
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
                        {row.href && row.href !== "#" ? (
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

        <HomeSocial />

        <HomeFounders />

        <HomeCall />
      </main>

      <footer className="relative z-[3] border-t border-[var(--hairline)] py-10">
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
