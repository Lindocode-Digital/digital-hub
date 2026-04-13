// app/api/validate-link/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url");

  if (!url) {
    return NextResponse.json({ isValid: false, error: "No URL provided" });
  }

  try {
    // Use a service like https://httpstat.us/ or fetch with custom headers
    // Option 1: Direct fetch (may have CORS issues)
    const response = await fetch(url, {
      method: "HEAD", // Only fetch headers, not the full page
      redirect: "follow",
      // Add a timeout
      signal: AbortSignal.timeout(5000),
    });

    const isValid =
      response.ok && response.status >= 200 && response.status < 400;

    return NextResponse.json({
      isValid,
      statusCode: response.status,
      statusText: response.statusText,
    });
  } catch (error) {
    return NextResponse.json({
      isValid: false,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
