import { NextRequest, NextResponse } from "next/server";

const TIMEOUT_MS = 8000;

const HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
  "Accept-Language": "en-US,en;q=0.5",
};

async function probe(url: string, signal: AbortSignal) {
  // Try HEAD first (lightweight). If the server returns 405 (Method Not
  // Allowed), retry with GET — some hosts reject HEAD entirely.
  let res = await fetch(url, {
    method: "HEAD",
    redirect: "follow",
    signal,
    headers: HEADERS,
  });

  if (res.status === 405 || res.status === 501) {
    res = await fetch(url, {
      method: "GET",
      redirect: "follow",
      signal,
      headers: HEADERS,
    });
  }

  return res;
}

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url");

  if (!url) {
    return NextResponse.json({
      ok: false,
      isWorking: false,
      error: "No URL provided",
    });
  }

  try {
    const parsed = new URL(url);
    if (!["http:", "https:"].includes(parsed.protocol)) {
      throw new Error("Invalid protocol");
    }
  } catch {
    return NextResponse.json({
      ok: false,
      isWorking: false,
      error: "Invalid URL",
    });
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await probe(url, controller.signal);
    clearTimeout(timeoutId);

    const statusCode = response.status;
    const isWorking = statusCode >= 200 && statusCode < 400;

    return NextResponse.json({
      ok: true,
      isWorking,
      isReachable: true,
      statusCode,
      statusText: response.statusText || String(statusCode),
      finalUrl: response.url || url,
      contentType: response.headers.get("content-type"),
      link: url,
    });
  } catch (error: unknown) {
    clearTimeout(timeoutId);

    const isTimeout =
      error instanceof Error && error.name === "AbortError";

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
