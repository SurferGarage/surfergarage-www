"use client";

import Image from "next/image";
import { useCallback, useState } from "react";

function initials(name: string): string {
  const trimmed = name.trim();
  if (!trimmed) return "·";
  return Array.from(trimmed).slice(0, 2).join("");
}

type TeamMemberPortraitProps = {
  nameZh: string;
  portraitSrc?: string;
  className?: string;
};

/** 成员人像 — 有图则显示，否则 editorial 字标占位 */
export function TeamMemberPortrait({
  nameZh,
  portraitSrc,
  className = "",
}: TeamMemberPortraitProps) {
  const [broken, setBroken] = useState(false);
  const onError = useCallback(() => setBroken(true), []);
  const showImage = Boolean(portraitSrc) && !broken;

  return (
    <div
      className={`relative aspect-square w-full overflow-hidden rounded-sm bg-[var(--paper-2)] ${className}`}
    >
      {showImage ? (
        <Image
          src={portraitSrc!}
          alt=""
          fill
          sizes="(max-width: 768px) 72vw, 22rem"
          className="object-contain object-center saturate-[0.96] contrast-[1.02]"
          onError={onError}
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-[radial-gradient(70%_60%_at_50%_35%,rgba(39,215,199,0.14),transparent_70%),linear-gradient(180deg,var(--paper-2),var(--paper-3))]">
          <span className="editorial-serif text-[clamp(2.5rem,6vw,3.5rem)] leading-none text-[color-mix(in_oklch,var(--foreground)_72%,transparent)]">
            {initials(nameZh)}
          </span>
        </div>
      )}
    </div>
  );
}
