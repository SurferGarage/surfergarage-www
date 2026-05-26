import Link from "next/link";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { homeSectionHref } from "@/lib/nav-hash";
import { SITE_PRIMARY_NAV } from "@/lib/site-nav";
import { SG_PAGE_SHELL_CLASS } from "@/lib/sg-layout";

export default function NotFound() {
  return (
    <div className="flex min-h-[100svh] flex-col bg-[var(--paper-1)]">
      <SiteHeader />
      <main
        className={`relative flex flex-1 flex-col justify-center py-20 md:py-28 ${SG_PAGE_SHELL_CLASS}`}
      >
        <div className="grid grid-cols-12 gap-x-4 md:gap-x-6">
          <div className="col-span-12 md:col-span-7">
            <div className="flex items-baseline gap-3">
              <span className="editorial-mono text-[11px] uppercase tracking-[0.22em] text-[var(--accent-amber)]">
                § ERR
              </span>
              <p className="editorial-eyebrow text-[var(--foreground)]">
                404 · Out of waters
              </p>
            </div>
            <h1 className="mt-6 editorial-serif text-[clamp(2.5rem,7vw,5rem)] leading-[1] text-[var(--foreground)]">
              这一页<br aria-hidden />
              <span className="text-[var(--muted-strong)]">还在海里。</span>
            </h1>
            <p className="mt-6 max-w-[44ch] font-[family-name:var(--font-zh)] text-[15px] leading-[1.75] text-[var(--muted-strong)] md:text-[17px]">
              链接可能已失效，或这一页尚未上岸。你可以回到首页，从「宣言」入水，按节奏抵达「片场」「触点」与「联络」。
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-3">
              <Link
                href="/"
                className="inline-flex items-center gap-2 rounded-sm border border-[var(--brand-teal)]/55 bg-[color-mix(in_oklch,var(--brand-teal)_14%,transparent)] px-5 py-3 editorial-mono text-[11px] uppercase tracking-[0.18em] text-[var(--foreground)] transition-[background-color,border-color] hover:border-[var(--brand-teal)] hover:bg-[color-mix(in_oklch,var(--brand-teal)_22%,transparent)]"
              >
                <span>返回首页</span>
                <span aria-hidden className="text-[var(--brand-teal)]">↗</span>
              </Link>
              <a
                href="mailto:hello@surfergarage.com?subject=Broken%20link%20on%20surfergarage.com"
                className="editorial-mono text-[10.5px] uppercase tracking-[0.18em] text-[var(--muted)] underline-offset-4 transition-colors hover:text-[var(--brand-teal)] hover:underline"
              >
                Report broken link ↗
              </a>
            </div>
          </div>

          <aside className="col-span-12 mt-12 md:col-span-4 md:col-start-9 md:mt-0">
            <p className="editorial-eyebrow text-[var(--muted)]">
              Quick jump · 区块直达
            </p>
            <nav
              className="mt-4 flex flex-col divide-y divide-[var(--hairline-soft)] border-y border-[var(--hairline)]"
              aria-label="站点导航"
            >
              {SITE_PRIMARY_NAV.map((item, i) => (
                <Link
                  key={item.href}
                  href={homeSectionHref(item.href)}
                  className="group flex items-center justify-between gap-3 py-3.5"
                >
                  <span className="flex items-baseline gap-3">
                    <span className="editorial-mono text-[10px] uppercase tracking-[0.16em] text-[var(--muted)]">
                      §{String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="font-[family-name:var(--font-zh)] text-[14.5px] font-medium text-[var(--muted-strong)] transition-colors group-hover:text-[var(--foreground)] md:text-[15px]">
                      {item.labelZh}
                    </span>
                  </span>
                  <span
                    aria-hidden
                    className="editorial-mono text-[10px] text-[var(--muted-soft)] transition-colors group-hover:text-[var(--brand-teal)]"
                  >
                    →
                  </span>
                </Link>
              ))}
            </nav>
          </aside>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
