import { SocialChannelMark } from "@/components/social-channel-mark";
import { SG_PAGE_SHELL_CLASS } from "@/lib/sg-layout";
import { SOCIAL_CHANNELS, type SocialChannel } from "@/lib/social-channels";

const CHANNEL_IDS = ["wechat-articles", "bilibili", "xiaohongshu", "github-org"];
const CHANNEL_COPY: Record<string, string> = {
  "wechat-articles": "完整人物深访与创业叙事。",
  bilibili: "长视频，进入对话现场。",
  xiaohongshu: "创业现场与最新内容片段。",
  "github-org": "手册、复盘与开放学习资料。",
};

export function HomeSocial() {
  const channels = CHANNEL_IDS.map((id) => SOCIAL_CHANNELS.find((channel) => channel.id === id)).filter((channel): channel is SocialChannel => Boolean(channel));
  return (
    <section id="social" className="sg-ed-section sg-ed-social" aria-labelledby="social-heading">
      <div className={SG_PAGE_SHELL_CLASS}>
        <header className="sg-ed-section-heading">
          <div><p className="sg-ed-kicker">保持连接 / FOLLOW ALONG</p><h2 id="social-heading" className="sg-ed-heading">在你习惯的地方，找到浪前。</h2></div>
        </header>
        <ul className="sg-ed-social-grid">
          {channels.map((channel) => (
            <li key={channel.id}>
              <a href={channel.href} target="_blank" rel="noopener noreferrer" className="sg-ed-social-link">
                <div className="sg-ed-social-top"><SocialChannelMark id={channel.mark} /><span aria-hidden>↗</span></div>
                <h3>{channel.labelZh}</h3>
                <p>{CHANNEL_COPY[channel.id]}</p>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
