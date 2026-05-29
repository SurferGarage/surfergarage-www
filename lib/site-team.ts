/**
 * 浪前核心成员 — 联络页「认人」区单一事实源。
 * 人像来自母仓库 `company site/surfergarage-site/public/images/`。
 */

export type SurferGarageTeamMember = {
  id: string;
  nameZh: string;
  nameEn?: string;
  roleZh: string;
  bioZh: string;
  portraitSrc: string;
};

/** 与旧站 about 页一致，文案按全站「单行记忆点」略收 */
export const SURFER_GARAGE_TEAM: readonly SurferGarageTeamMember[] = [
  {
    id: "edison",
    nameZh: "徐逸翔",
    nameEn: "Edison",
    roleZh: "发起人",
    bioZh:
      "寻找值得被世界听见的 Surfing Founders。创新是冒险家拥抱生活的方式。",
    portraitSrc: "/team/edison.jpg",
  },
  {
    id: "franklin",
    nameZh: "孔繁睿",
    nameEn: "Franklin",
    roleZh: "技术合伙人",
    bioZh:
      "从 AI 到去中心化网络，负责数字基础设施，把狂野的想法编译成可触碰的未来。",
    portraitSrc: "/team/franklin.jpg",
  },
] as const;
