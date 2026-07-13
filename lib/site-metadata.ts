import type { Metadata, Viewport } from "next";

import { SG_BRAND } from "@/lib/sg-brand";
import { getSiteUrl } from "@/lib/site-url";

export const SITE_NAME = "浪前 Surfer Garage";
export const SITE_TITLE =
  "浪前 Surfer Garage | 记录极早期科技创业现场";
export const SITE_DESCRIPTION =
  "浪前关注 16–28 岁极早期科技创业者，在共识形成之前，记录他们真实的产品进展、判断与转折。";
export const SITE_TAGLINE = SG_BRAND.taglineEn;

const OG_IMAGE = "/opengraph-image";

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
