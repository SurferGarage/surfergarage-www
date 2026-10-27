"use client";

import { useAnchorNav } from "@/lib/use-anchor-nav";
import Link from "next/link";
import type { ComponentProps } from "react";

type Props = ComponentProps<"a"> & {
  href: string;
};

/** 同页锚点统一偏移滚动，跨页链接保留首页路径与 Next 路由。 */
export function SiteAnchorLink({
  href,
  onClick,
  children,
  ...rest
}: Props) {
  const navigate = useAnchorNav();
  const handleClick: NonNullable<Props["onClick"]> = (event) => {
    onClick?.(event);
    if (!event.defaultPrevented) navigate(event, href);
  };

  if (href.startsWith("/") && !href.startsWith("//")) {
    return (
      <Link
        href={href}
        scroll={!href.includes("#")}
        onClick={handleClick}
        {...rest}
      >
        {children}
      </Link>
    );
  }

  return (
    <a
      href={href}
      onClick={handleClick}
      {...rest}
    >
      {children}
    </a>
  );
}
