import Link from "next/link";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { homeSectionHref } from "@/lib/nav-hash";
import { SITE_PRIMARY_NAV } from "@/lib/site-nav";
import { SG_PAGE_SHELL_CLASS } from "@/lib/sg-layout";
import { getSiteStats } from "@/lib/site-stats";

export default function NotFound() {
  const stats = getSiteStats();

  return (
    <div className="flex min-h-[100svh] flex-col bg-[var(--paper-1)]">
      <SiteHeader articles={stats.articles} episodes={stats.episodes} />
      <main
        className={`relative flex flex-1 flex-col justify-center py-20 md:py-28 ${SG_PAGE_SHELL_CLASS}`}
      >
        <div className="max-w-[40rem]">
          <h1 className="editorial-serif text-[clamp(2.5rem,7vw,4.5rem)] leading-[1.02] text-[var(--foreground)]">
            这一页还在海里
          </h1>
          <p className="mt-6 font-[family-name:var(--font-zh)] text-[16px] leading-[1.75] text-[var(--muted-strong)] md:text-[17px]">
            链接可能失效，或尚未上线。你可以回到首页继续浏览。
          </p>
          <Link
            href="/"
            className="mt-10 inline-flex items-center gap-2 rounded-sm border border-[var(--brand-teal)]/55 bg-[color-mix(in_oklch,var(--brand-teal)_14%,transparent)] px-5 py-3 font-[family-name:var(--font-zh)] text-[15px] text-[var(--foreground)] transition-[background-color,border-color] hover:border-[var(--brand-teal)] hover:bg-[color-mix(in_oklch,var(--brand-teal)_22%,transparent)]"
          >
            返回首页
            <span aria-hidden className="text-[var(--brand-teal)]">↗</span>
          </Link>
        </div>

        <nav
          className="mt-16 max-w-[20rem] border-t border-[var(--hairline)] pt-6"
          aria-label="站点导航"
        >
          <ul className="flex flex-col gap-3">
            {SITE_PRIMARY_NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={homeSectionHref(item.href)}
                  className="font-[family-name:var(--font-zh)] text-[15px] text-[var(--muted-strong)] transition-colors hover:text-[var(--foreground)] md:text-[16px]"
                >
                  {item.labelZh}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </main>
      <SiteFooter />
    </div>
  );
}
