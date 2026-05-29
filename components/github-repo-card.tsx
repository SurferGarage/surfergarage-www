import type { GitHubRepoCardConfig } from "@/lib/github-repo-card";
import { githubRepoUrl } from "@/lib/github-repo-card";

type GithubRepoCardProps = {
  config: GitHubRepoCardConfig;
  className?: string;
};

function GitHubMark({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 16 16"
      width={18}
      height={18}
      aria-hidden
    >
      <path
        fill="currentColor"
        d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"
      />
    </svg>
  );
}

export function GithubRepoCard({ config, className = "" }: GithubRepoCardProps) {
  const { owner, repo, description, showTelemetry = false, telemetry } = config;
  const url = githubRepoUrl({ owner, repo });
  const fullName = `${owner} / ${repo}`;

  return (
    <div
      data-github-repo-card
      className={`group/github-card relative mt-10 overflow-hidden rounded-sm border border-[var(--hairline)] bg-[rgba(19,19,19,0.72)] shadow-[0_0_0_1px_rgba(255,255,255,0.02)] backdrop-blur-[2px] transition-[border-color,box-shadow] duration-200 hover:border-[var(--brand-teal)]/35 hover:shadow-[0_0_0_1px_rgba(39,215,199,0.06)] md:mt-12 ${className}`}
    >
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(165deg,rgba(39,215,199,0.04)_0%,transparent_42%,transparent_100%)] opacity-90" />

      <div className="relative border-b border-[var(--hairline)] px-4 py-3.5 md:px-5 md:py-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex min-w-0 flex-1 items-start gap-3">
            <span className="mt-0.5 shrink-0 text-[var(--muted)] transition-colors group-hover/github-card:text-[var(--brand-teal)]">
              <GitHubMark />
            </span>
            <div className="min-w-0">
              <p className="font-[family-name:var(--font-en)] text-[14px] font-semibold tracking-tight text-[var(--foreground)] md:text-[15px]">
                <span className="text-[var(--muted-strong)]">{owner}</span>
                <span className="mx-1 text-[var(--hairline)]">/</span>
                <span>{repo}</span>
              </p>
            </div>
          </div>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="pointer-events-auto shrink-0 rounded-sm border border-[var(--hairline)] px-3 py-1.5 font-[family-name:var(--font-zh)] text-[14px] text-[var(--muted-strong)] transition-colors hover:border-[var(--brand-teal)]/45 hover:text-[var(--brand-teal)]"
          >
            打开 ↗
          </a>
        </div>
      </div>

      <div className="relative px-4 py-4 md:px-5 md:py-5">
        <p className="font-[family-name:var(--font-zh)] text-[15px] leading-relaxed text-[var(--muted-strong)] md:text-[16px]">
          {description}
        </p>

        {showTelemetry && telemetry ? (
          <dl
            data-github-repo-telemetry
            className="mt-5 grid grid-cols-2 gap-3 border-t border-[var(--hairline)] pt-4 sm:grid-cols-4"
          >
            <div>
              <dt className="font-[family-name:var(--font-en)] text-[10px] uppercase tracking-[0.18em] text-[var(--muted)]">
                Stars
              </dt>
              <dd className="mt-1 font-[family-name:var(--font-en)] text-sm tabular-nums text-[var(--foreground)]">
                {telemetry.stars}
              </dd>
            </div>
            <div>
              <dt className="font-[family-name:var(--font-en)] text-[10px] uppercase tracking-[0.18em] text-[var(--muted)]">
                Forks
              </dt>
              <dd className="mt-1 font-[family-name:var(--font-en)] text-sm tabular-nums text-[var(--foreground)]">
                {telemetry.forks}
              </dd>
            </div>
            {typeof telemetry.watchers === "number" ? (
              <div>
                <dt className="font-[family-name:var(--font-en)] text-[10px] uppercase tracking-[0.18em] text-[var(--muted)]">
                  Watching
                </dt>
                <dd className="mt-1 font-[family-name:var(--font-en)] text-sm tabular-nums text-[var(--foreground)]">
                  {telemetry.watchers}
                </dd>
              </div>
            ) : null}
            {telemetry.pushedAtLabel ? (
              <div className="sm:col-span-1">
                <dt className="font-[family-name:var(--font-en)] text-[10px] uppercase tracking-[0.18em] text-[var(--muted)]">
                  Activity
                </dt>
                <dd className="mt-1 font-[family-name:var(--font-zh)] text-xs text-[var(--muted-strong)]">
                  {telemetry.pushedAtLabel}
                </dd>
              </div>
            ) : null}
          </dl>
        ) : (
          <span className="sr-only">
            Stars、Forks 等仓库统计将在接入数据源后显示。
          </span>
        )}
      </div>

      <span className="sr-only">GitHub 仓库 {fullName}</span>
    </div>
  );
}
