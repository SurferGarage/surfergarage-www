import type { NextConfig } from "next";
import path from "node:path";
import { fileURLToPath } from "node:url";

/** 显式锁定本包为 Turbopack root（绝对路径），避免上级目录另有 lockfile 时被误判 workspace root */
const turbopackRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)));

const nextConfig: NextConfig = {
  turbopack: {
    root: turbopackRoot,
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**.hdslb.com" },
      { protocol: "https", hostname: "**.bilivideo.com" },
    ],
  },
};

export default nextConfig;
