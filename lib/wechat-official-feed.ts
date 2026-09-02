/**
 * Surfing Founders 人物访谈 · 微信专栏：横向新闻卡。
 * 常规封面来自 `public/wechat-feed`，重点文章可使用 `public/editorial` 的重构视觉。
 */

import { cleanWechatArticleUrl } from "@/lib/wechat-url";

export type WechatOfficialFeedItem = {
  id: string;
  titleZh: string;
  stageTitleZh: string;
  stageMetaZh: string;
  href: string;
  imageSrc: string;
  imageAlt: string;
};

const RAW_FEED: WechatOfficialFeedItem[] = [
  {
    id: "wx-01",
    titleZh: "Surfing Founder：在时代浪潮中，感受速度、风险与机会",
    stageTitleZh: "在时代浪潮中，感受速度、风险与机会",
    stageMetaZh: "Surfing Founder · 创刊",
    href: "https://mp.weixin.qq.com/s/KD0CIVjAqbmJL8nTWcxvzw",
    imageSrc: "/wechat-feed/01.png",
    imageAlt: "Surfing Founder 创刊文章封面",
  },
  {
    id: "wx-02",
    titleZh:
      "对话 | 朱烨辉：从传统金融跳向科技金融创业，他说「稳定才是最大的风险」",
    stageTitleZh: "从传统金融跳向科技金融创业，他说「稳定才是最大的风险」",
    stageMetaZh: "朱烨辉 · 科技金融",
    href: "https://mp.weixin.qq.com/s/ALzOklzqnj2sIRlQUgOLtQ",
    imageSrc: "/wechat-feed/02.png",
    imageAlt: "朱烨辉人物访谈文章封面",
  },
  {
    id: "wx-03",
    titleZh: "对话「恒保科技」王文灿：想都是问题，做都是答案 | Surfing Founders",
    stageTitleZh: "想都是问题，做都是答案",
    stageMetaZh: "王文灿 · 恒保科技",
    href: "https://mp.weixin.qq.com/s?__biz=MzYyMjg4NTE2NQ==&mid=2247483725&idx=1&sn=1633e9e677861dc743e111c566065623&chksm=fec82fc8762d9f5f278f31ad081e8d55b078d9247441a9a5a05cb2119167d1362a377aefa818&scene=126&sessionid=1778737037&subscene=undefined&clicktime=1778763580&enterid=1778763580#rd",
    imageSrc: "/wechat-feed/03.png",
    imageAlt: "王文灿与恒保科技人物访谈文章封面",
  },
  {
    id: "wx-04",
    titleZh:
      "对话「旧棋新弈」李政翰：认为酷的事，必须自己做 | Surfing Founders",
    stageTitleZh: "认为酷的事，必须自己做",
    stageMetaZh: "李政翰 · 旧棋新弈",
    href: "https://mp.weixin.qq.com/s/gFv8kSmMDDD25wMIl613Qg",
    imageSrc: "/editorial/li-zhenghan-cover.png",
    imageAlt: "李政翰旧棋新弈文章的蓝白象棋系统视觉",
  },
  {
    id: "wx-05",
    titleZh:
      "对话「Citrus.AI」Sid：拒绝AI做伴侣，要做AI「监护人」 | Surfing Founders",
    stageTitleZh: "拒绝 AI 做伴侣，要做 AI「监护人」",
    stageMetaZh: "Sid · Citrus.AI",
    href: "https://mp.weixin.qq.com/s/dqk41iYHbX6zK0DA04raAw",
    imageSrc: "/wechat-feed/05.png",
    imageAlt: "Sid 与 Citrus.AI 人物访谈文章封面",
  },
  {
    id: "wx-06",
    titleZh:
      "考到专业第二后，这个大一新生决定休学 | Surfing Founders 对话「VeeVerse.AI」王仕城",
    stageTitleZh: "考到专业第二后，这个大一新生决定休学",
    stageMetaZh: "王仕城 · VeeVerse.AI",
    href: "https://mp.weixin.qq.com/s/5KnKrimRlAZ1PSGsQciiRg",
    imageSrc: "/wechat-feed/06.png",
    imageAlt: "王仕城与 VeeVerse.AI 人物访谈文章封面",
  },
  {
    id: "wx-07",
    titleZh:
      "与其讲百万融资故事，他更想做用户愿意买单的真产品 | Surfing Founders 对话「Natively」Devy Han",
    stageTitleZh: "与其讲百万融资故事，他更想做用户愿意买单的真产品",
    stageMetaZh: "Devy Han · Natively",
    href: "https://mp.weixin.qq.com/s?__biz=MzYyMjg4NTE2NQ==&mid=2247483780&idx=1&sn=df4ecab78a247ced20202cb05b3f0e98&chksm=fe864e69020f4152504bdc62e760164adf17a4168d2994c41b51ec3c3d7c2d0dde07c2c75643&scene=126&sessionid=1778737037&subscene=undefined&clicktime=1778763619&enterid=1778763619#rd",
    imageSrc: "/wechat-feed/07.png",
    imageAlt: "Devy Han 与 Natively 人物访谈文章封面",
  },
  {
    id: "wx-08",
    titleZh:
      "从小玩硝糖火箭的少年，现在想把世界永存进树脂里 | Surfing Founders 对话「稀树科技」曹瑞翔",
    stageTitleZh: "从小玩硝糖火箭的少年，现在想把世界永存进树脂里",
    stageMetaZh: "曹瑞翔 · 稀树科技",
    href: "https://mp.weixin.qq.com/s?__biz=MzYyMjg4NTE2NQ==&mid=2247483787&idx=1&sn=f59707a92d2666362207b62be4e5b4ac&chksm=fee31cabc6e05d0447ff4d6d579d1dc29d4b83a0ccf313019da48944ab2a88414fbb3579933c&scene=126&sessionid=1778737037&subscene=undefined&clicktime=1778763628&enterid=1778763628#rd",
    imageSrc: "/wechat-feed/08.png",
    imageAlt: "曹瑞翔与稀树科技人物访谈文章封面",
  },
  {
    id: "wx-09",
    titleZh: "对话尼克·兰德：逃逸、能动性与技术奇点 | 造浪之人",
    stageTitleZh: "逃逸、能动性与技术奇点",
    stageMetaZh: "尼克·兰德 · 造浪之人",
    href: "https://mp.weixin.qq.com/s/_mzUi2P013Rz4XbkK2K1Ew",
    imageSrc: "/wechat-feed/09.png",
    imageAlt: "尼克·兰德对话文章封面",
  },
  {
    id: "wx-10",
    titleZh:
      "3个月10万用户，他让你不再为「抽卡式设计」抓狂 | 浪前对话「Seede.AI」杨沐锦Muji",
    stageTitleZh: "3 个月 10 万用户，他让你不再为「抽卡式设计」抓狂",
    stageMetaZh: "杨沐锦 Muji · Seede.AI",
    href: "https://mp.weixin.qq.com/s/3Udu_QNbidBRSxU5pyKlEA",
    imageSrc: "/video-covers/muji-vol-03.jpg",
    imageAlt: "杨沐锦 Muji 与 Seede.AI 人物访谈文章封面",
  },
  {
    id: "wx-11",
    titleZh:
      "19岁成为硅谷全职工程师，他押中了Agent开发新范式 | 何介然Klein「Trellis」Surfing Founders",
    stageTitleZh: "19 岁成为硅谷全职工程师，他押中了 Agent 开发新范式",
    stageMetaZh: "何介然 Klein · Trellis",
    href: "https://mp.weixin.qq.com/s/5rcC24smfaDHC2FAoaRNjQ",
    imageSrc: "/wechat-feed/10.png",
    imageAlt: "何介然 Klein 与 Trellis 人物访谈文章封面",
  },
  {
    id: "wx-12",
    titleZh:
      "19岁做了8款产品后，她说要创业，就不要怕被抄 | Yiwei「GoGlobal.to」Surfing Founders",
    stageTitleZh: "19 岁做了 8 款产品后，她说创业就不要怕被抄",
    stageMetaZh: "Yiwei · GoGlobal.to",
    href: "https://mp.weixin.qq.com/s/6fsE2v1MGyJ0vw6qlBkd6A",
    imageSrc: "/wechat-feed/12.png",
    imageAlt: "Yiwei 与 GoGlobal.to 人物访谈文章封面",
  },
  {
    id: "wx-13",
    titleZh:
      "22岁千万营收之后，她选择按下人生重启键 | Kiana「济谦AI」Surfing Founders",
    stageTitleZh: "22 岁千万营收之后，她选择按下人生重启键",
    stageMetaZh: "Kiana · 济谦 AI",
    href: "https://mp.weixin.qq.com/s/p928ZFBxBMMiO9uQgd9UwQ",
    imageSrc: "/editorial/kiana-cover.png",
    imageAlt: "Kiana 在室外台阶前的人物照片",
  },
  {
    id: "wx-14",
    titleZh:
      "看过上千份简历后，他发现大厂与初创抢的是一种人 | 泛函 Surfing Founders",
    stageTitleZh: "看过上千份简历后，他发现大厂与初创抢的是一种人",
    stageMetaZh: "泛函 · AI Recruiting",
    href: "https://mp.weixin.qq.com/s/msFP2SiFLQTHdwnuFsBFBQ",
    imageSrc: "/editorial/fanhan-cover.png",
    imageAlt: "泛函在字节跳动活动现场分享",
  },
  {
    id: "wx-15",
    titleZh:
      "从黑客松到真创业，18岁的他想用AI关怀老人 | 刘思哲「守忆科技」Surfing Founders",
    stageTitleZh: "从黑客松到真创业，18岁的他想用AI关怀老人",
    stageMetaZh: "刘思哲 · 守忆科技",
    href: "https://mp.weixin.qq.com/s/WyQ3C3CA8mqI7J7X8JyMiQ",
    imageSrc: "/wechat-feed/15.png",
    imageAlt: "刘思哲与守忆科技人物访谈文章封面",
  },
];

export const WECHAT_OFFICIAL_FEED: WechatOfficialFeedItem[] = RAW_FEED.map(
  (item) => ({
    ...item,
    href: cleanWechatArticleUrl(item.href),
  }),
);

/** 微信专栏默认选中最新一篇（片场右栏封面 / Vol 列表） */
export const LATEST_WECHAT_FEED_ITEM =
  WECHAT_OFFICIAL_FEED[WECHAT_OFFICIAL_FEED.length - 1]!;

export const DEFAULT_WECHAT_FEED_ID = LATEST_WECHAT_FEED_ITEM.id;

/** 公众号目录：触点区「文章」侧栏用。
 * 当前按发布顺序倒序展示（最新在上）；如未来接入真实日期可改 group by month。 */
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
