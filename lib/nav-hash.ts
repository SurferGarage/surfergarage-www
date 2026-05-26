/** 首页区块 hash → Next.js 可路由链接（`/#founders`） */
export function homeSectionHref(hash: string): string {
  const id = hash.startsWith("#") ? hash : `#${hash}`;
  return `/${id}`;
}
