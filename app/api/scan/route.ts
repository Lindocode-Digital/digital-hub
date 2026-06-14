import { NextRequest, NextResponse } from "next/server";

const UPSTREAM =
  process.env.SCAN_API_URL ??
  "https://api.lindocode.com/api/lazy-appz/scan";

export async function POST(request: NextRequest) {
  let body: { url?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  // ── Try the VM API first ──────────────────────────────────────────────────
  try {
    const upstream = await fetch(UPSTREAM, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(15000),
    });

    const data = await upstream.json();
    // Only use the upstream result if it looks like a real scan response
    if (upstream.ok && typeof data.score === "number") {
      return NextResponse.json(data);
    }
  } catch {
    // Upstream not reachable — fall through to local fallback below
  }

  // ── Local fallback (dev): use /api/validate + map to scan shape ───────────
  // Gives Phase 1 + 2 locally without needing the VM deployed.
  const url = body.url;
  if (!url) {
    return NextResponse.json({ error: "url is required" }, { status: 400 });
  }

  const normalized = /^https?:\/\//i.test(url) ? url : `https://${url}`;

  let v: Record<string, unknown> = {};
  try {
    const res = await fetch(
      `${request.nextUrl.origin}/digitalhub/api/validate?url=${encodeURIComponent(normalized)}`,
    );
    v = await res.json();
  } catch {
    return NextResponse.json({ error: "Scan failed" }, { status: 502 });
  }

  const isHttps = normalized.startsWith("https://");
  const redirectChain: string[] = Array.isArray(v.redirectChain)
    ? (v.redirectChain as string[])
    : [normalized];
  const redirectCount = redirectChain.length - 1;

  let hasCrossDomain = false;
  if (redirectChain.length > 1) {
    try {
      const first = new URL(redirectChain[0]).hostname.replace(/^www\./, "");
      const last = new URL(redirectChain[redirectChain.length - 1]).hostname.replace(/^www\./, "");
      hasCrossDomain = first !== last;
    } catch { /* ignore */ }
  }

  const signals: {
    id: string;
    label: string;
    status: "pass" | "fail" | "warn" | "info" | "skip";
    detail: string;
    points: number;
  }[] = [];
  let score = 0;

  // HTTPS
  if (isHttps) {
    score += 20;
    signals.push({ id: "https", label: "HTTPS Encryption", status: "pass", detail: "Connection uses TLS/SSL encryption", points: 20 });
  } else {
    signals.push({ id: "https", label: "No HTTPS", status: "fail", detail: "Connection is unencrypted — data can be intercepted in transit", points: 0 });
  }

  // Reachability
  if (v.isWorking) {
    score += 15;
    signals.push({ id: "reachable", label: "Site Reachable", status: "pass", detail: `Server responded with HTTP ${v.statusCode}`, points: 15 });
  } else {
    signals.push({ id: "reachable", label: "Site Unreachable", status: "fail", detail: typeof v.error === "string" ? v.error : "No response from server", points: 0 });
  }

  // HTTP 200
  if (v.statusCode === 200) {
    score += 5;
    signals.push({ id: "http_200", label: "HTTP 200 OK", status: "pass", detail: "Server returned a clean 200 OK response", points: 5 });
  }

  // Redirects
  if (redirectCount === 0) {
    score += 5;
    signals.push({ id: "redirects", label: "No Redirects", status: "pass", detail: "URL resolves directly without any redirects", points: 5 });
  } else if (!hasCrossDomain && redirectCount <= 2) {
    score += 3;
    signals.push({ id: "redirects", label: `${redirectCount} Same-Domain Redirect${redirectCount > 1 ? "s" : ""}`, status: "pass", detail: "Normal redirect (e.g. www or trailing-slash normalisation)", points: 3 });
  } else if (hasCrossDomain) {
    signals.push({ id: "redirects", label: "Cross-Domain Redirect", status: "warn", detail: `Redirected to a different domain — final destination: ${redirectChain[redirectChain.length - 1]}`, points: 0 });
  } else {
    signals.push({ id: "redirects", label: `${redirectCount} Redirects`, status: "warn", detail: "Excessive redirect chain", points: 0 });
  }

  // TLS + headers — only available on the full VM backend
  signals.push({ id: "tls", label: "TLS Check", status: "skip", detail: "Full TLS check available after backend deploy", points: 0 });
  signals.push({ id: "hsts", label: "HSTS", status: "skip", detail: "Header checks available after backend deploy", points: 0 });

  const finalScore = Math.max(0, Math.min(100, score));
  const level: "good" | "caution" | "high_caution" =
    finalScore >= 70 ? "good" : finalScore >= 40 ? "caution" : "high_caution";

  return NextResponse.json({
    id: null,
    url: normalized,
    final_url: typeof v.finalUrl === "string" ? v.finalUrl : normalized,
    score: finalScore,
    level,
    https: isHttps,
    reachable: Boolean(v.isWorking),
    status_code: typeof v.statusCode === "number" ? v.statusCode : null,
    redirect_count: redirectCount,
    has_cross_domain_redirect: hasCrossDomain,
    redirect_chain: redirectChain,
    response_time_ms: typeof v.responseTime === "number" ? v.responseTime : null,
    tls_valid: null,
    tls_expired: null,
    headers: null,
    signals,
    scanned_at: new Date().toISOString(),
  });
}
