import { HomeCall } from "@/components/home-call";
import { HomeFounders } from "@/components/home-founders";
import { HomeSocial } from "@/components/home-social";
import { GlowRiver } from "@/components/glow-river";
import { HomeHero } from "@/components/home-hero";
import { HomeScrollChoreography } from "@/components/home-scroll-choreography";
import { UnderwaterLightStage } from "@/components/underwater-light-stage";
import { WaterVolumeFx } from "@/components/water-volume-fx";
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
            <span className="flex items-baseline gap-1.5">
              <span className="text-[var(--foreground)]">Surfer</span>
              <span className="text-[var(--foreground)]">Garage</span>
            </span>
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
              © {new Date().getFullYear()} 浪前 Surfer Garage
            </p>
          </div>
          <p className="font-[family-name:var(--font-zh)] text-xs text-[var(--muted)] md:text-sm">
            站点与内容持续迭代；以仓库与专栏为准。
          </p>
        </div>
      </footer>

      <HomeScrollChoreography />
    </div>
  );
}
