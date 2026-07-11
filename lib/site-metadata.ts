import type { Metadata, Viewport } from "next";

import { SG_BRAND } from "@/lib/sg-brand";
import { getSiteUrl } from "@/lib/site-url";

export const SITE_NAME = "浪前 Surfer Garage";
export const SITE_TITLE =
  "浪前 Surfer Garage | 极早期科技创业者的高信任媒体";
export const SITE_DESCRIPTION =
  "浪前 Surfer Garage 记录 16–28 岁极早期科技创业者的真实现场，提供高信任内容资产与社区连接，让下一代 Surfing Founders 更早被看见、被理解、被连接。";
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
