import { resolveRecruitSource } from "@/lib/recruit-source";

const FEISHU_BASE = "https://open.feishu.cn/open-apis";

function isConfigured(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

async function feishuTenantToken(appId: string, appSecret: string): Promise<string> {
  const res = await fetch(`${FEISHU_BASE}/auth/v3/tenant_access_token/internal`, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({ app_id: appId, app_secret: appSecret }),
    cache: "no-store",
  });
  const data = (await res.json()) as {
    code: number;
    tenant_access_token?: string;
    msg?: string;
  };
  if (data.code !== 0 || !data.tenant_access_token) {
    throw new Error(data.msg ?? `Feishu token error (code=${data.code})`);
  }
  return data.tenant_access_token;
}

export async function POST(request: Request) {
  let payload: Record<string, unknown>;
  try {
    payload = (await request.json()) as Record<string, unknown>;
  } catch {
    return json({ ok: false, code: "bad_request", message: "提交内容无法解析" }, 400);
  }

  const name = String(payload.name ?? "").trim();
  const role = String(payload.role ?? "").trim();
  const intro = String(payload.intro ?? "").trim();
  const wechat = String(payload.wechat ?? "").trim();
  const phone = String(payload.phone ?? "").trim();
  const email = String(payload.email ?? "").trim();
  const link = String(payload.link ?? "").trim();

  if (!name || !role || !intro || !wechat) {
    return json(
      { ok: false, code: "missing_fields", message: "请至少填写姓名、意向岗位、自我介绍和微信号" },
      400,
    );
  }

  // 渠道归因：以 `?src=` + 内推码 `?ref=` 为准；上游若已传中文标签则直接复用。
  const rawLabel = payload.source ? String(payload.source) : null;
  const resolved = resolveRecruitSource(
    payload.sourceCode ? String(payload.sourceCode) : null,
    payload.refCode ? String(payload.refCode) : null,
  );
  const sourceLabel = rawLabel && rawLabel !== "官网" ? rawLabel : resolved.label;
  const sourceDisplay = resolved.refCode
    ? `${sourceLabel} · ${resolved.refCode}`
    : sourceLabel;

  const appId = process.env.FEISHU_APP_ID;
  const appSecret = process.env.FEISHU_APP_SECRET;
  const appToken = process.env.FEISHU_APP_TOKEN;
  const tableId = process.env.FEISHU_TABLE_ID;

  if (!isConfigured(appId) || !isConfigured(appSecret) || !isConfigured(appToken) || !isConfigured(tableId)) {
    return json({ ok: false, code: "not_configured", message: "在线投递暂未配置" }, 200);
  }

  try {
    const token = await feishuTenantToken(appId!, appSecret!);
    const fields: Record<string, unknown> = {
      姓名: name,
      微信: wechat,
      手机号: phone,
      邮箱: email,
      意向岗位: role,
      自我介绍: intro,
      简历链接: link,
      来源: sourceDisplay,
      渠道代码: resolved.code,
      归因码: resolved.refCode ?? "",
      落地页: "/join",
      投递时间: new Date().toLocaleString("zh-CN", { timeZone: "Asia/Shanghai" }),
    };
    const res = await fetch(`${FEISHU_BASE}/bitable/v1/apps/${appToken}/tables/${tableId}/records`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify({ fields }),
      cache: "no-store",
    });
    const data = (await res.json()) as { code: number; msg?: string };
    if (data.code !== 0) {
      return json({ ok: false, code: "feishu_error", message: data.msg ?? "写入失败" }, 502);
    }
    return json({ ok: true }, 200);
  } catch (error) {
    const message = error instanceof Error ? error.message : "提交失败";
    return json({ ok: false, code: "error", message }, 500);
  }
}

function json(body: unknown, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
}