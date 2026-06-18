/**
 * @jest-environment node
 */

import { GET } from "@/app/api/validate/route";
import { NextRequest } from "next/server";

const mockFetch = jest.fn();
global.fetch = mockFetch;

// NextRequest has nextUrl; plain Request cast doesn't — use NextRequest directly
function makeRequest(url?: string): NextRequest {
  const searchParams = url ? `?url=${encodeURIComponent(url)}` : "";
  return new NextRequest(`http://localhost/api/validate${searchParams}`);
}

beforeEach(() => {
  jest.clearAllMocks();
});

describe("GET /api/validate — request validation", () => {
  it("returns isWorking: false when url param is missing", async () => {
    const req = makeRequest();
    const res = await GET(req);
    const data = await res.json();
    expect(data.ok).toBe(false);
    expect(data.isWorking).toBe(false);
    expect(data.error).toMatch(/no url/i);
  });

  it("returns isWorking: false for an invalid URL", async () => {
    const req = makeRequest("not-a-url");
    const res = await GET(req);
    const data = await res.json();
    expect(data.ok).toBe(false);
    expect(data.isWorking).toBe(false);
  });

  it("returns isWorking: false for a non-http protocol", async () => {
    const req = makeRequest("ftp://example.com");
    const res = await GET(req);
    const data = await res.json();
    expect(data.ok).toBe(false);
  });
});

describe("GET /api/validate — successful responses", () => {
  it("returns isWorking: true for a 200 OK response", async () => {
    mockFetch.mockResolvedValue({
      status: 200,
      statusText: "OK",
      headers: new Headers({ "content-type": "text/html" }),
      url: "https://example.com",
    });
    const req = makeRequest("https://example.com");
    const res = await GET(req);
    const data = await res.json();
    expect(data.ok).toBe(true);
    expect(data.isWorking).toBe(true);
    expect(data.statusCode).toBe(200);
  });

  it("returns isWorking: true for a 301 redirect response", async () => {
    mockFetch
      .mockResolvedValueOnce({
        status: 301,
        statusText: "Moved Permanently",
        headers: new Headers({ location: "https://www.example.com" }),
        url: "https://example.com",
      })
      .mockResolvedValue({
        status: 200,
        statusText: "OK",
        headers: new Headers({ "content-type": "text/html" }),
        url: "https://www.example.com",
      });
    const req = makeRequest("https://example.com");
    const res = await GET(req);
    const data = await res.json();
    expect(data.ok).toBe(true);
    expect(data.isWorking).toBe(true);
  });

  it("returns isWorking: true for a 403 (bot protection) response", async () => {
    mockFetch.mockResolvedValue({
      status: 403,
      statusText: "Forbidden",
      headers: new Headers(),
      url: "https://example.com",
    });
    const req = makeRequest("https://example.com");
    const res = await GET(req);
    const data = await res.json();
    expect(data.ok).toBe(true);
    expect(data.isWorking).toBe(true);
    expect(data.statusText).toMatch(/bot protection/i);
  });

  it("returns isWorking: true for a 429 (rate limited) response", async () => {
    mockFetch.mockResolvedValue({
      status: 429,
      statusText: "Too Many Requests",
      headers: new Headers(),
      url: "https://example.com",
    });
    const req = makeRequest("https://example.com");
    const res = await GET(req);
    const data = await res.json();
    expect(data.isWorking).toBe(true);
  });

  it("includes responseTime in the result", async () => {
    mockFetch.mockResolvedValue({
      status: 200,
      statusText: "OK",
      headers: new Headers(),
      url: "https://example.com",
    });
    const req = makeRequest("https://example.com");
    const res = await GET(req);
    const data = await res.json();
    expect(typeof data.responseTime).toBe("number");
    expect(data.responseTime).toBeGreaterThanOrEqual(0);
  });

  it("includes finalUrl in the result", async () => {
    mockFetch.mockResolvedValue({
      status: 200,
      statusText: "OK",
      headers: new Headers(),
      url: "https://example.com",
    });
    const req = makeRequest("https://example.com");
    const res = await GET(req);
    const data = await res.json();
    expect(data.finalUrl).toBeTruthy();
  });

  it("includes the original link in the result", async () => {
    mockFetch.mockResolvedValue({
      status: 200,
      statusText: "OK",
      headers: new Headers(),
      url: "https://example.com",
    });
    const req = makeRequest("https://example.com");
    const res = await GET(req);
    const data = await res.json();
    expect(data.link).toBe("https://example.com");
  });
});

describe("GET /api/validate — failure responses", () => {
  it("returns isWorking: false and isReachable: false when fetch throws", async () => {
    mockFetch.mockRejectedValue(new Error("ECONNREFUSED"));
    const req = makeRequest("https://unreachable.example.com");
    const res = await GET(req);
    const data = await res.json();
    expect(data.ok).toBe(false);
    expect(data.isWorking).toBe(false);
    expect(data.isReachable).toBe(false);
  });

  it("returns isWorking: false for a 500 server error", async () => {
    mockFetch.mockResolvedValue({
      status: 500,
      statusText: "Internal Server Error",
      headers: new Headers(),
      url: "https://example.com",
    });
    const req = makeRequest("https://example.com");
    const res = await GET(req);
    const data = await res.json();
    expect(data.isWorking).toBe(false);
  });

  it("returns isWorking: false for a 404 not found", async () => {
    mockFetch.mockResolvedValue({
      status: 404,
      statusText: "Not Found",
      headers: new Headers(),
      url: "https://example.com",
    });
    const req = makeRequest("https://example.com");
    const res = await GET(req);
    const data = await res.json();
    expect(data.isWorking).toBe(false);
  });

  it("includes a timeout error message when fetch aborts", async () => {
    const abortError = new Error("Aborted");
    abortError.name = "AbortError";
    mockFetch.mockRejectedValue(abortError);
    const req = makeRequest("https://slow.example.com");
    const res = await GET(req);
    const data = await res.json();
    expect(data.ok).toBe(false);
    expect(data.error).toMatch(/timed out/i);
  });
});
