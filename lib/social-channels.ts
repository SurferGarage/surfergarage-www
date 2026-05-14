/**
 * 出站渠道清单。`href` 非 http(s) 时在 UI 中渲染为信息卡（见 `home-social`）。
 * 触点区按 **文章 / 视频与播客 / 开源** 分块展示；Discord 不在此区（入口见「联络」）。
 */
export type SocialChannelKind =
  | "article"
  | "video"
  | "code"
  | "audio"
  | "community";

/** Connect 卡片右上角线标：统一框体 + 各平台可辨几何图形（非官方商标素材）。 */
export type SocialChannelMarkId =
  | "wechat"
  | "xiaohongshu"
  | "bilibili"
  | "twitter"
  | "youtube"
  | "xiaoyuzhou"
  | "github";

export type SocialChannel = {
  id: string;
  kind: SocialChannelKind;
  /** 与 `SocialChannelMark` 一一对应 */
  mark: SocialChannelMarkId;
  labelEn: string;
  labelZh: string;
  href: string;
  descriptionZh: string;
};

const wechatArticle: SocialChannel = {
  id: "wechat-articles",
  kind: "article",
  mark: "wechat",
  labelEn: "WeChat",
  labelZh: "公众号专栏",
  href: "#",
  descriptionZh: "中文长文连载；选篇请在「片场」横滑微信展台打开。",
};

const videoChannels: SocialChannel[] = [
  {
    id: "xiaohongshu",
    kind: "video",
    mark: "xiaohongshu",
    labelEn: "Xiaohongshu",
    labelZh: "小红书 · 视频",
    href: "https://www.xiaohongshu.com/user/profile/66c1db2d000000001d030d6e?xsec_token=ABSe1GVdniK6h9xUrt52iMEnugcyIWsAnbWnCKOfgbgxA%3D&xsec_source=pc_search",
    descriptionZh: "主页分发短视频与图文笔记。",
  },
  {
    id: "bilibili",
    kind: "video",
    mark: "bilibili",
    labelEn: "Bilibili",
    labelZh: "哔哩哔哩 · 视频",
    href: "#",
    descriptionZh: "频道与回放链接待上架。",
  },
  {
    id: "twitter",
    kind: "video",
    mark: "twitter",
    labelEn: "X (Twitter)",
    labelZh: "X（Twitter）· 视频",
    href: "#",
    descriptionZh: "主页链接待上架。",
  },
  {
    id: "youtube",
    kind: "video",
    mark: "youtube",
    labelEn: "YouTube",
    labelZh: "YouTube · 视频",
    href: "#",
    descriptionZh: "频道链接待上架。",
  },
  {
    id: "xiaoyuzhou",
    kind: "audio",
    mark: "xiaoyuzhou",
    labelEn: "Xiaoyuzhou",
    labelZh: "小宇宙 · 播客",
    href: "https://www.xiaoyuzhoufm.com/podcast/66dc991838220204ac72fe31",
    descriptionZh: "音频加长栏目与单集页。",
  },
];

const githubOrg: SocialChannel = {
  id: "github-org",
  kind: "code",
  mark: "github",
  labelEn: "GitHub",
  labelZh: "组织仓库 · 开源",
  href: "https://github.com/SurferGarage",
  descriptionZh: "组织仓库、创业手册与本站源码。",
};

/** Connect 首页：按产品逻辑分三块（与 `home-social` 一致）。 */
export const SOCIAL_CONNECT_SECTIONS: readonly {
  id: string;
  eyebrowEn: string;
  titleZh: string;
  titleEn: string;
  leadZh: string;
  channels: readonly SocialChannel[];
}[] = [
  {
    id: "articles",
    eyebrowEn: "Articles",
    titleZh: "文章",
    titleEn: "Long-form & editorial",
    leadZh: "中文深度叙事与发刊；与视频、开源并列，不做混排。",
    channels: [wechatArticle],
  },
  {
    id: "video",
    eyebrowEn: "Video & audio",
    titleZh: "视频与播客",
    titleEn: "Motion & spoken series",
    leadZh: "短中长视频与播客分发；按平台外链直达。",
    channels: videoChannels,
  },
  {
    id: "open-source",
    eyebrowEn: "Open source",
    titleZh: "GitHub 仓库",
    titleEn: "Repositories & handbook",
    leadZh: "工程与手册的单一真源；与内容矩阵并列展示。",
    channels: [githubOrg],
  },
];

/** 扁平清单（测试 / 脚本用）；不含已从 Connect 撤下的 Discord。 */
export const SOCIAL_CHANNELS: SocialChannel[] = SOCIAL_CONNECT_SECTIONS.flatMap(
  (s) => [...s.channels],
);
