/**
 * @jest-environment node
 */

import { POST } from "@/app/api/scan/route";
import { NextRequest } from "next/server";

jest.setTimeout(15000);

// TLS mock: triggers secureConnect on the next tick so checkTls resolves immediately
jest.mock("node:tls", () => ({
  connect: jest.fn(() => {
    const socket: Record<string, unknown> = {
      getPeerCertificate: () => ({
        valid_to: new Date(Date.now() + 86400000 * 365).toUTCString(),
      }),
      authorized: true,
      authorizationError: null,
      destroy: jest.fn(),
      once: jest.fn((event: string, handler: (...args: unknown[]) => void) => {
        if (event === "secureConnect") {
          process.nextTick(handler);
        }
      }),
    };
    return socket;
  }),
}));

const mockFetch = jest.fn();
global.fetch = mockFetch;

function makeRequest(body: unknown): NextRequest {
  return new NextRequest("http://localhost/api/scan", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

function mockNetworkOk(statusCode = 200) {
  mockFetch.mockResolvedValue({
    ok: true,
    status: statusCode,
    headers: new Headers({
      "strict-transport-security": "max-age=31536000",
      "content-security-policy": "default-src 'self'",
      "x-frame-options": "DENY",
      "referrer-policy": "no-referrer",
      "permissions-policy": "geolocation=()",
    }),
    url: "https://example.com",
    json: async () => ({}),
  });
}

beforeEach(() => {
  jest.clearAllMocks();
});

describe("POST /api/scan — request validation", () => {
  it("returns 400 when the request body is not valid JSON", async () => {
    const req = new NextRequest("http://localhost/api/scan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "not json{{",
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toBe("Invalid request body");
  });

  it("returns 400 when url is missing from body (after upstream fails)", async () => {
    mockFetch.mockRejectedValueOnce(new Error("upstream down"));
    const req = makeRequest({});
    const res = await POST(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toBe("url is required");
  });

  it("returns 400 for a URL that cannot be parsed after normalization", async () => {
    // "not a url" → normalized to "https://not a url" → new URL() throws → 400
    mockFetch.mockRejectedValueOnce(new Error("upstream down"));
    const req = makeRequest({ url: "not a url" });
    const res = await POST(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toBe("Invalid URL");
  });
});

describe("POST /api/scan — upstream passthrough", () => {
  it("returns upstream data directly when upstream responds with a valid score", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ score: 90, level: "good", signals: [], reachable: true }),
    });
    const req = makeRequest({ url: "https://example.com" });
    const res = await POST(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.score).toBe(90);
    expect(data.level).toBe("good");
  });

  it("falls back to local analysis when upstream returns ok=false", async () => {
    mockFetch.mockResolvedValueOnce({ ok: false, json: async () => ({}) });
    mockNetworkOk();
    const req = makeRequest({ url: "https://example.com" });
    const res = await POST(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(typeof data.score).toBe("number");
  });

  it("falls back to local analysis when upstream throws", async () => {
    mockFetch.mockRejectedValueOnce(new Error("network failure"));
    mockNetworkOk();
    const req = makeRequest({ url: "https://example.com" });
    const res = await POST(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(typeof data.score).toBe("number");
  });
});

describe("POST /api/scan — local URL analysis scoring", () => {
  beforeEach(() => {
    mockFetch.mockRejectedValueOnce(new Error("upstream down"));
    mockNetworkOk();
  });

  it("awards HTTPS points for https:// URLs", async () => {
    const req = makeRequest({ url: "https://example.com" });
    const res = await POST(req);
    const data = await res.json();
    const httpsSignal = data.signals.find((s: { id: string }) => s.id === "https");
    expect(httpsSignal.status).toBe("pass");
    expect(httpsSignal.points).toBe(20);
  });

  it("gives 0 HTTPS points for http:// URLs", async () => {
    mockFetch.mockReset();
    mockFetch.mockRejectedValueOnce(new Error("upstream down"));
    mockFetch.mockResolvedValue({
      ok: true, status: 200,
      headers: new Headers(), url: "http://example.com", json: async () => ({}),
    });
    const req = makeRequest({ url: "http://example.com" });
    const res = await POST(req);
    const data = await res.json();
    const httpsSignal = data.signals.find((s: { id: string }) => s.id === "https");
    expect(httpsSignal.status).toBe("fail");
    expect(httpsSignal.points).toBe(0);
  });

  it("flags raw IP address URLs", async () => {
    mockFetch.mockReset();
    mockFetch.mockRejectedValueOnce(new Error("upstream down"));
    mockFetch.mockResolvedValue({
      ok: true, status: 200,
      headers: new Headers(), url: "http://192.168.1.1", json: async () => ({}),
    });
    const req = makeRequest({ url: "http://192.168.1.1/path" });
    const res = await POST(req);
    const data = await res.json();
    const ipSignal = data.signals.find((s: { id: string }) => s.id === "ip_url");
    expect(ipSignal.status).toBe("fail");
  });

  it("flags known URL shorteners", async () => {
    mockFetch.mockReset();
    mockFetch.mockRejectedValueOnce(new Error("upstream down"));
    mockFetch.mockResolvedValue({
      ok: true, status: 200,
      headers: new Headers(), url: "https://bit.ly/abc", json: async () => ({}),
    });
    const req = makeRequest({ url: "https://bit.ly/abc" });
    const res = await POST(req);
    const data = await res.json();
    const shortenerSignal = data.signals.find((s: { id: string }) => s.id === "shortener");
    expect(shortenerSignal.status).toBe("warn");
  });

  it("flags punycode hostnames", async () => {
    mockFetch.mockReset();
    mockFetch.mockRejectedValueOnce(new Error("upstream down"));
    mockFetch.mockResolvedValue({
      ok: true, status: 200,
      headers: new Headers(), url: "https://xn--80akhbyknj4f.com", json: async () => ({}),
    });
    const req = makeRequest({ url: "https://xn--80akhbyknj4f.com" });
    const res = await POST(req);
    const data = await res.json();
    const punycodeSignal = data.signals.find((s: { id: string }) => s.id === "punycode");
    expect(punycodeSignal.status).toBe("warn");
  });

  it("flags hostnames with more than 4 labels as suspicious", async () => {
    mockFetch.mockReset();
    mockFetch.mockRejectedValueOnce(new Error("upstream down"));
    mockFetch.mockResolvedValue({
      ok: true, status: 200,
      headers: new Headers(), url: "https://a.b.c.d.e.com", json: async () => ({}),
    });
    const req = makeRequest({ url: "https://a.b.c.d.e.com" });
    const res = await POST(req);
    const data = await res.json();
    const hostSignal = data.signals.find((s: { id: string }) => s.id === "suspicious_host");
    expect(hostSignal.status).toBe("warn");
  });
});

describe("POST /api/scan — score and level", () => {
  it("returns score as a number between 0 and 100", async () => {
    mockFetch.mockRejectedValueOnce(new Error("upstream down"));
    mockNetworkOk();
    const req = makeRequest({ url: "https://example.com" });
    const res = await POST(req);
    const data = await res.json();
    expect(data.score).toBeGreaterThanOrEqual(0);
    expect(data.score).toBeLessThanOrEqual(100);
  });

  it("returns a valid level string", async () => {
    mockFetch.mockRejectedValueOnce(new Error("upstream down"));
    mockNetworkOk(200);
    const req = makeRequest({ url: "https://example.com" });
    const res = await POST(req);
    const data = await res.json();
    expect(["good", "caution", "high_caution", "unknown"]).toContain(data.level);
  });

  it("includes https, reachable, signals, and redirect_chain in the response", async () => {
    mockFetch.mockRejectedValueOnce(new Error("upstream down"));
    mockNetworkOk();
    const req = makeRequest({ url: "https://example.com" });
    const res = await POST(req);
    const data = await res.json();
    expect(typeof data.https).toBe("boolean");
    expect(typeof data.reachable).toBe("boolean");
    expect(Array.isArray(data.signals)).toBe(true);
    expect(Array.isArray(data.redirect_chain)).toBe(true);
  });

  it("includes a scanned_at ISO timestamp", async () => {
    mockFetch.mockRejectedValueOnce(new Error("upstream down"));
    mockNetworkOk();
    const req = makeRequest({ url: "https://example.com" });
    const res = await POST(req);
    const data = await res.json();
    expect(data.scanned_at).toMatch(/^\d{4}-\d{2}-\d{2}T/);
  });
});
