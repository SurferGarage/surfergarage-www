import { redirect } from "next/navigation";

/** 小红书短链，和裸 `/join` 同一渠道。 */
export default function XiaohongshuJoinRedirect() {
  redirect("/join");
}
