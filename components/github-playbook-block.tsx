import { GithubRepoCard } from "@/components/github-repo-card";
import {
  GITHUB_PLAYBOOK_CONTRIBUTORS,
  GITHUB_PLAYBOOK_RECENT,
  githubRepoUrl,
  type GitHubRepoCardConfig,
  type PlaybookContributor,
} from "@/lib/github-repo-card";

function initials(name: string): string {
  const trimmed = name.trim();
  if (!trimmed) return "·";
  const chars = Array.from(trimmed);
  return chars.slice(0, Math.min(2, chars.length)).join("");
}

function ContributorChip({ c }: { c: PlaybookContributor }) {
  return (
    <li className="group flex items-center gap-2.5 rounded-sm border border-[var(--hairline)] bg-[var(--paper-1)] px-3 py-2 transition-colors hover:border-[var(--hairline-strong)] hover:bg-[var(--paper-2)]">
      <span
        aria-hidden
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[color-mix(in_oklch,var(--brand-teal)_18%,var(--paper-3))] font-[family-name:var(--font-zh)] text-[11px] font-medium text-[var(--foreground)]"
      >
        {initials(c.displayName)}
      </span>
      <div className="min-w-0 leading-tight">
        <p className="truncate font-[family-name:var(--font-zh)] text-[12.5px] text-[var(--foreground)]">
          {c.displayName}
        </p>
        <p className="mt-0.5 truncate editorial-mono text-[9.5px] uppercase tracking-[0.14em] text-[var(--muted)]">
          {c.role}
        </p>
      </div>
    </li>
  );
}

function KindBadge({ kind }: { kind: "pr" | "commit" | "issue" }) {
  const label = kind === "pr" ? "PR" : kind === "commit" ? "COMMIT" : "ISSUE";
  const color =
    kind === "pr"
      ? "text-[var(--brand-teal)]"
      : kind === "issue"
        ? "text-[var(--accent-amber)]"
        : "text-[var(--muted-strong)]";
  return (
    <span
      className={`editorial-mono text-[9.5px] uppercase tracking-[0.18em] ${color}`}
    >
      {label}
    </span>
  );
}

export function GithubPlaybookBlock({
  config,
}: {
  config: GitHubRepoCardConfig;
}) {
  const repoUrl = githubRepoUrl(config);

  return (
    <div className="w-full" data-github-playbook>
      <div className="grid grid-cols-1 gap-4 md:gap-5 lg:grid-cols-12">
        {/* 左：Stats + 仓库卡 */}
        <div className="flex flex-col gap-3 lg:col-span-5 lg:gap-4">
          {/* 紧凑 stats */}
          <div className="grid grid-cols-3 gap-2 md:gap-3">
            {[
              { label: "STARS", value: "—" },
              { label: "FORKS", value: "—" },
              { label: "ACTIVE", value: "5" },
            ].map((s) => (
              <div
                key={s.label}
                className="rounded-sm border border-[var(--hairline)] bg-[var(--paper-1)] px-3 py-2.5 md:px-4 md:py-3"
              >
                <p className="editorial-eyebrow text-[var(--muted)]">{s.label}</p>
                <p className="mt-1 editorial-serif text-[clamp(1.4rem,3.2vw,1.85rem)] leading-none text-[var(--foreground)]">
                  {s.value}
                </p>
              </div>
            ))}
          </div>
          <GithubRepoCard config={config} className="!mt-0" />
          <a
            href={repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-full items-center justify-between gap-2 rounded-sm border border-[var(--hairline-strong)] bg-[rgba(15,17,22,0.55)] px-4 py-2.5 editorial-mono text-[10.5px] uppercase tracking-[0.16em] text-[var(--foreground)] transition-colors hover:border-[var(--brand-teal)] hover:text-[var(--brand-teal)]"
          >
            打开 Playbook ↗
            <span aria-hidden>↗</span>
          </a>
        </div>

        {/* 右：Recent activity + Contributors */}
        <div className="flex flex-col gap-4 lg:col-span-7 lg:gap-5">
          <div>
            <div className="flex items-end justify-between gap-3 border-b border-[var(--hairline)] pb-2.5">
              <p className="editorial-eyebrow text-[var(--foreground)]">
                Recent activity
              </p>
              <a
                href={`${repoUrl}/commits/main`}
                target="_blank"
                rel="noopener noreferrer"
                className="editorial-mono text-[10px] uppercase tracking-[0.18em] text-[var(--muted-strong)] transition-colors hover:text-[var(--brand-teal)]"
              >
                All ↗
              </a>
            </div>
            <ul className="divide-y divide-[var(--hairline-soft)]">
              {GITHUB_PLAYBOOK_RECENT.map((r) => (
                <li
                  key={r.id}
                  className="flex flex-col gap-1 py-2.5 md:flex-row md:items-baseline md:gap-4 md:py-3"
                >
                  <p className="editorial-mono-tabular text-[10.5px] uppercase tracking-[0.1em] text-[var(--muted)] md:w-20 md:shrink-0">
                    {r.date}
                  </p>
                  <p className="md:w-14 md:shrink-0">
                    <KindBadge kind={r.kind} />
                  </p>
                  <p className="line-clamp-1 flex-1 font-[family-name:var(--font-zh)] text-[12.5px] leading-snug text-[var(--muted-strong)] md:text-[13.5px]">
                    {r.summary}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="flex items-end justify-between gap-3 border-b border-[var(--hairline)] pb-2.5">
              <p className="editorial-eyebrow text-[var(--foreground)]">
                Contributors
              </p>
              <p className="editorial-mono text-[10px] uppercase tracking-[0.18em] text-[var(--muted)]">
                持续招募
              </p>
            </div>
            <ul className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3">
              {GITHUB_PLAYBOOK_CONTRIBUTORS.map((c) => (
                <ContributorChip key={c.id} c={c} />
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
