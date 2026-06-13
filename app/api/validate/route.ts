import { NextRequest, NextResponse } from "next/server";

const TIMEOUT_MS = 8000;

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url");

  if (!url) {
    return NextResponse.json({ ok: false, isWorking: false, error: "No URL provided" });
  }

  let parsedUrl: URL;
  try {
    parsedUrl = new URL(url);
    if (!["http:", "https:"].includes(parsedUrl.protocol)) {
      throw new Error("Invalid protocol");
    }
  } catch {
    return NextResponse.json({ ok: false, isWorking: false, error: "Invalid URL" });
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      method: "HEAD",
      redirect: "follow",
      signal: controller.signal,
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; DigitalHubBot/1.0)",
        Accept: "text/html,application/xhtml+xml,*/*;q=0.8",
      },
    });

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
