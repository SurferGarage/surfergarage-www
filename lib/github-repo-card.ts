/**
 * GitHub 仓库卡（Founder Media 内嵌或独立模块用）。
 * 仅在 `showTelemetry: true` 且传入 `telemetry` 时渲染 Stars/Forks/Watchers/Activity。
 *
 * Contributors / Recent commits 由 `GITHUB_PLAYBOOK_CONTRIBUTORS` / `GITHUB_PLAYBOOK_RECENT` 提供，
 * 当前为运营手填占位 — 接入 GitHub API 后只需替换数据源不必改组件。
 */

export type GitHubRepoTelemetry = {
  stars: number | string;
  forks: number | string;
  watchers?: number | string;
  pushedAtLabel?: string;
};

export type GitHubRepoCardConfig = {
  owner: string;
  repo: string;
  description: string;
  showTelemetry?: boolean;
  telemetry?: GitHubRepoTelemetry;
};

export function githubRepoUrl(opts: Pick<GitHubRepoCardConfig, "owner" | "repo">): string {
  return `https://github.com/${opts.owner}/${opts.repo}`;
}

/* ------------------------------------------------------------------
 * Playbook 共建快照（运营手填，预留接口）
 * ------------------------------------------------------------------ */

export type PlaybookContributor = {
  id: string;
  /** GitHub 用户名 */
  handle: string;
  /** 显示用 fallback 姓名（中文或英文皆可） */
  displayName: string;
  /** 头像 URL；留空则用 initial 占位 */
  avatarUrl?: string;
  /** 共建角色 */
  role: string;
};

export type PlaybookCommit = {
  id: string;
  date: string;
  summary: string;
  /** PR / Commit / Issue */
  kind: "pr" | "commit" | "issue";
  authorHandle: string;
};

export const GITHUB_PLAYBOOK_CONTRIBUTORS: PlaybookContributor[] = [
  {
    id: "kaiser",
    handle: "kaiser",
    displayName: "凯撒",
    role: "Editor",
  },
  {
    id: "small-lang",
    handle: "small-lang",
    displayName: "小浪",
    role: "Community",
  },
  {
    id: "huoer",
    handle: "huoer",
    displayName: "霍尔",
    role: "Engineering",
  },
];

export const GITHUB_PLAYBOOK_RECENT: PlaybookCommit[] = [
  {
    id: "c-001",
    date: "2026.05.22",
    summary: "新增章节《非共识与可核对的样本》初稿",
    kind: "pr",
    authorHandle: "kaiser",
  },
  {
    id: "c-002",
    date: "2026.05.18",
    summary: "Tools · 重写 Surfing Founders 选题问卷",
    kind: "commit",
    authorHandle: "small-lang",
  },
  {
    id: "c-003",
    date: "2026.05.12",
    summary: "提案：Season 02 嘉宾甄选框架",
    kind: "issue",
    authorHandle: "huoer",
  },
];
