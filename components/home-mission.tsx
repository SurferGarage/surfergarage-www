import { SG_PAGE_SHELL_CLASS } from "@/lib/sg-layout";

export function HomeMission() {
  return (
    <section
      id="mission"
      className="border-b border-[var(--hairline)] bg-[var(--paper-1)]"
      aria-labelledby="mission-heading"
    >
      <div
        className={`${SG_PAGE_SHELL_CLASS} flex min-h-[calc(100svh-4.5rem)] flex-col py-16 md:py-20 lg:py-24`}
      >
        <div className="grid flex-1 items-center gap-14 py-16 md:py-20 lg:grid-cols-12 lg:gap-12 lg:py-24">
          <h2
            id="mission-heading"
            className="font-[family-name:var(--font-serif-zh)] text-[2.65rem] font-semibold leading-[1.16] text-[var(--foreground)] sm:text-[3.25rem] md:text-[4.5rem] lg:col-span-8 lg:text-[5.25rem]"
          >
            <span className="block text-[color-mix(in_oklch,var(--muted)_82%,var(--paper-1))]">
              <span className="block">不等故事</span>
              <span className="block">尘埃落定。</span>
            </span>
            <span className="mt-5 block">在创业进行时，</span>
            <span className="block text-[var(--brand-teal)]">
              开始记录。
            </span>
          </h2>

          <div className="max-w-[32rem] lg:col-span-4 lg:pl-6">
            <p className="font-[family-name:var(--font-serif-zh)] text-[1.45rem] font-semibold leading-[1.55] text-[var(--foreground)] md:text-[1.75rem]">
              浪前从人物深访开始，持续记录极早期科技创业者。
            </p>
            <p className="mt-6 font-[family-name:var(--font-zh)] text-[16px] leading-[1.8] text-[var(--muted-strong)] md:text-[17px]">
              当产品还粗粝、方向仍在变化、外界尚未形成共识，真实记录才最有价值。
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
