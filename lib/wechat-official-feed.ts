/** Surfing Founders 微信专栏：横向新闻卡；封面置于 `public/wechat-feed/01.png` … `08.png`（与下列顺序一致）。 */

export type WechatOfficialFeedItem = {
  id: string;
  /** 卡片主标题（封面下方，偏长可读） */
  titleZh: string;
  /** 封面图底渐变条上的短金句（与主标题分工：一条抓眼、一条展开） */
  stripZh: string;
  /** 点击后打开（新标签页）；上线后替换为对应 `mp.weixin.qq.com/s/...` */
  href: string;
  /** 封面图，来自 `public/` */
  imageSrc: string;
};

export const WECHAT_OFFICIAL_FEED: WechatOfficialFeedItem[] = [
  {
    id: "wx-01",
    titleZh: "Surfing Founder：在时代浪潮中，感受速度、风险与机会",
    stripZh: "浪前开卷 · 这一代逐浪者的共同肖像",
    href: "https://mp.weixin.qq.com/",
    imageSrc: "/wechat-feed/01.png",
  },
  {
    id: "wx-02",
    titleZh:
      "「沃顿没有创新精神，我要去硅谷看看。」——拒绝标准答案，用航线换地图",
    stripZh: "真实抉择 · 从名校到车库的勇气",
    href: "https://mp.weixin.qq.com/",
    imageSrc: "/wechat-feed/02.png",
  },
  {
    id: "wx-03",
    titleZh: "Surfing Wave, Build the Great.",
    stripZh: "浪前信条 · 一句写给我们自己的话",
    href: "https://mp.weixin.qq.com/",
    imageSrc: "/wechat-feed/03.png",
  },
  {
    id: "wx-04",
    titleZh:
      "谁的建议值得你听？岸上的人看动作漂不漂亮，海里的人先看风向与潮汐。",
    stripZh: "同在海中搏浪的先行者 · 最值得请教",
    href: "https://mp.weixin.qq.com/",
    imageSrc: "/wechat-feed/04.png",
  },
  {
    id: "wx-05",
    titleZh: "Outliers：在非共识处前行，直到时间把「天真」写成护城河",
    stripZh: "离经叛道 · 也能被伟大一视同仁",
    href: "https://mp.weixin.qq.com/",
    imageSrc: "/wechat-feed/05.png",
  },
  {
    id: "wx-06",
    titleZh:
      "Builder instead of talker：先做出硬证据，再用杠杆放大，而不是先写完美叙事",
    stripZh: "指数型成长 · 让闭环与数据替你开口",
    href: "https://mp.weixin.qq.com/",
    imageSrc: "/wechat-feed/06.png",
  },
  {
    id: "wx-07",
    titleZh:
      "把冒险当作拥抱世界的方式：先设底线，再在迭代里把胜算一点点抬高",
    stripZh: "真正的勇气 · 是承担后果，不是盲目 all-in",
    href: "https://mp.weixin.qq.com/",
    imageSrc: "/wechat-feed/07.png",
  },
  {
    id: "wx-08",
    titleZh:
      "我们想找到你：也许你正被浪一次次拍下，但你仍可以是下一波浪起时最先站起来的那个人",
    stripZh: "心里有火 · 就值得被世界听见",
    href: "https://mp.weixin.qq.com/",
    imageSrc: "/wechat-feed/08.png",
  },
];
