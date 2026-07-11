import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { MAIL_HELLO } from "@/lib/site-contact";
import { buildSiteMetadata } from "@/lib/site-metadata";
import { SG_PAGE_SHELL_CLASS } from "@/lib/sg-layout";
import { getSiteStats } from "@/lib/site-stats";
import type { Metadata } from "next";

export const metadata: Metadata = {
  ...buildSiteMetadata(),
  title: "隐私政策 · 浪前 Surfer Garage",
  description: "Surfer Garage 官网隐私政策与数据处理方式。",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  const stats = getSiteStats();

  return (
    <div className="relative isolate flex min-h-full min-w-0 flex-col bg-[var(--paper-1)]">
      <SiteHeader articles={stats.articles} episodes={stats.episodes} />
      <main className={`relative z-[3] flex-1 py-16 md:py-24 ${SG_PAGE_SHELL_CLASS}`}>
        <article className="mx-auto max-w-[48rem]">
          <h1 className="editorial-serif text-[clamp(2rem,4vw,2.75rem)] leading-[1.06] text-[var(--foreground)]">
            隐私政策
          </h1>
          <p className="mt-3 font-[family-name:var(--font-zh)] text-[15px] text-[var(--muted)] md:text-[16px]">
            最后更新：2026 年 5 月
          </p>

          <div className="mt-12 flex flex-col gap-10 font-[family-name:var(--font-zh)] text-[16px] leading-[1.75] text-[var(--muted-strong)] md:text-[17px]">
            <section>
              <h2 className="font-[family-name:var(--font-zh)] text-[17px] font-medium text-[var(--foreground)] md:text-[18px]">
                我们收集什么
              </h2>
              <p className="mt-3">
                本站为静态展示站点。除你主动通过邮件、Discord
                或微信联系我们外，我们不运营账号体系，也不默认收集个人身份信息。
              </p>
            </section>

            <section>
              <h2 className="font-[family-name:var(--font-zh)] text-[17px] font-medium text-[var(--foreground)] md:text-[18px]">
                订阅
              </h2>
              <p className="mt-3">
                页脚订阅通过你的邮件客户端向{" "}
                <a
                  href={`mailto:${MAIL_HELLO}`}
                  className="text-[var(--brand-teal)] underline-offset-4 hover:underline"
                >
                  {MAIL_HELLO}
                </a>{" "}
                发送请求。我们不会在此页面存储你的邮箱；是否订阅由你在邮件客户端中确认发送。
              </p>
            </section>

            <section>
              <h2 className="font-[family-name:var(--font-zh)] text-[17px] font-medium text-[var(--foreground)] md:text-[18px]">
                分析与 Cookie
              </h2>
              <p className="mt-3">
                当前版本未接入第三方统计脚本。若未来启用分析工具，将在此页更新说明，并在必要时提供退出方式。
              </p>
            </section>

            <section>
              <h2 className="font-[family-name:var(--font-zh)] text-[17px] font-medium text-[var(--foreground)] md:text-[18px]">
                外链与嵌入
              </h2>
              <p className="mt-3">
                站点包含 B 站、GitHub、微信公众号等第三方链接或嵌入。访问这些服务时，适用各平台自身的隐私政策。
              </p>
            </section>

            <section>
              <h2 className="font-[family-name:var(--font-zh)] text-[17px] font-medium text-[var(--foreground)] md:text-[18px]">
                联系我们
              </h2>
              <p className="mt-3">
                对隐私有疑问，请写信至{" "}
                <a
                  href={`mailto:${MAIL_HELLO}`}
                  className="text-[var(--brand-teal)] underline-offset-4 hover:underline"
                >
                  {MAIL_HELLO}
                </a>
                。
              </p>
            </section>
          </div>
        </article>
      </main>
      <SiteFooter />
    </div>
  );
}
