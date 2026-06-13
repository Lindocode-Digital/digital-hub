import { NextRequest, NextResponse } from "next/server";

const TIMEOUT_MS = 15000;

const HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
  "Accept-Language": "en-US,en;q=0.5",
  "Cache-Control": "no-cache",
};

// These codes mean the server responded and the site IS live — it's just
// blocking automated access (bot protection, auth walls, rate limits).
// A real browser visiting the same URL will load it fine.
const BOT_BLOCKED = new Set([401, 403, 406, 407, 429]);

function friendlyStatusText(code: number, raw: string): string {
  if (code === 401) return "Authentication Required";
  if (code === 403) return "Bot Protection Active";
  if (code === 406) return "Not Acceptable";
  if (code === 407) return "Proxy Auth Required";
  if (code === 429) return "Rate Limited";
  return raw || String(code);
}

async function probeWithChain(url: string, signal: AbortSignal) {
  const chain: string[] = [url];
  let current = url;

  for (let hop = 0; hop < 8; hop++) {
    let res: Response;
    try {
      res = await fetch(current, { method: "HEAD", redirect: "manual", signal, headers: HEADERS });
    } catch {
      break;
    }

    if (res.status >= 300 && res.status < 400) {
      const location = res.headers.get("location");
      if (!location) break;
      const next = new URL(location, current).toString();
      if (chain.includes(next)) break;
      chain.push(next);
      current = next;
      continue;
    }

    if (res.status === 405 || res.status === 501) {
      const getRes = await fetch(current, { method: "GET", redirect: "follow", signal, headers: HEADERS });
      if (getRes.url && getRes.url !== current && !chain.includes(getRes.url)) {
        chain.push(getRes.url);
      }
      return { response: getRes, chain };
    }

    return { response: res, chain };
  }

  const final = await fetch(current, { method: "HEAD", redirect: "follow", signal, headers: HEADERS });
  if (final.url && !chain.includes(final.url)) chain.push(final.url);
  return { response: final, chain };
}

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url");

  if (!url) {
    return NextResponse.json({ ok: false, isWorking: false, error: "No URL provided" });
  }

  try {
    const parsed = new URL(url);
    if (!["http:", "https:"].includes(parsed.protocol)) {
      throw new Error("Invalid protocol");
    }
  } catch {
    return NextResponse.json({ ok: false, isWorking: false, error: "Invalid URL" });
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);
  const startTime = Date.now();

  try {
    const { response, chain } = await probeWithChain(url, controller.signal);
    clearTimeout(timeoutId);

    const responseTime = Date.now() - startTime;
    const statusCode = response.status;

    // Site is "working" if it returned 2xx/3xx OR a bot-blocked code.
    // Bot-blocked means the server is live — a real browser can still open it.
    const isWorking =
      (statusCode >= 200 && statusCode < 400) || BOT_BLOCKED.has(statusCode);

    return NextResponse.json({
      ok: true,
      isWorking,
      isReachable: true,
      statusCode,
      statusText: friendlyStatusText(statusCode, response.statusText),
      finalUrl: chain[chain.length - 1] || response.url || url,
      contentType: response.headers.get("content-type"),
      redirectChain: chain,
      responseTime,
      link: url,
    });
  } catch (error: unknown) {
    clearTimeout(timeoutId);

    const isTimeout = error instanceof Error && error.name === "AbortError";

    return NextResponse.json({
      ok: false,
      isWorking: false,
      isReachable: false,
      error: isTimeout
        ? "Request timed out"
        : error instanceof Error
          ? error.message
          : "Validation failed",
      link: url,
    });
  }
}
