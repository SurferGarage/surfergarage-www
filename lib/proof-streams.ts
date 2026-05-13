export type ProofRow = {
  title: string;
  meta: string;
  /** 无 `href` 时 UI 为「即将上线」态，避免 `href="#"` */
  href?: string;
};

export type ProofStream = {
  key: string;
  titleEn: string;
  titleZh: string;
  introZh?: string;
  rows: ProofRow[];
};

/** The Proof 三列内容源；后续可改为 CMS / Git 拉取。 */
export const PROOF_STREAMS: ProofStream[] = [
  {
    key: "founder-talk",
    titleEn: "Founder Talk",
    titleZh: "深度访谈",
    introZh: "拒绝造神，保留失败与代价账本；讲动作，不讲神话。",
    rows: [
      {
        title: "Vol.001 真正值得听的建议，来自海里的人",
        meta: "发刊词 · 待上架",
      },
    ],
  },
  {
    key: "coffee-chat",
    titleEn: "Coffee Chat",
    titleZh: "线下碰撞",
    introZh: "带着真实问题下场，不聊空趋势，只拆可执行路径。",
    rows: [
      {
        title:
          "拒绝平庸社交：寻找长三角的 19 岁硬件极客与 AI 独立开发者",
        meta: "咖啡局 · 滚动开放",
      },
    ],
  },
  {
    key: "builder-lab",
    titleEn: "Builder Lab",
    titleZh: "闭门会",
    introZh: "手搓、试错、复盘。所有讨论以可验证闭环为终点。",
    rows: [
      {
        title: "48小时黑客松复盘：从 Demo 到验证",
        meta: "Lab · 纪要向会员发放",
      },
    ],
  },
];
