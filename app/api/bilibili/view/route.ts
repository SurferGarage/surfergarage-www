import { normalizeBvid, type BilibiliVideoMeta } from "@/lib/bilibili-player";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

const EMPTY: BilibiliVideoMeta = {};

/** 服务端代理 B 站 `view` 接口，避免浏览器 CORS / Referer 限制 */
export async function GET(request: Request) {
  const bvid = new URL(request.url).searchParams.get("bvid") ?? "";
  const id = normalizeBvid(bvid);
  if (!id) {
    return NextResponse.json(EMPTY, { status: 400 });
  }

  try {
    const res = await fetch(
      `https://api.bilibili.com/x/web-interface/view?bvid=${encodeURIComponent(id)}`,
      {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
          Referer: `https://www.bilibili.com/video/${id}`,
        },
        next: { revalidate: 3600 },
      },
    );

    if (!res.ok) {
      return NextResponse.json(EMPTY, { status: 502 });
    }

    const json = (await res.json()) as {
      code?: number;
      data?: {
        aid?: number;
        cid?: number;
        title?: string;
        pic?: string;
        pages?: { cid?: number }[];
      };
    };

    if (json.code !== 0 || !json.data) {
      return NextResponse.json(EMPTY, { status: 404 });
    }

    const meta: BilibiliVideoMeta = {
      aid: json.data.aid,
      cid: json.data.cid ?? json.data.pages?.[0]?.cid,
      title: json.data.title,
      pic: json.data.pic?.replace(/^http:/, "https:"),
    };

    return NextResponse.json(meta, {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  } catch {
    return NextResponse.json(EMPTY, { status: 502 });
  }
}
