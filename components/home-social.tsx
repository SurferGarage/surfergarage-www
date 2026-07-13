import { SocialChannelMark } from "@/components/social-channel-mark";
import {
  SG_IMMERSIVE_INSET_CLASS,
  SG_IMMERSIVE_PLANE_CLASS,
  SG_IMMERSIVE_SECTION_CLASS,
} from "@/lib/sg-layout";
import {
  SOCIAL_CHANNELS,
  type SocialChannel,
} from "@/lib/social-channels";

const CHANNEL_IDS = ["wechat-articles", "bilibili", "xiaohongshu", "github-org"];

const CHANNEL_COPY: Record<string, string> = {
  "wechat-articles": "阅读完整人物深访与可长期引用的创业叙事。",
  bilibili: "观看长视频对谈，保留语气、分歧与判断形成的过程。",
  xiaohongshu: "获取更短、更及时的创业现场片段。",
  "github-org": "查看公开手册、失败复盘、学习路径与网站源码。",
};

const CHANNEL_FORMAT: Record<string, string> = {
  "wechat-articles": "人物长文",
  bilibili: "长视频",
  xiaohongshu: "现场短片",
  "github-org": "开放资料",
};

function getChannels(): SocialChannel[] {
  return CHANNEL_IDS.map((id) => SOCIAL_CHANNELS.find((channel) => channel.id === id))
    .filter((channel): channel is SocialChannel => Boolean(channel));
}

export function HomeSocial() {
  const channels = getChannels();

  return (
    <section
      id="social"
      className={`${SG_IMMERSIVE_SECTION_CLASS} scroll-mt-[4.5rem] border-b border-white/10 text-[#0b0c10]`}
      aria-labelledby="social-heading"
    >
      <div
        className={`${SG_IMMERSIVE_PLANE_CLASS} ${SG_IMMERSIVE_INSET_CLASS} sg-home-social-plane sg-immersive-plane--light overflow-hidden bg-[var(--brand-light-grey)] py-20 md:py-28 lg:py-32`}
      >
        <header>
          <h2
            id="social-heading"
            className="max-w-[72rem] font-[family-name:var(--font-serif-zh)] text-[2.4rem] font-semibold leading-[1.22] text-[#0b0c10] md:text-[3.5rem] lg:text-[4.5rem] xl:text-[5rem]"
          >
            <span className="block lg:inline">长文在微信，</span>
            <span className="block lg:inline">现场在 B 站，</span>
            <br className="hidden lg:block" />
            <span className="block lg:whitespace-nowrap">开源资料在 GitHub。</span>
          </h2>
          <p className="mt-8 max-w-[40rem] font-[family-name:var(--font-zh)] text-[16px] leading-[1.8] text-[#424754] md:text-[17px]">
            选择你习惯的入口，持续跟进人物、产品与方法的最新进展。
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
                    {CHANNEL_FORMAT[channel.id]}
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
                    {CHANNEL_COPY[channel.id]}
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
