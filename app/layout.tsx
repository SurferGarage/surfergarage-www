import type { Metadata, Viewport } from "next";
import {
  IBM_Plex_Mono,
  IBM_Plex_Sans,
  Instrument_Serif,
  Noto_Sans_SC,
  Noto_Serif_SC,
} from "next/font/google";
import "./globals.css";
import { HeroWaveCanvasLazy } from "@/components/sg-lazy-hero-wave";
import { SgPerformanceGuards } from "@/components/sg-performance-guards";
import { SmoothScroll } from "@/components/smooth-scroll";
import { buildSiteMetadata, buildSiteViewport } from "@/lib/site-metadata";
import { getOrganizationJsonLd, getWebSiteJsonLd } from "@/lib/site-json-ld";

const ibm = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-en",
  display: "swap",
});

const notoSansSC = Noto_Sans_SC({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-zh",
  display: "swap",
});

// IBM Plex Mono — 时间码 / 编号 / stats / tabular 数字
const ibmMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-mono",
  display: "swap",
});

// Instrument Serif — 杂志级显示标题 / 引文 / 大数字
const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});

/** VIS 中文编辑衬线（Source Han Serif SC 的 Web 替代） */
const notoSerifSC = Noto_Serif_SC({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-serif-zh",
  display: "swap",
});

export const metadata: Metadata = buildSiteMetadata();
export const viewport: Viewport = buildSiteViewport();

const JSON_LD = [getOrganizationJsonLd(), getWebSiteJsonLd()];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-CN"
      suppressHydrationWarning
      className={`${ibm.variable} ${notoSansSC.variable} ${ibmMono.variable} ${instrumentSerif.variable} ${notoSerifSC.variable} h-full antialiased`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{if("scrollRestoration"in history)history.scrollRestoration="manual";window.scrollTo(0,0);document.documentElement.scrollTop=0;}catch(e){}})();`,
          }}
        />
        <link
          rel="preconnect"
          href="https://player.bilibili.com"
          crossOrigin="anonymous"
        />
        <link rel="dns-prefetch" href="https://player.bilibili.com" />
        <link rel="dns-prefetch" href="https://api.bilibili.com" />
      </head>
      <body className="min-h-full">
        {JSON_LD.map((data, index) => (
          <script
            key={index}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
          />
        ))}
        <SmoothScroll>
          <SgPerformanceGuards />
          <HeroWaveCanvasLazy hostSelector="[data-hero-wave]" variant="global" />
          <div className="relative z-[1] min-h-full" data-scroll-depth-root>
            {children}
          </div>
        </SmoothScroll>
      </body>
    </html>
  );
}
