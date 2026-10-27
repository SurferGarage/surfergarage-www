import Image from "next/image";

import { SiteAnchorLink } from "@/components/site-anchor-link";
import { SG_PAGE_SHELL_CLASS } from "@/lib/sg-layout";
import { SITE_EVENTS, type SiteEvent } from "@/lib/site-events";

function EventAction({ event }: { event: SiteEvent }) {
  const className =
    "inline-flex min-h-11 w-fit items-center gap-3 font-[family-name:var(--font-zh)] text-[14px] font-medium text-[var(--brand-teal)] underline decoration-[var(--brand-teal)]/35 underline-offset-4 transition-colors hover:text-[var(--foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-teal)]/60";
  const content = (
    <>
      {event.linkLabel}
      <span aria-hidden>↗</span>
    </>
  );

  if (!event.external) {
    return (
      <SiteAnchorLink href={event.href} className={className}>
        {content}
      </SiteAnchorLink>
    );
  }

  return (
    <a
      href={event.href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      aria-label={`${event.title}：${event.linkLabel}`}
    >
      {content}
    </a>
  );
}

export function HomeEvents() {
  return (
    <section
      id="events"
      className="sg-ed-section scroll-mt-[4.5rem] border-b border-[var(--hairline)] bg-[var(--paper-0)]"
      aria-labelledby="events-heading"
    >
      <div className={SG_PAGE_SHELL_CLASS}>
        <header className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="sg-ed-kicker">COMMUNITY</p>
            <h2 id="events-heading" className="sg-ed-heading mt-3">
              活动与合作
            </h2>
          </div>
          <p className="font-[family-name:var(--font-zh)] text-[15px] leading-[1.75] text-[var(--muted-strong)] md:text-[16px]">
            浪前参与的线下活动与合作公告。
          </p>
        </header>

        <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {SITE_EVENTS.map((event) => (
            <article
              key={event.id}
              className="flex h-full flex-col overflow-hidden border border-[var(--hairline)] bg-[var(--paper-1)]"
              aria-labelledby={`${event.id}-heading`}
            >
              <div className="relative aspect-[4/3] border-b border-[var(--hairline)] bg-[#10141b]">
                <Image
                  src={event.imageSrc}
                  alt={event.imageAlt}
                  fill
                  sizes="(max-width: 768px) calc(100vw - 40px), (max-width: 1024px) 50vw, 33vw"
                  className="object-contain"
                />
              </div>

              <div className="flex flex-1 flex-col p-5 md:p-6">
                <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 text-[12px]">
                  <span className="text-[var(--muted)]">{event.role}</span>
                  <span className="border border-[var(--hairline)] px-2 py-1 text-[var(--muted-strong)]">
                    {event.statusLabel}
                  </span>
                </div>
                <p className="mt-5 font-[family-name:var(--font-en)] text-[12px] text-[var(--muted)]">
                  {event.titleEn}
                </p>
                <h3
                  id={`${event.id}-heading`}
                  className="mt-2 font-[family-name:var(--font-zh)] text-[1.3rem] font-medium leading-[1.45] text-[var(--foreground)]"
                >
                  {event.title}
                </h3>
                <p className="mt-3 font-[family-name:var(--font-zh)] text-[14px] leading-[1.8] text-[var(--muted-strong)]">
                  {event.description}
                </p>
                <dl className="mb-5 mt-5 grid grid-cols-[2rem_1fr] gap-x-3 gap-y-2 border-t border-[var(--hairline)] pt-4 text-[13px] leading-[1.65]">
                  <dt className="text-[var(--muted)]">时间</dt>
                  <dd className="text-[var(--muted-strong)]">{event.dateDisplay}</dd>
                  <dt className="text-[var(--muted)]">地点</dt>
                  <dd className="text-[var(--muted-strong)]">{event.location}</dd>
                </dl>
                <div className="mt-auto border-t border-[var(--hairline)] pt-2">
                  <EventAction event={event} />
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
