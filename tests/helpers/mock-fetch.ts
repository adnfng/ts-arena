export interface MockFetchCall {
  url: string;
  init: RequestInit;
}

export interface MockResponseInit {
  status?: number;
  headers?: Record<string, string>;
}

export interface MockResponseObject {
  body: unknown;
  init?: MockResponseInit;
  kind?: "json" | "text";
}

export type MockQueueItem =
  | MockResponseObject
  | string
  | ((url: RequestInfo | URL, init: RequestInit) => Response | Promise<Response>)
  | unknown;

export function jsonResponse(body: unknown, init: MockResponseInit = {}): Response {
  const status = init.status ?? 200;
  const hasBody = !(status === 204 || status === 205 || status === 304);

  return new Response(hasBody ? JSON.stringify(body) : null, {
    status,
    headers: {
      "content-type": "application/json",
      ...(init.headers ?? {})
    }
  });
}

export function textResponse(body: unknown, init: MockResponseInit = {}): Response {
  const status = init.status ?? 200;
  const hasBody = !(status === 204 || status === 205 || status === 304);

  return new Response(hasBody ? String(body) : null, {
    status,
    headers: {
      "content-type": "text/plain",
      ...(init.headers ?? {})
    }
  });
}

export function toHeaders(input?: HeadersInit): Headers {
  return new Headers(input ?? {});
}

export function createMockFetch(queue: MockQueueItem[] = []): {
  fetch: typeof globalThis.fetch;
  calls: MockFetchCall[];
} {
  const calls: MockFetchCall[] = [];

  const fetch: typeof globalThis.fetch = async (
    url: RequestInfo | URL,
    init: RequestInit = {}
  ): Promise<Response> => {
    calls.push({ url: String(url), init });

    if (queue.length === 0) {
      return jsonResponse({ ok: true });
    }

    const next = queue.shift();

    if (typeof next === "function") {
      return next(url, init);
    }

    if (typeof next === "string") {
      return textResponse(next);
    }

    if (next && typeof next === "object" && "body" in next) {
      const response = next as MockResponseObject;
      return response.kind === "text"
        ? textResponse(response.body, response.init)
        : jsonResponse(response.body, response.init);
    }

    return jsonResponse(next ?? { ok: true });
  };

  return {
    fetch,
    calls
  };
}
