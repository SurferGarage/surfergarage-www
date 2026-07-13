import { BILIBILI_SPACE_URL } from "@/lib/surfing-founders-video-season";
import { LATEST_WECHAT_FEED_ITEM } from "@/lib/wechat-official-feed";

export type SocialChannelMarkId =
  | "wechat"
  | "xiaohongshu"
  | "bilibili"
  | "github";

export type SocialChannel = {
  id: string;
  mark: SocialChannelMarkId;
  labelEn: string;
  labelZh: string;
  href: string;
};

export const SOCIAL_CHANNELS: readonly SocialChannel[] = [
  {
    id: "wechat-articles",
    mark: "wechat",
    labelEn: "WeChat",
    labelZh: "微信公众号",
    href: LATEST_WECHAT_FEED_ITEM.href,
  },
  {
    id: "bilibili",
    mark: "bilibili",
    labelEn: "Bilibili",
    labelZh: "哔哩哔哩",
    href: BILIBILI_SPACE_URL,
  },
  {
    id: "xiaohongshu",
    mark: "xiaohongshu",
    labelEn: "Xiaohongshu",
    labelZh: "小红书",
    href: "https://www.xiaohongshu.com/user/profile/66c1db2d000000001d030d6e",
  },
  {
    id: "github-org",
    mark: "github",
    labelEn: "GitHub",
    labelZh: "开源资料",
    href: "https://github.com/SurferGarage",
  },
] as const;
