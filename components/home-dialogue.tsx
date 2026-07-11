import { HomeVideoPlayer } from "@/components/home-video-player";
import { SG_PAGE_SHELL_CLASS } from "@/lib/sg-layout";
import { SURFING_FOUNDERS_SEASON_01 } from "@/lib/surfing-founders-video-season";

export function HomeDialogue() {
  const liveGuests = SURFING_FOUNDERS_SEASON_01.guests.filter(
    (guest) => !guest.comingSoon && guest.episodes.length > 0,
  );
  const featuredGuest = liveGuests[liveGuests.length - 1] ?? liveGuests[0];

  return (
    <section
      id="dialogue"
      className="border-b border-[var(--hairline)] bg-[#07080b] py-20 md:py-28 lg:py-32"
      aria-labelledby="dialogue-section-heading"
    >
      <div className={SG_PAGE_SHELL_CLASS}>
        <header className="grid gap-8 lg:grid-cols-12 lg:items-end lg:gap-12">
          <div className="lg:col-span-8">
            <h2
              id="dialogue-section-heading"
              className="max-w-[54rem] font-[family-name:var(--font-serif-zh)] text-[2.5rem] font-semibold leading-[1.2] text-[var(--foreground)] md:text-[3.75rem] lg:text-[4rem] xl:text-[4.5rem]"
            >
              一场对话，进入
              <br />
              创业进行时。
            </h2>
          </div>
          <p className="max-w-[34rem] font-[family-name:var(--font-zh)] text-[16px] leading-[1.8] text-[var(--muted-strong)] md:text-[17px] lg:col-span-4">
            我们把摄像机放进真实现场，保留语气、犹豫和尚未被验证的判断。
          </p>
        </header>

        <div className="mt-14 grid gap-12 border-t border-[var(--hairline)] pt-10 md:mt-20 md:pt-14 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-8">
            {featuredGuest ? (
              <HomeVideoPlayer
                guestName={featuredGuest.nameZh}
                episodes={featuredGuest.episodes}
              />
            ) : null}
          </div>

          <aside className="flex flex-col justify-between border-t border-[var(--hairline)] pt-8 lg:col-span-4 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0">
            <div>
              <p className="font-[family-name:var(--font-mono)] text-[10px] uppercase text-[var(--accent-amber)] md:text-[11px]">
                视频播客 · 浪前对话
              </p>
              <h3 className="mt-5 font-[family-name:var(--font-zh)] text-[1.65rem] font-medium leading-[1.45] text-[var(--foreground)] md:text-[2rem]">
                不急着复盘结果，先看判断如何形成。
              </h3>
              <p className="mt-6 font-[family-name:var(--font-zh)] text-[15px] leading-[1.8] text-[var(--muted-strong)] md:text-[16px]">
                与年轻创始人和产品创造者展开长对谈。这里没有标准答案，现场本身就是内容。
              </p>
            </div>

            <dl className="mt-12 border-t border-[var(--hairline)] font-[family-name:var(--font-mono)] text-[10px] uppercase md:text-[11px] lg:mt-16">
              {[
                ["当前季度", "第一季"],
                ["内容形式", "长视频对谈"],
                ["观看平台", "哔哩哔哩"],
              ].map(([term, value]) => (
                <div
                  key={term}
                  className="flex items-center justify-between gap-6 border-b border-[var(--hairline-soft)] py-4"
                >
                  <dt className="text-[var(--muted)]">{term}</dt>
                  <dd className="text-right text-[var(--foreground)]">{value}</dd>
                </div>
              ))}
            </dl>
          </aside>
        </div>
      </div>
    </section>
  );
}
