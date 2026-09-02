import { permanentRedirect } from "next/navigation";

/** 旧入口 `/recruit` 已迁移至 `/join`，做永久跳转保链接可用。 */
export default function RecruitPage() {
  permanentRedirect("/join");
}