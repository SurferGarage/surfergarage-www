import { SiteAnchorLink } from "@/components/site-anchor-link";
import { SITE_TAGLINE } from "@/lib/site-metadata";
import {
  FOOTER_CONTACT_LINKS,
  FOOTER_CONTENT_LINKS,
} from "@/lib/site-footer-links";
import { SITE_PRIMARY_NAV } from "@/lib/site-nav";
import { SG_PAGE_SHELL_CLASS } from "@/lib/sg-layout";

const footerLink =
  "font-[family-name:var(--font-zh)] text-[14px] text-[var(--muted-strong)] transition-colors hover:text-[var(--brand-teal)] md:text-[15px]";

function FooterAnchor({
  label,
  href,
  external,
}: {
  label: string;
  href: string;
  external?: boolean;
}) {
  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={footerLink}
      >
        {label} <span aria-hidden className="text-[var(--muted)]">↗</span>
      </a>
    );
  }
  return (
    <a href={href} className={footerLink}>
      {label}
    </a>
  );
}

function FooterHashLink({ href, label }: { href: string; label: string }) {
  return (
    <SiteAnchorLink href={href} className={footerLink}>
      {label}
    </SiteAnchorLink>
  );
}

function FooterColumnHeading({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-[family-name:var(--font-zh)] text-[14px] font-medium text-[var(--muted)] md:text-[15px]">
      {children}
    </p>
  );
}

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative z-[3] border-t border-[var(--hairline)] bg-[var(--paper-1)] pt-16 md:pt-20">
      <div className={SG_PAGE_SHELL_CLASS}>
        {/* —— 上半区：响应式列网格 —— */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-12 lg:gap-x-8">
          {/* Brand + 标语：占 4/12 */}
          <div className="col-span-2 sm:col-span-3 lg:col-span-4">
            <p className="font-[family-name:var(--font-zh)] text-[15px] font-medium text-[var(--foreground)] md:text-[16px]">
              浪前 Surfer Garage
            </p>
            <p className="mt-3 editorial-serif text-[clamp(1.15rem,2vw,1.5rem)] leading-[1.35] text-[var(--muted-strong)]">
              {SITE_TAGLINE}
            </p>
          </div>

          {/* 导航 */}
          <div className="lg:col-span-2">
            <FooterColumnHeading>导航</FooterColumnHeading>
            <ul className="mt-4 flex flex-col gap-2.5">
              {SITE_PRIMARY_NAV.map((item) => (
                <li key={item.href}>
                  <FooterHashLink href={item.href} label={item.labelZh} />
                </li>
              ))}
            </ul>
          </div>

          {/* 内容 */}
          <div className="lg:col-span-3">
            <FooterColumnHeading>内容</FooterColumnHeading>
            <ul className="mt-4 flex flex-col gap-2.5">
              {FOOTER_CONTENT_LINKS.map((link) => (
                <li key={link.href}>
                  <FooterAnchor {...link} />
                </li>
              ))}
            </ul>
          </div>

          {/* 联络 */}
          <div className="lg:col-span-3">
            <FooterColumnHeading>联系</FooterColumnHeading>
            <ul className="mt-4 flex flex-col gap-2.5">
              {FOOTER_CONTACT_LINKS.map((link) => (
                <li key={link.href}>
                  <FooterAnchor {...link} />
                </li>
              ))}
            </ul>
          </div>

        </div>

        <div className="mt-14 flex flex-col gap-5 border-t border-[var(--hairline)] pt-8 md:flex-row md:items-center md:justify-between">
          <p className="font-[family-name:var(--font-zh)] text-[14px] text-[var(--muted)] md:text-[15px]">
            © {year} 浪前 Surfer Garage
          </p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            <a href="/privacy" className={footerLink}>
              隐私政策
            </a>
          </div>
        </div>
      </div>

      {/* —— 巨型品牌字标 —— 收尾，低调点缀；滚动驱动字符 stagger 由 register-footer-wordmark-reveal 接管 */}
      <div
        aria-hidden
        data-footer-wordmark
        className="relative mt-10 select-none overflow-hidden border-t border-[var(--hairline-soft)] md:mt-16"
      >
        <p
          data-footer-wordmark-letters
          className="wordmark-display block w-full overflow-hidden whitespace-nowrap pb-3 pt-8 text-center text-[clamp(2.5rem,14vw,12rem)] leading-none tracking-[-0.04em] text-[color-mix(in_oklch,var(--foreground)_5%,transparent)] md:pt-10"
        >
          SURFERGARAGE
        </p>
      </div>
    </footer>
  );
}
