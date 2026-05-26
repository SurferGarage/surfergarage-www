import { BILIBILI_SPACE_URL } from "@/lib/surfing-founders-video-season";
import {
  DISCORD_INVITE_URL,
  MAIL_HELLO,
  MAIL_PARTNERS,
} from "@/lib/site-contact";
import { homeSectionHref } from "@/lib/nav-hash";

export type FooterLink = {
  label: string;
  href: string;
  external?: boolean;
};

export const FOOTER_CONTENT_LINKS: readonly FooterLink[] = [
  {
    label: "微信专栏",
    href: homeSectionHref("#founders"),
  },
  {
    label: "B 站播客",
    href: BILIBILI_SPACE_URL,
    external: true,
  },
  {
    label: "Startup Playbook",
    href: "https://github.com/SurferGarage/Startup-playbook",
    external: true,
  },
] as const;

export const FOOTER_CONTACT_LINKS: readonly FooterLink[] = [
  {
    label: "Discord 社群",
    href: DISCORD_INVITE_URL,
    external: true,
  },
  {
    label: MAIL_HELLO,
    href: `mailto:${MAIL_HELLO}`,
  },
  {
    label: MAIL_PARTNERS,
    href: `mailto:${MAIL_PARTNERS}`,
  },
] as const;
