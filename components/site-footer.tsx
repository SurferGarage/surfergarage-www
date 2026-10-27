import { SiteAnchorLink } from "@/components/site-anchor-link";
import { SITE_TAGLINE } from "@/lib/site-metadata";
import { FOOTER_CONTACT_LINKS, FOOTER_CONTENT_LINKS, type FooterLink } from "@/lib/site-footer-links";
import { SG_PAGE_SHELL_CLASS } from "@/lib/sg-layout";

const footerLink =
  "inline-flex min-h-9 items-center gap-2 text-[14px] text-[var(--muted-strong)] transition-colors hover:text-[var(--brand-teal)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-teal)] focus-visible:ring-offset-4 focus-visible:ring-offset-[var(--paper-1)]";

function FooterAnchor({ label, href, external }: FooterLink) {
  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={footerLink}>
        {label}<span aria-hidden className="text-[var(--muted)]">↗</span>
      </a>
    );
  }
  return <SiteAnchorLink href={href} className={footerLink}>{label}</SiteAnchorLink>;
}

function FooterLinks({ title, links }: { title: string; links: readonly FooterLink[] }) {
  return (
    <nav aria-label={title} className="border-t border-[var(--hairline)] pt-5 lg:col-span-3">
      <h2 className="mb-4 font-[family-name:var(--font-mono)] text-[12px] font-medium tracking-[0.08em] text-[var(--muted)]">{title}</h2>
      <ul className="flex flex-col gap-1">
        {links.map((link) => <li key={link.href}><FooterAnchor {...link} /></li>)}
      </ul>
    </nav>
  );
}

export function SiteFooter() {
  return (
    <footer className="relative z-[3] border-t border-[var(--hairline)] bg-[var(--paper-1)] pt-14 md:pt-20">
      <div className={SG_PAGE_SHELL_CLASS}>
        <div className="grid grid-cols-1 gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-12">
          <div className="sm:col-span-2 lg:col-span-6 lg:pr-12">
            <p className="font-[family-name:var(--font-zh)] text-[32px] font-semibold leading-none tracking-[-0.05em] text-[var(--foreground)] md:text-[40px]">浪前<span className="ml-4 align-middle font-[family-name:var(--font-mono)] text-[11px] font-normal uppercase tracking-[0.1em] text-[var(--muted)]">Surfer Garage</span></p>
            <p className="mt-5 max-w-[24rem] font-[family-name:var(--font-serif-zh)] text-[19px] leading-[1.6] text-[var(--muted-strong)] md:text-[22px]">{SITE_TAGLINE}</p>
            <p className="mt-5 max-w-[25rem] text-[14px] leading-[1.8] text-[var(--muted)]">发现、理解和连接正在创造新事物的年轻人。</p>
          </div>
          <FooterLinks title="联络与加入" links={FOOTER_CONTACT_LINKS} />
          <FooterLinks title="开源共建" links={FOOTER_CONTENT_LINKS} />
        </div>
        <div className="mt-12 flex flex-col gap-4 border-t border-[var(--hairline)] py-6 text-[12px] text-[var(--muted)] sm:flex-row sm:items-center sm:justify-between md:mt-16">
          <p>© {new Date().getFullYear()} 浪前 Surfer Garage</p>
          <a href="/privacy" className="inline-flex min-h-9 w-fit items-center underline-offset-4 hover:text-[var(--foreground)] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-teal)]">隐私政策</a>
        </div>
      </div>
      <div aria-hidden data-footer-wordmark className="relative select-none overflow-hidden border-t border-[var(--hairline-soft)]">
        <p data-footer-wordmark-letters className="wordmark-display block w-full overflow-hidden whitespace-nowrap py-6 text-center text-[clamp(2.5rem,14vw,12rem)] leading-none tracking-[-0.04em] text-[color-mix(in_oklch,var(--foreground)_8%,transparent)] md:py-8">SURFERGARAGE</p>
      </div>
    </footer>
  );
}
