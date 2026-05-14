import type { GitHubRepoCardConfig } from "@/lib/github-repo-card";

/** GitHub 仓库板块：`GithubRepoCard` 数据源（遥测接入后设 `showTelemetry` + `telemetry`）。 */
export const FOUNDER_MEDIA_GITHUB_REPO: GitHubRepoCardConfig = {
  owner: "SurferGarage",
  repo: "Startup-playbook",
  description:
    "浪前开源创业指南：面向 AI 时代的超级个体与愿景增长手册，含核心认知、工具箱与悬赏贡献机制。",
  showTelemetry: false,
};

export const FOUNDER_MEDIA_GITHUB_PAGE_URL =
  "https://github.com/SurferGarage/Startup-playbook";
