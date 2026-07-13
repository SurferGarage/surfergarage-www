import {
  SG_IMMERSIVE_INSET_CLASS,
  SG_IMMERSIVE_PLANE_CLASS,
  SG_IMMERSIVE_SECTION_CLASS,
} from "@/lib/sg-layout";
import { WECHAT_OFFICIAL_FEED } from "@/lib/wechat-official-feed";

export function HomeFounders() {
  const latestArticle = WECHAT_OFFICIAL_FEED.at(-1);
  const methodArticle = WECHAT_OFFICIAL_FEED.find(
    (article) => article.id === "wx-09",
  );
  const columns = [
    {
      no: "01",
      title: "Surfing Founder",
      titleZh: "记录人",
      type: "人物特稿",
      status: "持续更新",
      description: "从第一篇深度访谈开始，记录创业者最初的产品、判断与转折。",
      href: latestArticle?.href,
      accent: "text-[var(--brand-teal)]",
    },
    {
      no: "02",
      title: "浪前对话",
      titleZh: "记录对话",
      type: "视频播客",
      status: "第一季",
      description: "保留判断形成、分歧出现与对话停顿的完整过程。",
      href: "https://space.bilibili.com/3546759022250564",
      accent: "text-[#6f78ff]",
    },
    {
      no: "03",
      title: "风暴之中",
      titleZh: "记录事件",
      type: "事件特稿",
      status: "筹备中",
      description: "进入发布、融资、失败与关键转折的现场。",
      accent: "text-[var(--accent-amber)]",
    },
    {
      no: "04",
      title: "冲浪板",
      titleZh: "记录产品",
      type: "产品观察",
      status: "筹备中",
      description: "从真实使用出发，理解产品与早期市场信号。",
      accent: "text-[var(--brand-teal)]",
    },
    {
      no: "05",
      title: "造浪之人",
      titleZh: "记录方法",
      type: "方法论对谈",
      status: "已上线",
      description: "与正在塑造技术、产品与生态的人讨论方法。",
      href: methodArticle?.href,
      accent: "text-[var(--accent-amber)]",
    },
  ] as const;

  return (
    <section
      id="founders"
      className={`${SG_IMMERSIVE_SECTION_CLASS} scroll-mt-[4.5rem] border-b border-[var(--hairline)]`}
      aria-labelledby="founders-heading"
    >
      <div
        className={`${SG_IMMERSIVE_PLANE_CLASS} sg-immersive-plane--dark overflow-hidden bg-[var(--paper-1)]`}
      >
      <header>
        <div
          className={`${SG_IMMERSIVE_INSET_CLASS} sg-home-founders-intro grid min-h-[58svh] items-center py-20 md:py-28 lg:py-32`}
        >
          <div className="grid gap-9 lg:grid-cols-12 lg:items-end lg:gap-12">
            <h2
              id="founders-heading"
              className="font-[family-name:var(--font-serif-zh)] text-[2.55rem] font-semibold leading-[1.2] text-[var(--foreground)] md:text-[4rem] lg:col-span-8 lg:text-[4.5rem]"
            >
              <span className="block">五种记录方式。</span>
              <span className="block">追踪同一件事：</span>
              <span className="block">变化如何发生。</span>
            </h2>
            <p className="max-w-[34rem] font-[family-name:var(--font-zh)] text-[16px] leading-[1.8] text-[var(--muted-strong)] md:text-[17px] lg:col-span-4">
              从一个人开始，延伸到对话、事件、产品与方法。栏目不是分类标签，而是五种进入真实现场的角度。
            </p>
          </div>
        </div>
      </header>

      <ol className="border-t border-[var(--hairline)]">
        {columns.map((column, index) => {
          const content = (
            <div
              className={`${SG_IMMERSIVE_INSET_CLASS} grid min-h-60 items-center gap-7 py-10 md:min-h-64 md:grid-cols-[6rem_1.25fr_1.2fr_7rem] md:gap-9 md:py-12 lg:min-h-72 lg:grid-cols-[8rem_1.25fr_1.4fr_8rem] lg:gap-12`}
            >
              <span
                className={`font-[family-name:var(--font-serif)] text-[4rem] leading-none md:text-[5rem] ${column.accent}`}
              >
                {column.no}
              </span>

              <div>
                <p className="font-[family-name:var(--font-mono)] text-[10px] uppercase text-[var(--muted)] md:text-[11px]">
                  {column.type} · {column.titleZh}
                </p>
                <h3 className="mt-3 font-[family-name:var(--font-serif-zh)] text-[2rem] font-semibold leading-[1.2] text-[var(--foreground)] transition-colors group-hover:text-white md:text-[2.5rem]">
                  {column.title}
                </h3>
              </div>

              <p className="max-w-[34rem] font-[family-name:var(--font-zh)] text-[15px] leading-[1.8] text-[var(--muted-strong)] md:text-[17px]">
                {column.description}
              </p>

              <div className="flex items-center justify-between gap-4 font-[family-name:var(--font-mono)] text-[10px] uppercase text-[var(--muted)] md:block md:text-right md:text-[11px]">
                <span>{column.status}</span>
                {"href" in column && column.href ? (
                  <span className={`md:mt-5 md:block ${column.accent}`} aria-hidden>
                    ↗
                  </span>
                ) : null}
              </div>
            </div>
          );

          return (
            <li
              key={column.no}
              className={`border-b border-[var(--hairline)] transition-colors hover:bg-white/[0.025] ${
                index % 2 === 1 ? "bg-[#0c0e13]" : "bg-[var(--paper-0)]"
              }`}
            >
              {"href" in column && column.href ? (
                <a
                  href={column.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block"
                >
                  {content}
                </a>
              ) : (
                content
              )}
            </li>
          );
        })}
      </ol>
      </div>
    </section>
  );
}
