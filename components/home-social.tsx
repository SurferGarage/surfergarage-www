import { SocialChannelMark } from "@/components/social-channel-mark";
import { SG_PAGE_SHELL_CLASS } from "@/lib/sg-layout";
import {
  SOCIAL_CHANNELS,
  type SocialChannel,
} from "@/lib/social-channels";
import { LATEST_WECHAT_FEED_ITEM } from "@/lib/wechat-official-feed";

const CHANNEL_IDS = ["wechat-articles", "bilibili", "xiaohongshu", "github-org"];

const CHANNEL_COPY: Record<string, string> = {
  "wechat-articles": "人物深访与可以被长期引用的完整叙事。",
  bilibili: "长视频对谈，保留语气与判断发生的过程。",
  xiaohongshu: "把创业现场切成更短、更及时的观察片段。",
  "github-org": "公开手册、失败复盘、学习路径与网站源码。",
};

function getChannels(): SocialChannel[] {
  return CHANNEL_IDS.map((id) => SOCIAL_CHANNELS.find((channel) => channel.id === id))
    .filter((channel): channel is SocialChannel => Boolean(channel))
    .map((channel) =>
      channel.id === "wechat-articles"
        ? { ...channel, href: LATEST_WECHAT_FEED_ITEM.href }
        : channel,
    );
}

export function HomeSocial() {
  const channels = getChannels();

  return (
    <section
      id="social"
      className="scroll-mt-[4.5rem] border-b border-[#0b0c10]/15 bg-[var(--brand-light-grey)] py-20 text-[#0b0c10] md:py-28 lg:py-32"
      aria-labelledby="social-heading"
    >
      <div className={SG_PAGE_SHELL_CLASS}>
        <header>
          <div className="flex items-center justify-between gap-6 border-b border-[#0b0c10]/15 pb-5 font-[family-name:var(--font-mono)] text-[10px] uppercase text-[#565c6b] md:text-[11px]">
            <span className="text-[var(--brand-primary)]">Distribution / 06</span>
            <span>Follow the record</span>
          </div>
          <h2
            id="social-heading"
            className="mt-14 max-w-[72rem] font-[family-name:var(--font-serif-zh)] text-[2.4rem] font-semibold leading-[1.22] text-[#0b0c10] md:mt-20 md:text-[4.25rem] lg:text-[4.5rem] xl:text-[5rem]"
          >
            <span className="block md:inline">长文在微信，</span>
            <span className="block md:inline">现场在 B 站，</span>
            <br className="hidden md:block" />
            <span className="block whitespace-nowrap">开源资料在 GitHub。</span>
          </h2>
          <p className="mt-8 max-w-[40rem] font-[family-name:var(--font-zh)] text-[16px] leading-[1.8] text-[#424754] md:text-[17px]">
            选择你习惯的媒介，持续跟进浪前正在记录的人、产品与方法。
          </p>
        </header>

        <ul className="mt-16 grid border-y border-[#0b0c10]/18 md:mt-24 md:grid-cols-2">
          {channels.map((channel, index) => (
            <li
              key={channel.id}
              className={`${index > 0 ? "border-t border-[#0b0c10]/14" : ""} ${
                index === 1 ? "md:border-l md:border-t-0" : ""
              } ${index === 3 ? "md:border-l" : ""}`}
            >
              <a
                href={channel.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex min-h-64 flex-col justify-between py-8 transition-colors hover:bg-white/35 md:min-h-72 md:px-9 md:py-9 lg:min-h-80 lg:px-11 lg:py-10"
              >
                <div className="flex items-start justify-between gap-5">
                  <span className="font-[family-name:var(--font-mono)] text-[10px] text-[#6a7080] md:text-[11px]">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <SocialChannelMark id={channel.mark} />
                </div>

                <div>
                  <p className="font-[family-name:var(--font-mono)] text-[10px] uppercase text-[#626877] md:text-[11px]">
                    {channel.labelEn}
                  </p>
                  <div className="mt-3 flex items-end justify-between gap-6">
                    <h3 className="font-[family-name:var(--font-zh)] text-[1.6rem] font-medium leading-[1.3] text-[#0b0c10] md:text-[1.9rem]">
                      {channel.labelZh}
                    </h3>
                    <span
                      aria-hidden
                      className="shrink-0 font-[family-name:var(--font-en)] text-[1.35rem] text-[var(--brand-primary)] transition-transform group-hover:translate-x-1"
                    >
                      ↗
                    </span>
                  </div>
                  <p className="mt-5 max-w-[30rem] font-[family-name:var(--font-zh)] text-[14px] leading-[1.75] text-[#4c5260] md:text-[15px]">
                    {CHANNEL_COPY[channel.id] || channel.descriptionZh}
                  </p>
                </div>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
