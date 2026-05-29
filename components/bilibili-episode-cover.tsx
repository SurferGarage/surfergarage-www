"use client";

import { fetchBilibiliVideoMeta } from "@/lib/bilibili-player";
import Image from "next/image";
import { useEffect, useState } from "react";

type BilibiliEpisodeCoverProps = {
  bvid: string;
  alt: string;
  /** 本地 `/video-covers/…` 或 B 站 pic URL */
  coverSrc?: string;
  className?: string;
  priority?: boolean;
};

function isLocalCover(src: string): boolean {
  return src.startsWith("/");
}

/** 稿件封面：本地图同步渲染；外链仅作 API 回退 */
export function BilibiliEpisodeCover({
  bvid,
  alt,
  coverSrc,
  className = "",
  priority = false,
}: BilibiliEpisodeCoverProps) {
  const localSrc =
    coverSrc && isLocalCover(coverSrc) ? coverSrc : null;
  const [remotePic, setRemotePic] = useState<string | null>(
    coverSrc && !isLocalCover(coverSrc) ? coverSrc : null,
  );

  useEffect(() => {
    if (localSrc || (coverSrc && isLocalCover(coverSrc))) return;

    let cancelled = false;
    void fetchBilibiliVideoMeta(bvid).then((meta) => {
      if (!cancelled && meta.pic) setRemotePic(meta.pic);
    });
    return () => {
      cancelled = true;
    };
  }, [bvid, coverSrc, localSrc]);

  const pic = localSrc ?? remotePic;

  return (
    <div
      className={`relative overflow-hidden bg-[linear-gradient(145deg,rgba(0,9,226,0.22)_0%,rgba(6,6,68,0.55)_48%,rgba(19,19,19,0.9)_100%)] ${className}`}
    >
      {pic ? (
        <Image
          src={pic}
          alt={alt}
          fill
          priority={priority || Boolean(localSrc)}
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 33vw"
          unoptimized={!localSrc}
        />
      ) : null}
      <div
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,transparent_42%,rgba(5,5,12,0.88)_100%)]"
        aria-hidden
      />
    </div>
  );
}
