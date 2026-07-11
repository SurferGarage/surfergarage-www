import Image from "next/image";

import { SG_PAGE_SHELL_CLASS } from "@/lib/sg-layout";
import { WECHAT_OFFICIAL_FEED } from "@/lib/wechat-official-feed";

export function HomeProof() {
  const latestArticle = WECHAT_OFFICIAL_FEED.at(-1);
  const liZhenghanArticle = WECHAT_OFFICIAL_FEED.find(
    (article) => article.id === "wx-04",
  );

  return (
    <section
      id="proof"
      className="scroll-mt-[4.5rem] border-b border-white/20 bg-[var(--brand-primary)] text-white"
      aria-labelledby="proof-heading"
    >
      <div className={`${SG_PAGE_SHELL_CLASS} py-20 md:py-28 lg:py-32`}>
        <header className="flex min-h-[48svh] flex-col justify-between">
          <div className="flex items-center justify-between gap-6 border-b border-white/25 pb-5 font-[family-name:var(--font-mono)] text-[10px] uppercase text-white/65 md:text-[11px]">
            <span className="text-white">Latest records / 02</span>
            <span>Field notes · July 2026</span>
          </div>

          <div className="grid gap-8 pt-20 lg:grid-cols-12 lg:items-end lg:gap-12">
            <h2
              id="proof-heading"
              className="font-[family-name:var(--font-serif-zh)] text-[2.8rem] font-semibold leading-[1.16] text-white md:text-[4.5rem] lg:col-span-8 lg:text-[5.25rem]"
            >
              刚刚发生的，
              <br />
              先被留下。
            </h2>
            <p className="max-w-[34rem] font-[family-name:var(--font-zh)] text-[16px] leading-[1.8] text-white/78 md:text-[17px] lg:col-span-4">
              人还在变化，产品还没有定型，判断也尚未成为共识。这正是记录最有价值的时刻。
            </p>
          </div>
        </header>

        <div className="mt-16 grid items-end gap-14 border-t border-white/25 pt-10 md:mt-20 md:pt-14 lg:grid-cols-12 lg:gap-0">
          {latestArticle ? (
            <a
              href={latestArticle.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group lg:col-span-7 lg:pr-12"
            >
              <div className="relative aspect-video overflow-hidden bg-white/10">
                <Image
                  src={latestArticle.imageSrc}
                  alt="泛函在字节跳动活动现场分享"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 58vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.018]"
                />
              </div>
              <div className="mt-5 flex items-center justify-between gap-6 font-[family-name:var(--font-mono)] text-[10px] uppercase text-white/65 md:text-[11px]">
                <span>Surfing Founder · New</span>
                <span className="text-white">Read ↗</span>
              </div>
              <h3 className="mt-4 max-w-[48rem] font-[family-name:var(--font-serif-zh)] text-[1.8rem] font-semibold leading-[1.45] text-white transition-opacity group-hover:opacity-80 md:text-[2.45rem]">
                看过上千份简历后，他发现大厂与初创抢的是一种人
              </h3>
              <p className="mt-4 font-[family-name:var(--font-mono)] text-[10px] uppercase text-white/60 md:text-[11px]">
                泛函 · AI recruiting · 2026.07.10
              </p>
            </a>
          ) : null}

          {liZhenghanArticle ? (
            <a
              href={liZhenghanArticle.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group border-t border-white/25 pt-10 lg:col-span-5 lg:border-l lg:border-t-0 lg:pl-12 lg:pt-0"
            >
              <div className="relative aspect-[21/9] overflow-hidden bg-white">
                <Image
                  src={liZhenghanArticle.imageSrc}
                  alt="李政翰旧棋新弈文章的蓝白象棋系统视觉"
                  fill
                  sizes="(max-width: 1024px) 100vw, 42vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.018]"
                />
              </div>
              <div className="mt-5 flex items-center justify-between gap-6 font-[family-name:var(--font-mono)] text-[10px] uppercase text-white/65 md:text-[11px]">
                <span>Archive · Visual rebuild</span>
                <span className="text-white">Read ↗</span>
              </div>
              <h3 className="mt-4 font-[family-name:var(--font-serif-zh)] text-[1.55rem] font-semibold leading-[1.5] text-white transition-opacity group-hover:opacity-80 md:text-[2rem]">
                认为酷的事，必须自己做
              </h3>
              <p className="mt-4 font-[family-name:var(--font-mono)] text-[10px] uppercase text-white/60 md:text-[11px]">
                李政翰 · 旧棋新弈 · New visual
              </p>
            </a>
          ) : null}
        </div>
      </div>
    </section>
  );
}
