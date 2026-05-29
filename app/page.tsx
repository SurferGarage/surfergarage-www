import { HomeCall, HomeFit } from "@/components/home-call";
import { HomeFounders } from "@/components/home-founders";
import { HomeProof } from "@/components/home-proof";
import { HomeSocial } from "@/components/home-social";
import { GlowRiver } from "@/components/glow-river";
import { HomeHero } from "@/components/home-hero";
import { HomeScrollChoreography } from "@/components/home-scroll-choreography";
import { SgAmbientGrid } from "@/components/sg-ambient-grid";
import { UnderwaterLightStage } from "@/components/underwater-light-stage";
import { WaterVolumeFx } from "@/components/water-volume-fx";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { SOCIAL_FOUNDERS_TRENCH_MIN_H } from "@/lib/founders-scroll-rhythm";

export default function Home() {
  return (
    <div className="relative isolate flex min-h-full min-w-0 flex-col overflow-x-clip">
      {/* 主列底色：paper 常驻 + 水下叠层（--ambient-mode 与滚动 depth-t 同步淡出） */}
      <div
        className="pointer-events-none absolute inset-0 z-0 sg-main-depth-paper"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 z-0 sg-main-depth-submerge"
        aria-hidden
      />

      {/* Blueprint Magazine: 全站固定点阵 + grain（仅出水线后显形） */}
      <SgAmbientGrid />

      {/* GlowRiver 仍铺满，但 .sg-river-depth 已绑 --ambient-mode，出水线后衰减 */}
      <GlowRiver />

      {/* 水下氛围层：依然全屏，靠 --ambient-mode 在 hero 之后自动 fade */}
      <div className="pointer-events-none absolute inset-0 z-[2]">
        <WaterVolumeFx />
        <UnderwaterLightStage />
      </div>

      <a
        href="#manifesto"
        className="fixed left-4 z-[100] -translate-y-[160%] rounded-sm border border-[var(--hairline)] bg-[var(--background)] px-4 py-2 font-[family-name:var(--font-zh)] text-sm text-[var(--foreground)] shadow-lg transition-transform duration-200 focus:translate-y-0"
        style={{ top: "max(1rem, env(safe-area-inset-top))" }}
      >
        跳到主要内容
      </a>

      <SiteHeader />

      <main className="relative z-[3] flex-1">
        <HomeHero />

        {/* 出水线承载段：从水下色温显式切到 editorial paper */}
        <HomeProof />

        <HomeFounders />

        <div
          aria-hidden
          data-social-founders-trench
          className={`relative w-screen max-w-[100vw] shrink-0 overflow-hidden ml-[calc(50%-50vw)] ${SOCIAL_FOUNDERS_TRENCH_MIN_H}`}
        >
          <div
            data-breath-glow
            className="sg-founder-breath-glow pointer-events-none absolute inset-[10%_6%] opacity-[0.12] md:inset-[12%_8%]"
          />
        </div>

        <HomeSocial />

        <HomeCall />

        <HomeFit />
      </main>

      <SiteFooter />

      <HomeScrollChoreography />
    </div>
  );
}
