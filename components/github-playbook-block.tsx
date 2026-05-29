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
    <li className="group flex items-center gap-3 rounded-sm border border-[var(--hairline)] bg-[var(--paper-1)] px-3 py-2.5 transition-colors hover:border-[var(--hairline-strong)] hover:bg-[var(--paper-2)]">
      <span
        aria-hidden
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[color-mix(in_oklch,var(--brand-teal)_18%,var(--paper-3))] font-[family-name:var(--font-zh)] text-[12px] font-medium text-[var(--foreground)]"
      >
        {initials(c.displayName)}
      </span>
      <p className="truncate font-[family-name:var(--font-zh)] text-[14px] text-[var(--foreground)] md:text-[15px]">
        {c.displayName}
      </p>
    </li>
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
      <div className="grid grid-cols-1 gap-6 md:gap-8 lg:grid-cols-12">
        <div className="flex flex-col gap-4 lg:col-span-5">
          <GithubRepoCard config={config} className="!mt-0" />
          <a
            href={repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-full items-center justify-center rounded-sm border border-[var(--hairline-strong)] bg-[rgba(15,17,22,0.55)] px-4 py-3 font-[family-name:var(--font-zh)] text-[15px] text-[var(--foreground)] transition-colors hover:border-[var(--brand-teal)] hover:text-[var(--brand-teal)] md:text-[16px]"
          >
            打开 Playbook
          </a>
        </div>

        <div className="flex flex-col gap-8 lg:col-span-7 lg:gap-10">
          <div>
            <div className="flex items-end justify-between gap-3 border-b border-[var(--hairline)] pb-3">
              <p className="font-[family-name:var(--font-zh)] text-[15px] font-medium text-[var(--foreground)] md:text-[16px]">
                最近更新
              </p>
              <a
                href={`${repoUrl}/commits/main`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-[family-name:var(--font-zh)] text-[14px] text-[var(--muted-strong)] transition-colors hover:text-[var(--brand-teal)] md:text-[15px]"
              >
                全部 ↗
              </a>
            </div>
            <ul className="divide-y divide-[var(--hairline-soft)]">
              {GITHUB_PLAYBOOK_RECENT.map((r) => (
                <li
                  key={r.id}
                  className="flex flex-col gap-1 py-3.5 md:flex-row md:items-baseline md:gap-6 md:py-4"
                >
                  <p className="editorial-mono-tabular shrink-0 text-[13px] text-[var(--muted)] md:w-24">
                    {r.date}
                  </p>
                  <p className="line-clamp-2 flex-1 font-[family-name:var(--font-zh)] text-[14px] leading-snug text-[var(--muted-strong)] md:text-[15px]">
                    {r.summary}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="border-b border-[var(--hairline)] pb-3 font-[family-name:var(--font-zh)] text-[15px] font-medium text-[var(--foreground)] md:text-[16px]">
              贡献者
            </p>
            <ul className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-3">
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
