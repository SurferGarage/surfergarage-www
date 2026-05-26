/**
 * Surfing Founders 人物访谈 · 微信专栏：横向新闻卡。
 * `imageSrc` 与 `public/wechat-feed/01.png` … `08.png` 一一对应。
 */

import { cleanWechatArticleUrl } from "@/lib/wechat-url";

export type WechatOfficialFeedItem = {
  id: string;
  titleZh: string;
  href: string;
  imageSrc: string;
};

const RAW_FEED: WechatOfficialFeedItem[] = [
  {
    id: "wx-01",
    titleZh: "Surfing Founder：在时代浪潮中，感受速度、风险与机会",
    href: "https://mp.weixin.qq.com/s/KD0CIVjAqbmJL8nTWcxvzw",
    imageSrc: "/wechat-feed/01.png",
  },
  {
    id: "wx-02",
    titleZh:
      "对话 | 朱烨辉：从传统金融跳向科技金融创业，他说「稳定才是最大的风险」",
    href: "https://mp.weixin.qq.com/s/ALzOklzqnj2sIRlQUgOLtQ",
    imageSrc: "/wechat-feed/02.png",
  },
  {
    id: "wx-03",
    titleZh: "对话「恒保科技」王文灿：想都是问题，做都是答案 | Surfing Founders",
    href: "https://mp.weixin.qq.com/s?__biz=MzYyMjg4NTE2NQ==&mid=2247483725&idx=1&sn=1633e9e677861dc743e111c566065623&chksm=fec82fc8762d9f5f278f31ad081e8d55b078d9247441a9a5a05cb2119167d1362a377aefa818&scene=126&sessionid=1778737037&subscene=undefined&clicktime=1778763580&enterid=1778763580#rd",
    imageSrc: "/wechat-feed/03.png",
  },
  {
    id: "wx-04",
    titleZh:
      "对话「旧棋新弈」李政翰：认为酷的事，必须自己做 | Surfing Founders",
    href: "https://mp.weixin.qq.com/s/gFv8kSmMDDD25wMIl613Qg",
    imageSrc: "/wechat-feed/04.png",
  },
  {
    id: "wx-05",
    titleZh:
      "对话「Citrus.AI」Sid：拒绝AI做伴侣，要做AI「监护人」 | Surfing Founders",
    href: "https://mp.weixin.qq.com/s/dqk41iYHbX6zK0DA04raAw",
    imageSrc: "/wechat-feed/05.png",
  },
  {
    id: "wx-06",
    titleZh:
      "考到专业第二后，这个大一新生决定休学 | Surfing Founders 对话「VeeVerse.AI」王仕城",
    href: "https://mp.weixin.qq.com/s/5KnKrimRlAZ1PSGsQciiRg",
    imageSrc: "/wechat-feed/06.png",
  },
  {
    id: "wx-07",
    titleZh:
      "与其讲百万融资故事，他更想做用户愿意买单的真产品 | Surfing Founders 对话「Natively」Devy Han",
    href: "https://mp.weixin.qq.com/s?__biz=MzYyMjg4NTE2NQ==&mid=2247483780&idx=1&sn=df4ecab78a247ced20202cb05b3f0e98&chksm=fe864e69020f4152504bdc62e760164adf17a4168d2994c41b51ec3c3d7c2d0dde07c2c75643&scene=126&sessionid=1778737037&subscene=undefined&clicktime=1778763619&enterid=1778763619#rd",
    imageSrc: "/wechat-feed/07.png",
  },
  {
    id: "wx-08",
    titleZh:
      "从小玩硝糖火箭的少年，现在想把世界永存进树脂里 | Surfing Founders 对话「稀树科技」曹瑞翔",
    href: "https://mp.weixin.qq.com/s?__biz=MzYyMjg4NTE2NQ==&mid=2247483787&idx=1&sn=f59707a92d2666362207b62be4e5b4ac&chksm=fee31cabc6e05d0447ff4d6d579d1dc29d4b83a0ccf313019da48944ab2a88414fbb3579933c&scene=126&sessionid=1778737037&subscene=undefined&clicktime=1778763628&enterid=1778763628#rd",
    imageSrc: "/wechat-feed/08.png",
  },
  {
    id: "wx-09",
    titleZh: "对话尼克·兰德：逃逸、能动性与技术奇点 | 造浪之人",
    href: "https://mp.weixin.qq.com/s/_mzUi2P013Rz4XbkK2K1Ew",
    imageSrc: "/wechat-feed/09.png",
  },
];

export const WECHAT_OFFICIAL_FEED: WechatOfficialFeedItem[] = RAW_FEED.map(
  (item) => ({
    ...item,
    href: cleanWechatArticleUrl(item.href),
  }),
);

/** 公众号目录：触点区「文章」侧栏用。
 * 当前按发布顺序倒序展示（最新在上），保留 8 条；如未来接入真实日期可改 group by month。 */
export const WECHAT_FEED_DIRECTORY: ReadonlyArray<{
  id: string;
  titleZh: string;
  href: string;
  ordinal: string;
}> = WECHAT_OFFICIAL_FEED.slice()
  .reverse()
  .map((item, i, arr) => ({
    id: item.id,
    titleZh: item.titleZh,
    href: item.href,
    ordinal: `Vol.${String(arr.length - i).padStart(2, "0")}`,
  }));
