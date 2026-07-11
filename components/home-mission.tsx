import { SG_PAGE_SHELL_CLASS } from "@/lib/sg-layout";

const MISSION_PILLARS = [
  {
    no: "01",
    title: "被看见",
    description: "进入投资人、行业、用户与学校的真实视野。",
  },
  {
    no: "02",
    title: "被理解",
    description: "不把一个正在变化的人，压缩成成功学标签。",
  },
  {
    no: "03",
    title: "被连接",
    description: "让下一段关系，从一份可信的内容记录开始。",
  },
] as const;

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
        <header className="flex items-center justify-between gap-6 border-b border-[var(--hairline)] pb-5 font-[family-name:var(--font-mono)] text-[10px] uppercase text-[var(--muted)] md:text-[11px]">
          <span className="text-[var(--accent-amber)]">Position / 01</span>
          <span>Before consensus</span>
        </header>

        <div className="grid flex-1 items-center gap-14 py-16 md:py-20 lg:grid-cols-12 lg:gap-12 lg:py-24">
          <h2
            id="mission-heading"
            className="font-[family-name:var(--font-serif-zh)] text-[2.65rem] font-semibold leading-[1.16] text-[var(--foreground)] sm:text-[3.25rem] md:text-[4.5rem] lg:col-span-8 lg:text-[5.25rem]"
          >
            <span className="block text-[var(--muted-soft)]">
              <span className="block">我们不记录</span>
              <span className="block">已经上岸的人。</span>
            </span>
            <span className="mt-5 block">我们记录</span>
            <span className="block text-[var(--brand-teal)]">
              正在冲浪的人。
            </span>
          </h2>

          <div className="max-w-[32rem] lg:col-span-4 lg:pl-6">
            <p className="font-[family-name:var(--font-serif-zh)] text-[1.45rem] font-semibold leading-[1.55] text-[var(--foreground)] md:text-[1.75rem]">
              浪前，是极早期科技创业者的第一篇深度访谈。
            </p>
            <p className="mt-6 font-[family-name:var(--font-zh)] text-[16px] leading-[1.8] text-[var(--muted-strong)] md:text-[17px]">
              在他们仍然粗糙、快速变化、尚未形成共识时，留下可以被长期引用的真实记录。
            </p>
          </div>
        </div>

        <ol className="grid border-t border-[var(--hairline)] md:grid-cols-3">
          {MISSION_PILLARS.map((pillar, index) => (
            <li
              key={pillar.no}
              className={`py-6 md:min-h-40 md:px-7 md:py-7 ${
                index > 0
                  ? "border-t border-[var(--hairline-soft)] md:border-l md:border-t-0"
                  : ""
              }`}
            >
              <p className="font-[family-name:var(--font-mono)] text-[10px] text-[var(--brand-teal)] md:text-[11px]">
                {pillar.no}
              </p>
              <h3 className="mt-4 font-[family-name:var(--font-zh)] text-[1.35rem] font-medium text-[var(--foreground)] md:text-[1.55rem]">
                {pillar.title}
              </h3>
              <p className="mt-3 max-w-[22rem] font-[family-name:var(--font-zh)] text-[14px] leading-[1.7] text-[var(--muted)] md:text-[15px]">
                {pillar.description}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
