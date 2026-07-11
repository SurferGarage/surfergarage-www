import type { Metadata, Viewport } from "next";
import "./globals.css";
import { buildSiteMetadata, buildSiteViewport } from "@/lib/site-metadata";
import { getOrganizationJsonLd, getWebSiteJsonLd } from "@/lib/site-json-ld";

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
      className="h-full antialiased"
    >
      <head>
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
        {children}
      </body>
    </html>
  );
}
