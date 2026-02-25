import test from "node:test";
import assert from "node:assert/strict";
import Arena, { ArenaApiError } from "../src/index.js";

function jsonResponse(body: unknown, init: { status?: number; headers?: Record<string, string> } = {}): Response {
  return new Response(JSON.stringify(body), {
    status: init.status ?? 200,
    headers: {
      "content-type": "application/json",
      ...(init.headers ?? {})
    }
  });
}

function toHeaders(input?: HeadersInit): Headers {
  return new Headers(input ?? {});
}

test("v3 requests include bearer token by default", async () => {
  let seenAuth: string | null = null;

  const arena = new Arena({
    token: "secret-token",
    fetch: async (_url: RequestInfo | URL, init?: RequestInit) => {
      const headers = toHeaders(init?.headers);
      seenAuth = headers.get("authorization");
      return jsonResponse({ ok: true });
    }
  });

  await arena.v3.system.ping();
  assert.equal(seenAuth, "Bearer secret-token");
});

test("oauth token exchange uses form encoding and skips bearer auth", async () => {
  let seenAuth: string | null = null;
  let seenContentType: string | null = null;
  let seenBody = "";

  const arena = new Arena({
    token: "secret-token",
    fetch: async (_url: RequestInfo | URL, init?: RequestInit) => {
      const headers = toHeaders(init?.headers);
      seenAuth = headers.get("authorization");
      seenContentType = headers.get("content-type");
      seenBody = String(init?.body);
      return jsonResponse({
        access_token: "token",
        token_type: "Bearer",
        scope: "read",
        created_at: 0
      });
    }
  });

  await arena.v3.auth.exchangeToken({
    grant_type: "client_credentials",
    client_id: "client-id",
    client_secret: "client-secret"
  });

  assert.equal(seenAuth, null);
  assert.equal(seenContentType, "application/x-www-form-urlencoded");
  assert.match(seenBody, /grant_type=client_credentials/);
});

test("search serializes array query params as comma-separated values", async () => {
  let seenUrl = "";

  const arena = new Arena({
    fetch: async (url: RequestInfo | URL) => {
      seenUrl = String(url);
      return jsonResponse({
        data: [],
        meta: {
          current_page: 1,
          per_page: 24,
          total_pages: 1,
          total_count: 0,
          next_page: null,
          prev_page: null,
          has_more_pages: false
        }
      });
    }
  });

  await arena.v3.search.query({
    query: "design",
    type: ["Channel", "User"],
    ext: ["pdf", "jpg"]
  });

  assert.match(seenUrl, /query=design/);
  assert.match(seenUrl, /type=Channel%2CUser/);
  assert.match(seenUrl, /ext=pdf%2Cjpg/);
});

test("non-2xx responses throw ArenaApiError with rate-limit metadata", async () => {
  const arena = new Arena({
    fetch: async () =>
      jsonResponse(
        {
          error: "Rate limit exceeded",
          code: 429,
          details: { message: "Wait and retry." }
        },
        {
          status: 429,
          headers: {
            "x-ratelimit-limit": "30",
            "x-ratelimit-tier": "guest",
            "x-ratelimit-window": "60",
            "x-ratelimit-reset": "1700000000",
            "retry-after": "10"
          }
        }
      )
  });

  await assert.rejects(arena.v3.system.ping(), (error: unknown) => {
    if (!(error instanceof ArenaApiError)) {
      return false;
    }

    assert.equal(error.status, 429);
    assert.equal(error.code, 429);
    assert.deepEqual(error.details, { message: "Wait and retry." });
    assert.equal(error.rateLimit?.limit, 30);
    assert.equal(error.rateLimit?.tier, "guest");
    assert.equal(error.rateLimit?.retryAfterSeconds, 10);
    return true;
  });
});

test("fetch is invoked with globalThis context for browser compatibility", async () => {
  let seenThis: unknown;
  const arena = new Arena({
    fetch: async function (this: unknown) {
      seenThis = this;
      return jsonResponse({ ok: true });
    }
  });

  await arena.v3.system.ping();
  assert.equal(seenThis, globalThis);
});
