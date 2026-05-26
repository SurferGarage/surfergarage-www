"use client";

import { fetchBilibiliVideoMeta } from "@/lib/bilibili-player";
import Image from "next/image";
import { useEffect, useState } from "react";

type BilibiliEpisodeCoverProps = {
  bvid: string;
  alt: string;
  className?: string;
};

/** B 站公开 API 封面（失败时渐变占位，不阻塞播放器） */
export function BilibiliEpisodeCover({
  bvid,
  alt,
  className = "",
}: BilibiliEpisodeCoverProps) {
  const [pic, setPic] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    void fetchBilibiliVideoMeta(bvid).then((meta) => {
      if (!cancelled && meta.pic) setPic(meta.pic);
    });
    return () => {
      cancelled = true;
    };
  }, [bvid]);

  return (
    <div
      className={`relative overflow-hidden bg-[linear-gradient(145deg,rgba(0,9,226,0.22)_0%,rgba(6,6,68,0.55)_48%,rgba(19,19,19,0.9)_100%)] ${className}`}
    >
      {pic ? (
        <Image
          src={pic}
          alt={alt}
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 280px"
          unoptimized
        />
      ) : null}
      <div
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,transparent_42%,rgba(5,5,12,0.88)_100%)]"
        aria-hidden
      />
    </div>
  );
}
