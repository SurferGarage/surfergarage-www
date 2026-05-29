import type { Metadata, Viewport } from "next";

import { SG_BRAND } from "@/lib/sg-brand";
import { getSiteUrl } from "@/lib/site-url";

export const SITE_NAME = "浪前 Surfer Garage";
export const SITE_TITLE =
  "浪前 Surfer Garage | 构建属于年轻人的创新媒体与社区";
export const SITE_DESCRIPTION =
  "我们寻找那些在时代浪潮中搏浪的先行者。Surfing Founders 人物访谈以非共识的视角，记录叛逆与创造，让你的故事被世界听见。Surfing Wave, Build the Great.";
export const SITE_TAGLINE = SG_BRAND.taglineEn;

const OG_IMAGE = "/opengraph-image";
const FAVICON = "/brand-sg-logo.png";

export function buildSiteMetadata(): Metadata {
  const siteBase = new URL(`${getSiteUrl()}/`);

  return {
    metadataBase: siteBase,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    keywords: [
      "Builder",
      "Hackathon",
      "Startup",
      "GenZ",
      "Community",
      "浪前",
      "创业",
      "SurferGarage",
      "Surfer Garage",
      "Surfing Founders",
    ],
    alternates: {
      canonical: "/",
    },
    openGraph: {
      title: SITE_TITLE,
      description: SITE_DESCRIPTION,
      locale: "zh_CN",
      type: "website",
      siteName: SITE_NAME,
      url: siteBase,
      images: [
        {
          url: OG_IMAGE,
          width: 1200,
          height: 630,
          alt: SITE_NAME,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: SITE_TITLE,
      description: SITE_DESCRIPTION,
      images: [OG_IMAGE],
    },
    icons: {
      icon: FAVICON,
      apple: FAVICON,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

/** Next 16: themeColor / colorScheme 须挪到独立 viewport 导出 */
export function buildSiteViewport(): Viewport {
  return {
    themeColor: SG_BRAND.paper0,
    colorScheme: "dark",
    viewportFit: "cover",
  };
}
