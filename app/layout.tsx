import type { Metadata } from "next";
import { IBM_Plex_Sans, Noto_Sans_SC } from "next/font/google";
import "./globals.css";
import { SmoothScroll } from "@/components/smooth-scroll";

const ibm = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-en",
  display: "swap",
});

const notoSansSC = Noto_Sans_SC({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-zh",
  display: "swap",
});

export const metadata: Metadata = {
  title: "SurferGarage — 浪前车库",
  description:
    "Surfing Founder · Harmless Engineering. Builder instead of talker.",
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
          <div className="relative z-[1] min-h-full">{children}</div>
        </SmoothScroll>
      </body>
    </html>
  );
}
