/** 首页「仓库卡片」静态配置；实时 Stars/Forks 等接 API 后把 `showTelemetry` 打开并填入 `telemetry`。 */

export type GitHubRepoTelemetry = {
  stars: number;
  forks: number;
  watchers?: number;
  /** ISO 日期或展示用短文案 */
  pushedAtLabel?: string;
};

export type GitHubRepoCardConfig = {
  owner: string;
  repo: string;
  /** 一句话简介（可与 GitHub About 或 README 首段对齐） */
  description: string;
  /** 未接数据源时为 `false`，整块指标区不占视觉 */
  showTelemetry?: boolean;
  telemetry?: GitHubRepoTelemetry;
};

export function githubRepoUrl(c: Pick<GitHubRepoCardConfig, "owner" | "repo">): string {
  return `https://github.com/${c.owner}/${c.repo}`;
}
