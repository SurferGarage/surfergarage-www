"use client";

import { useAnchorNav } from "@/lib/use-anchor-nav";
import type { ComponentProps } from "react";

type Props = ComponentProps<"a"> & {
  href: string;
};

/** 页内锚点链接 — 统一 immediate scroll（Footer / Social 等复用） */
export function SiteAnchorLink({
  href,
  onClick,
  children,
  ...rest
}: Props) {
  const navigate = useAnchorNav();

  return (
    <a
      href={href}
      onClick={(e) => {
        if (href.startsWith("#")) navigate(e, href);
        onClick?.(e);
      }}
      {...rest}
    >
      {children}
    </a>
  );
}
