import { createHash } from "node:crypto";
import { NextResponse } from "next/server";
import { createInquiryClient } from "@/lib/supabase/inquiry-admin";
import { validateInquiry } from "@/lib/inquiries/validation";

export const runtime = "nodejs";

const json = (message: string, status: number) => NextResponse.json({ error: message }, { status });

async function verifyTurnstile(token: string, ip: string) {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return process.env.NODE_ENV !== "production";
  if (!token) return false;
  try {
    const body = new URLSearchParams({ secret, response: token, remoteip: ip });
    const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", { method: "POST", body, cache: "no-store", signal: AbortSignal.timeout(5000) });
    const result = await response.json() as { success?: boolean };
    return response.ok && result.success === true;
  } catch { return false; }
}

async function consumeRateLimit(ip: string) {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return process.env.NODE_ENV !== "production";
  const identity = createHash("sha256").update(ip).digest("hex");
  const script = "local n=redis.call('INCR',KEYS[1]); if n==1 then redis.call('EXPIRE',KEYS[1],ARGV[1]); end; return n";
  try {
    const response = await fetch(url, { method: "POST", headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }, body: JSON.stringify(["EVAL", script, "1", `sawiri:inquiry:${identity}`, "3600"]), cache: "no-store", signal: AbortSignal.timeout(5000) });
    if (!response.ok) return false;
    const result = await response.json() as { result?: number };
    return typeof result.result === "number" && result.result <= 5;
  } catch { return false; }
}

export async function POST(request: Request) {
  const contentType = request.headers.get("content-type") || "";
  if (!contentType.toLowerCase().includes("application/json")) return json("Submit the project brief using the inquiry form.", 415);
  const declaredLength = Number(request.headers.get("content-length") || 0);
  if (declaredLength > 20000) return json("The submitted project brief is too large.", 413);
  let body: unknown;
  try {
    const raw = await request.text();
    if (raw.length > 20000) return json("The submitted project brief is too large.", 413);
    body = JSON.parse(raw) as unknown;
  } catch { return json("The submitted project brief could not be read.", 400); }
  const parsed = validateInquiry(body);
  if (parsed.honeypot) return json("We could not accept this submission. Please review the form and try again.", 400);
  if (parsed.error || !parsed.value) return json(parsed.error || "Please review the required fields.", 400);
  if (!parsed.acknowledgement) return json("Please confirm the project details before sending.", 400);
  if ((parsed.elapsedMs ?? 0) < 1800) return json("Please take a moment to review your project brief before sending.", 400);

  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const ip = request.headers.get("x-real-ip") || forwarded || "unknown";
  const configured = Boolean(process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && process.env.TURNSTILE_SECRET_KEY && process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN);
  if (process.env.NODE_ENV === "production" && !configured) return json("Inquiry submission is temporarily unavailable. Your details have not been sent.", 503);
  if (!(await consumeRateLimit(ip))) return json("The inquiry limit has been reached or the submission service is unavailable. Please try again later.", 429);
  if (!(await verifyTurnstile(parsed.token || "", ip))) return json("The submission check could not be verified. Please try again.", 400);

  const client = createInquiryClient();
  if (!client) return json("Inquiry storage is not configured. Your details have not been sent.", 503);
  const { error } = await client.from("inquiries").insert(parsed.value);
  if (error) return json("We could not save your inquiry. Your details have not been sent; please try again later.", 503);
  return NextResponse.json({ ok: true }, { status: 201 });
}
