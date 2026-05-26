/** 去掉微信文章链里的 session / click 追踪参数，保留可长期访问的 id */
export function cleanWechatArticleUrl(raw: string): string {
  try {
    const url = new URL(raw);
    if (!url.hostname.includes("mp.weixin.qq.com")) return raw;

    if (url.pathname.startsWith("/s/") && url.pathname.length > 3) {
      return `${url.origin}${url.pathname}`;
    }

    const keep = new Set(["__biz", "mid", "idx", "sn"]);
    for (const key of [...url.searchParams.keys()]) {
      if (!keep.has(key)) url.searchParams.delete(key);
    }
    url.hash = "";
    return url.toString();
  } catch {
    return raw;
  }
}
