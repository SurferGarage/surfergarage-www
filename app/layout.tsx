import type { Metadata } from "next";
import { IBM_Plex_Sans, Noto_Sans_SC } from "next/font/google";
import "./globals.css";
import { HeroWaveCanvas } from "@/components/hero-wave-canvas";
import { SmoothScroll } from "@/components/smooth-scroll";
import { getSiteUrl } from "@/lib/site-url";

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

const SITE_TITLE = "浪前 Surfer Garage | 构建属于年轻人的创新媒体与社区";
const SITE_DESCRIPTION =
  "我们寻找那些在时代浪潮中搏浪的先行者。Surfing Founders 人物访谈以非共识的视角，记录叛逆与创造，让你的故事被世界听见。Surfing wave, build the great.";

const siteBase = new URL(`${getSiteUrl()}/`);

export const metadata: Metadata = {
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
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    locale: "zh_CN",
    type: "website",
    siteName: "浪前 Surfer Garage",
    url: siteBase,
    images: [
      {
        url: "/brand-sg-logo.png",
        alt: "浪前 Surfer Garage",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: ["/brand-sg-logo.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-CN"
      className={`${ibm.variable} ${notoSansSC.variable} h-full scroll-smooth antialiased`}
    >
      <body className="min-h-full">
        <SmoothScroll>
          <HeroWaveCanvas hostSelector="[data-hero-wave]" variant="global" />
          <div className="relative z-[1] min-h-full" data-scroll-depth-root>
            {children}
          </div>
        </SmoothScroll>
      </body>
    </html>
  );
}
