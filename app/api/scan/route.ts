import { NextRequest, NextResponse } from "next/server";
import tls from "node:tls";

const UPSTREAM =
  process.env.SCAN_API_URL ?? "https://api.lindocode.com/api/lazy-appz/scan";

type SignalStatus = "pass" | "fail" | "warn" | "info" | "skip";
interface Signal {
  id: string;
  label: string;
  status: SignalStatus;
  detail: string;
  points: number;
}

const FETCH_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
  "Accept-Language": "en-US,en;q=0.5",
  "Cache-Control": "no-cache",
};

const BOT_BLOCKED = new Set([401, 403, 406, 407, 429]);

const URL_SHORTENERS = new Set([
  "bit.ly", "tinyurl.com", "t.co", "goo.gl", "ow.ly", "is.gd",
  "buff.ly", "adf.ly", "short.link", "rb.gy", "cutt.ly", "tiny.cc",
  "gg.gg", "v.gd", "lnkd.in", "wp.me", "dlvr.it", "ift.tt",
  "cli.gs", "trib.al", "su.pr", "soo.gd", "mcaf.ee", "po.st",
  "clck.ru", "short.io", "shorte.st", "snip.ly", "bl.ink",
  "hyperurl.co", "linktr.ee", "bio.link",
]);

// ── TLS certificate check ────────────────────────────────────────────────────

function checkTls(hostname: string): Promise<{
  valid: boolean;
  expired: boolean;
  error: string | null;
  expiresAt: string | null;
}> {
  return new Promise((resolve) => {
    let socket: tls.TLSSocket | undefined;
    const timer = setTimeout(() => {
      socket?.destroy();
      resolve({ valid: false, expired: false, error: "TIMEOUT", expiresAt: null });
    }, 5000);

    try {
      socket = tls.connect({
        host: hostname,
        port: 443,
        servername: hostname,
        rejectUnauthorized: false,
      });

      socket.once("secureConnect", () => {
        clearTimeout(timer);
        const sock = socket as tls.TLSSocket & { authorizationError?: string | Error };
        const cert = sock.getPeerCertificate();
        const authorized = sock.authorized;
        const authErr = sock.authorizationError ?? null;
        const authErrStr = authErr ? String(authErr) : null;
        const expired = cert?.valid_to
          ? new Date(cert.valid_to) < new Date()
          : String(authErr).includes("EXPIRED");
        sock.destroy();
        resolve({
          valid: Boolean(authorized && !expired),
          expired: Boolean(expired),
          error: authErrStr,
          expiresAt: cert?.valid_to ?? null,
        });
      });

      socket.once("error", (err: NodeJS.ErrnoException) => {
        clearTimeout(timer);
        resolve({
          valid: false,
          expired: err.code === "CERT_HAS_EXPIRED",
          error: err.code ?? err.message,
          expiresAt: null,
        });
      });
    } catch (err) {
      clearTimeout(timer);
      resolve({ valid: false, expired: false, error: (err as Error).message, expiresAt: null });
    }
  });
}

// ── Network probe with redirect chain ────────────────────────────────────────

async function probeNetwork(url: string, signal: AbortSignal) {
  const chain: string[] = [url];
  let current = url;
  let finalRes: Response | null = null;
  let statusCode: number | null = null;
  const startTime = Date.now();

  for (let hop = 0; hop < 8; hop++) {
    let res: Response;
    try {
      res = await fetch(current, {
        method: "HEAD",
        redirect: "manual",
        signal,
        headers: FETCH_HEADERS,
      });
    } catch {
      break;
    }

    if (res.status >= 300 && res.status < 400) {
      const location = res.headers.get("location");
      if (!location) break;
      try {
        const next = new URL(location, current).toString();
        if (chain.includes(next)) break;
        chain.push(next);
        current = next;
        continue;
      } catch {
        break;
      }
    }

    if (res.status === 405 || res.status === 501) {
      try {
        const getRes = await fetch(current, {
          method: "GET",
          redirect: "follow",
          signal,
          headers: FETCH_HEADERS,
        });
        statusCode = getRes.status;
        finalRes = getRes;
        if (getRes.url && getRes.url !== current && !chain.includes(getRes.url)) {
          chain.push(getRes.url);
        }
      } catch {}
      break;
    }

    statusCode = res.status;
    finalRes = res;
    break;
  }

  const responseTime = Date.now() - startTime;
  const finalUrl = chain[chain.length - 1];
  const redirectCount = chain.length - 1;

  let hasCrossDomainRedirect = false;
  if (chain.length > 1) {
    try {
      const firstHost = new URL(chain[0]).hostname.replace(/^www\./, "");
      const lastHost = new URL(finalUrl).hostname.replace(/^www\./, "");
      hasCrossDomainRedirect = firstHost !== lastHost;
    } catch {}
  }

  const reachable =
    statusCode !== null &&
    ((statusCode >= 200 && statusCode < 400) || BOT_BLOCKED.has(statusCode));

  return { finalUrl, chain, statusCode, redirectCount, hasCrossDomainRedirect, responseTime, response: finalRes, reachable };
}

// ── Security header analysis ─────────────────────────────────────────────────

function analyzeHeaders(response: Response | null): {
  hasHsts: boolean | null;
  hasCsp: boolean | null;
  hasXFrameOptions: boolean | null;
  hasReferrerPolicy: boolean | null;
  hasPermissionsPolicy: boolean | null;
  signals: Signal[];
  score: number;
} {
  if (!response) {
    return {
      hasHsts: null, hasCsp: null, hasXFrameOptions: null,
      hasReferrerPolicy: null, hasPermissionsPolicy: null,
      signals: [], score: 0,
    };
  }

  const h = response.headers;
  const hasHsts              = Boolean(h.get("strict-transport-security"));
  const hasCsp               = Boolean(h.get("content-security-policy"));
  const hasXFrameOptions     = Boolean(h.get("x-frame-options"));
  const hasReferrerPolicy    = Boolean(h.get("referrer-policy"));
  const hasPermissionsPolicy = Boolean(h.get("permissions-policy"));

  const signals: Signal[] = [];
  let score = 0;

  if (hasHsts) {
    score += 6;
    signals.push({ id: "hsts", label: "HSTS Enabled", status: "pass", detail: "Strict-Transport-Security header forces all future connections over HTTPS", points: 6 });
  } else {
    signals.push({ id: "hsts", label: "HSTS Missing", status: "warn", detail: "No Strict-Transport-Security header — browsers may allow HTTP downgrade attacks", points: 0 });
  }

  if (hasCsp) {
    score += 6;
    signals.push({ id: "csp", label: "Content Security Policy", status: "pass", detail: "CSP header restricts which sources can load scripts, styles, and other resources", points: 6 });
  } else {
    signals.push({ id: "csp", label: "No Content Security Policy", status: "warn", detail: "Missing CSP header — page may be vulnerable to cross-site scripting (XSS) attacks", points: 0 });
  }

  if (hasXFrameOptions) {
    score += 4;
    signals.push({ id: "x_frame_options", label: "Clickjacking Protection", status: "pass", detail: "X-Frame-Options header prevents this page from being embedded in a malicious iframe", points: 4 });
  } else {
    signals.push({ id: "x_frame_options", label: "No Clickjacking Protection", status: "warn", detail: "Missing X-Frame-Options — page may be embeddable in an attacker-controlled iframe", points: 0 });
  }

  if (hasReferrerPolicy) {
    score += 2;
    signals.push({ id: "referrer_policy", label: "Referrer Policy Set", status: "pass", detail: "Controls how much referrer information is sent to third-party sites", points: 2 });
  } else {
    signals.push({ id: "referrer_policy", label: "No Referrer Policy", status: "info", detail: "Missing Referrer-Policy — browser default referrer behaviour applies", points: 0 });
  }

  if (hasPermissionsPolicy) {
    score += 2;
    signals.push({ id: "permissions_policy", label: "Permissions Policy Set", status: "pass", detail: "Restricts browser feature access (camera, microphone, geolocation)", points: 2 });
  } else {
    signals.push({ id: "permissions_policy", label: "No Permissions Policy", status: "info", detail: "Missing Permissions-Policy — browser features are not explicitly restricted", points: 0 });
  }

  return { hasHsts, hasCsp, hasXFrameOptions, hasReferrerPolicy, hasPermissionsPolicy, signals, score };
}

// ── Handler ──────────────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  let body: { url?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  // ── Try VM API first ──────────────────────────────────────────────────────
  try {
    const upstream = await fetch(UPSTREAM, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(15000),
    });
    const data = await upstream.json();
    if (upstream.ok && typeof data.score === "number") {
      return NextResponse.json(data);
    }
  } catch {
    // VM not reachable — run full analysis locally below
  }

  // ── Local analysis: Phase 1 + 2 + 3 (no DB write) ────────────────────────
  const url = body.url;
  if (!url) return NextResponse.json({ error: "url is required" }, { status: 400 });

  const normalized = /^https?:\/\//i.test(url) ? url : `https://${url}`;

  let parsed: URL;
  try {
    parsed = new URL(normalized);
    if (!["http:", "https:"].includes(parsed.protocol)) throw new Error();
  } catch {
    return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
  }

  const isHttps = parsed.protocol === "https:";
  const hostname = parsed.hostname.toLowerCase();
  const signals: Signal[] = [];
  let score = 0;

  // Phase 1 — URL analysis
  if (isHttps) {
    score += 20;
    signals.push({ id: "https", label: "HTTPS Encryption", status: "pass", detail: "Connection uses TLS/SSL encryption", points: 20 });
  } else {
    signals.push({ id: "https", label: "No HTTPS", status: "fail", detail: "Connection is unencrypted — data can be intercepted in transit", points: 0 });
  }

  const isIpUrl = /^(\d{1,3}\.){3}\d{1,3}$/.test(hostname);
  if (isIpUrl) {
    signals.push({ id: "ip_url", label: "Raw IP Address URL", status: "fail", detail: "URL uses an IP address instead of a domain name — common in phishing and malware", points: 0 });
  } else {
    score += 8;
    signals.push({ id: "ip_url", label: "Domain Name URL", status: "pass", detail: "URL uses a proper registered domain", points: 8 });
  }

  const apex = hostname.split(".").slice(-2).join(".");
  const isShortener = URL_SHORTENERS.has(apex) || URL_SHORTENERS.has(hostname);
  if (isShortener) {
    signals.push({ id: "shortener", label: "URL Shortener Detected", status: "warn", detail: "Short links hide the real destination — the final URL may be unexpected or unsafe", points: 0 });
  } else {
    score += 5;
    signals.push({ id: "shortener", label: "Full URL", status: "pass", detail: "Not a URL shortener service", points: 5 });
  }

  const hasPunycode = hostname.includes("xn--");
  if (hasPunycode) {
    signals.push({ id: "punycode", label: "Punycode Hostname", status: "warn", detail: "Contains encoded international characters — may be used to visually spoof a legitimate domain", points: 0 });
  } else {
    score += 5;
    signals.push({ id: "punycode", label: "Standard Hostname", status: "pass", detail: "No punycode encoding detected", points: 5 });
  }

  const labels = hostname.split(".");
  const hasSuspiciousHost = labels.length > 4;
  if (hasSuspiciousHost) {
    signals.push({ id: "suspicious_host", label: "Suspicious Subdomain Depth", status: "warn", detail: `Hostname has ${labels.length} domain labels — deeply nested subdomains can be used to disguise the true registrant`, points: 0 });
  } else {
    score += 2;
    signals.push({ id: "suspicious_host", label: "Normal Hostname Structure", status: "pass", detail: "Subdomain depth is within normal range", points: 2 });
  }

  const paramCount = [...parsed.searchParams.keys()].length;
  const hasExcessiveParams = paramCount > 5;
  if (hasExcessiveParams) {
    signals.push({ id: "excessive_params", label: `Excessive Query Parameters (${paramCount})`, status: "warn", detail: "URLs with many parameters can be used for tracking, obfuscation, or token injection", points: 0 });
  } else {
    signals.push({ id: "excessive_params", label: "Clean Query String", status: "info", detail: paramCount > 0 ? `${paramCount} query parameter${paramCount !== 1 ? "s" : ""}` : "No query parameters", points: 0 });
  }

  // Phase 2 — network probe + TLS
  const abortCtrl = new AbortController();
  const timeoutId = setTimeout(() => abortCtrl.abort(), 12000);

  let networkResult: Awaited<ReturnType<typeof probeNetwork>> | null = null;
  let tlsResult: Awaited<ReturnType<typeof checkTls>> | null = null;

  try {
    const [probe, tlsCheck] = await Promise.all([
      probeNetwork(normalized, abortCtrl.signal),
      isHttps ? checkTls(hostname) : Promise.resolve(null),
    ]);
    clearTimeout(timeoutId);
    networkResult = probe;
    tlsResult = tlsCheck;
  } catch {
    clearTimeout(timeoutId);
  }

  const sc = networkResult?.statusCode ?? null;

  if (networkResult) {
    if (networkResult.reachable) {
      score += 15;
      signals.push({ id: "reachable", label: "Site Reachable", status: "pass", detail: `Server responded with HTTP ${sc}`, points: 15 });
    } else {
      signals.push({ id: "reachable", label: "Site Unreachable", status: "fail", detail: sc ? `Server returned HTTP ${sc}` : "No response from server", points: 0 });
    }

    if (sc === 200) {
      score += 5;
      signals.push({ id: "http_200", label: "HTTP 200 OK", status: "pass", detail: "Server returned a clean 200 OK response", points: 5 });
    }

    if (isHttps && tlsResult) {
      if (tlsResult.valid) {
        score += 12;
        const expiry = tlsResult.expiresAt
          ? ` · valid until ${new Date(tlsResult.expiresAt).toLocaleDateString()}`
          : "";
        signals.push({ id: "tls", label: "TLS Certificate Valid", status: "pass", detail: `Certificate is trusted and not expired${expiry}`, points: 12 });
      } else if (tlsResult.expired) {
        signals.push({ id: "tls", label: "TLS Certificate Expired", status: "fail", detail: "The SSL/TLS certificate has expired — browsers will display a security warning", points: 0 });
      } else {
        signals.push({ id: "tls", label: "TLS Certificate Invalid", status: "fail", detail: tlsResult.error ? `Certificate error: ${tlsResult.error}` : "Certificate cannot be verified", points: 0 });
      }
    } else if (!isHttps) {
      signals.push({ id: "tls", label: "No TLS (HTTP)", status: "skip", detail: "TLS certificate check requires HTTPS", points: 0 });
    }

    const hops = networkResult.redirectCount;
    if (hops === 0) {
      score += 5;
      signals.push({ id: "redirects", label: "No Redirects", status: "pass", detail: "URL resolves directly without any redirects", points: 5 });
    } else if (hops <= 2 && !networkResult.hasCrossDomainRedirect) {
      score += 3;
      signals.push({ id: "redirects", label: `${hops} Same-Domain Redirect${hops > 1 ? "s" : ""}`, status: "pass", detail: "Normal redirect (e.g. www or trailing-slash normalisation)", points: 3 });
    } else if (networkResult.hasCrossDomainRedirect) {
      signals.push({ id: "redirects", label: "Cross-Domain Redirect", status: "warn", detail: `Redirected to a different domain — final destination: ${networkResult.finalUrl}`, points: 0 });
    } else {
      signals.push({ id: "redirects", label: `${hops} Redirect${hops > 1 ? "s" : ""}`, status: "warn", detail: "Excessive redirect chain detected", points: 0 });
    }
  } else {
    signals.push({ id: "reachable", label: "Network Check Failed", status: "fail", detail: "Could not connect to the server — site may be down, timing out, or blocking requests", points: 0 });
    signals.push({ id: "tls", label: "TLS Check Skipped", status: "skip", detail: "Network probe did not complete", points: 0 });
    signals.push({ id: "redirects", label: "Redirect Check Skipped", status: "skip", detail: "Network probe did not complete", points: 0 });
  }

  // Phase 3 — security headers
  const p3 = analyzeHeaders(networkResult?.response ?? null);
  score += p3.score;
  signals.push(...p3.signals);

  const finalScore = Math.max(0, Math.min(100, score));
  const level: "good" | "caution" | "high_caution" =
    finalScore >= 70 ? "good" : finalScore >= 40 ? "caution" : "high_caution";

  return NextResponse.json({
    id: null,
    url: normalized,
    final_url: networkResult?.finalUrl ?? normalized,
    score: finalScore,
    level,
    https: isHttps,
    reachable: networkResult?.reachable ?? false,
    status_code: sc,
    redirect_count: networkResult?.redirectCount ?? null,
    has_cross_domain_redirect: networkResult?.hasCrossDomainRedirect ?? null,
    redirect_chain: networkResult?.chain ?? [],
    response_time_ms: networkResult?.responseTime ?? null,
    tls_valid: tlsResult?.valid ?? null,
    tls_expired: tlsResult?.expired ?? null,
    headers: {
      hsts: p3.hasHsts,
      csp: p3.hasCsp,
      x_frame_options: p3.hasXFrameOptions,
      referrer_policy: p3.hasReferrerPolicy,
      permissions_policy: p3.hasPermissionsPolicy,
    },
    signals,
    scanned_at: new Date().toISOString(),
  });
}
