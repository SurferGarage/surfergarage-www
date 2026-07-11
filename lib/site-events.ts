export type SiteEvent = {
  id: string;
  title: string;
  titleEn: string;
  dateDisplay: string;
  dateShort: string;
  location: string;
  role: string;
  description: string;
  href: string;
  external: boolean;
  linkLabel: string;
  imageSrc: string;
  imageAlt: string;
};

export const SITE_EVENTS: readonly SiteEvent[] = [
  {
    id: "builderup-suzhou-2026",
    title: "BuilderUp · 苏州站",
    titleEn: "BuilderUp Suzhou",
    dateDisplay: "2026.07.18 · 14:00–18:00",
    dateShort: "07.18",
    location: "苏州创新创意设计研究院",
    role: "社区承办",
    description:
      "拒绝套路宣讲，让青年创造者围坐，深聊行业现实、项目卡点与奇思构想。",
    href: "#call-join",
    external: false,
    linkLabel: "获取报名信息",
    imageSrc: "/events/builderup-suzhou-2026.png",
    imageAlt: "BuilderUp 苏州站活动海报，苏州现代建筑仰拍",
  },
  {
    id: "adventurex-2026",
    title: "为创造，再一次信仰之跃",
    titleEn: "AdventureX 2026",
    dateDisplay: "2026 · 持续招募中",
    dateShort: "OPEN",
    location: "日期与城市待公布",
    role: "内容与招募合作",
    description:
      "汇集那些买域名、搭博客、录教程、做游戏、写脚本、造工具和焊开发板的年轻造物者。",
    href: "https://mp.weixin.qq.com/s/Fx5c8MvzajrCMAQMwaKpwg",
    external: true,
    linkLabel: "查看招募",
    imageSrc: "/events/adventurex-2026.png",
    imageAlt: "AdventureX 2026 年轻造物者招募视觉",
  },
  {
    id: "rebuild-z-s2-2026",
    title: "先有场景，还是先有技术？",
    titleEn: "Rebuild-Z × GEIA · S2",
    dateDisplay: "2026.09.08–09.11",
    dateShort: "09.08",
    location: "深圳 · 大中华喜来登酒店",
    role: "联合传播",
    description:
      "一场面向 Z 世代的 AI 与具身智能实验，把技术能力重新放回真实场景中检验。",
    href: "https://mp.weixin.qq.com/s/2y7aWdGjT-wwrCm77Tcocw",
    external: true,
    linkLabel: "查看预告",
    imageSrc: "/events/rebuild-z-s2-2026.png",
    imageAlt: "Rebuild-Z 与 GEIA AI 黑客松 S2 活动海报",
  },
] as const;
