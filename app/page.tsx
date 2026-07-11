import { HomeCall, HomeFit } from "@/components/home-call";
import { HomeDialogue } from "@/components/home-dialogue";
import { HomeEvents } from "@/components/home-events";
import { HomeFounders } from "@/components/home-founders";
import { HomeMission } from "@/components/home-mission";
import { HomeProof } from "@/components/home-proof";
import { HomeSocial } from "@/components/home-social";
import { HomeHero } from "@/components/home-hero";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export default function Home() {
  return (
    <div className="relative flex min-h-full min-w-0 flex-col overflow-x-clip bg-[var(--paper-0)]">
      <a
        href="#manifesto"
        className="fixed left-4 z-[100] -translate-y-[160%] rounded-sm border border-[var(--hairline)] bg-[var(--background)] px-4 py-2 font-[family-name:var(--font-zh)] text-sm text-[var(--foreground)] shadow-lg transition-transform duration-200 focus:translate-y-0"
        style={{ top: "max(1rem, env(safe-area-inset-top))" }}
      >
        跳到主要内容
      </a>

      <SiteHeader />

      <main className="flex-1">
        <HomeHero />
        <HomeMission />
        <HomeProof />
        <HomeDialogue />
        <HomeFounders />
        <HomeEvents />
        <HomeSocial />
        <HomeCall />
        <HomeFit />
      </main>

      <SiteFooter />
    </div>
  );
}
