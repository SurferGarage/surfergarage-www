/** 微信公众号模块：横向新闻卡；封面置于 `public/wechat-feed/01.png` … `08.png`（与下列顺序一致）。 */

export type WechatOfficialFeedItem = {
  id: string;
  titleZh: string;
  /** 点击后打开（新标签页）；上线后替换为对应 `mp.weixin.qq.com/s/...` 文章链接 */
  href: string;
  /** 封面图，来自 `public/` */
  imageSrc: string;
};

export const WECHAT_OFFICIAL_FEED: WechatOfficialFeedItem[] = [
  {
    id: "wx-01",
    titleZh: "Surfing Founder：在时代浪潮中，感受速度、风险与机会",
    href: "https://mp.weixin.qq.com/",
    imageSrc: "/wechat-feed/01.png",
  },
  {
    id: "wx-02",
    titleZh:
      "对话 | 朱烨辉：从传统金融跳向科技金融创业，他说 “稳定才是最大的风险”",
    href: "https://mp.weixin.qq.com/",
    imageSrc: "/wechat-feed/02.png",
  },
  {
    id: "wx-03",
    titleZh: "对话「恒保科技」王文灿: 想都是问题，做都是答案 | Surfing Founders",
    href: "https://mp.weixin.qq.com/",
    imageSrc: "/wechat-feed/03.png",
  },
  {
    id: "wx-04",
    titleZh: "对话「旧棋新弈」李政翰: 认为酷的事，必须自己做 | Surfing Founders",
    href: "https://mp.weixin.qq.com/",
    imageSrc: "/wechat-feed/04.png",
  },
  {
    id: "wx-05",
    titleZh:
      "对话「Cirtus.AI」Sid：拒绝AI做伴侣，要做AI“监护人” | Surfing Founders",
    href: "https://mp.weixin.qq.com/",
    imageSrc: "/wechat-feed/05.png",
  },
  {
    id: "wx-06",
    titleZh:
      "考到专业第二后，这个大一新生决定休学| Surfing Founders 对话「VeeVerse.AI」王仕城",
    href: "https://mp.weixin.qq.com/",
    imageSrc: "/wechat-feed/06.png",
  },
  {
    id: "wx-07",
    titleZh:
      "与其讲百万融资故事，他更想做用户愿意买单的真产品 | Surfing Founders 对话「Natively」Devy Han",
    href: "https://mp.weixin.qq.com/",
    imageSrc: "/wechat-feed/07.png",
  },
  {
    id: "wx-08",
    titleZh:
      "从小玩硝糖火箭的少年，现在想把世界永存进树脂里 | Surfing Founders 对话「稀树科技」曹瑞翔",
    href: "https://mp.weixin.qq.com/",
    imageSrc: "/wechat-feed/08.png",
  },
];
