import { SITE_DESCRIPTION, SITE_NAME } from "@/lib/site-metadata";
import { BILIBILI_SPACE_URL } from "@/lib/surfing-founders-video-season";
import { DISCORD_INVITE_URL, MAIL_HELLO } from "@/lib/site-contact";
import { getSiteUrl } from "@/lib/site-url";

export function getOrganizationJsonLd(): Record<string, unknown> {
  const url = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    alternateName: ["SurferGarage", "Surfer Garage"],
    description: SITE_DESCRIPTION,
    url,
    email: MAIL_HELLO,
    sameAs: [
      BILIBILI_SPACE_URL,
      "https://github.com/SurferGarage",
      DISCORD_INVITE_URL,
    ],
  };
}

export function getWebSiteJsonLd(): Record<string, unknown> {
  const url = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url,
    inLanguage: "zh-CN",
  };
}
