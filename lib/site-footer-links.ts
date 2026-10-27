import { DISCORD_INVITE_URL, MAIL_HELLO } from "@/lib/site-contact";
import { SITE_JOIN_HREF } from "@/lib/recruit-source";
import { SITE_STORY_HREF } from "@/lib/site-nav";

export type FooterLink = {
  label: string;
  href: string;
  external?: boolean;
};

export const FOOTER_CONTENT_LINKS: readonly FooterLink[] = [
  {
    label: "Startup Playbook",
    href: "https://github.com/SurferGarage/Startup-playbook",
    external: true,
  },
  {
    label: "失败手册",
    href: "https://github.com/SurferGarage/failure-manual",
    external: true,
  },
  {
    label: "学习路径",
    href: "https://github.com/SurferGarage/.github/blob/main/docs/LEARNING_PATH.md",
    external: true,
  },
] as const;

export const FOOTER_CONTACT_LINKS: readonly FooterLink[] = [
  {
    label: "小浪 · 分享你的故事",
    href: SITE_STORY_HREF,
  },
  {
    label: "加入浪前",
    href: SITE_JOIN_HREF,
  },
  {
    label: "内容与合作邮箱",
    href: `mailto:${MAIL_HELLO}`,
  },
  {
    label: "Discord 社群",
    href: DISCORD_INVITE_URL,
    external: true,
  },
] as const;
