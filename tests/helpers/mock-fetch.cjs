function jsonResponse(body, init = {}) {
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

function textResponse(body, init = {}) {
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

function toHeaders(input) {
  return new Headers(input ?? {});
}

function createMockFetch(queue = []) {
  const calls = [];

  const fetch = async (url, init = {}) => {
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
      const responseKind = next.kind ?? "json";
      return responseKind === "text"
        ? textResponse(next.body, next.init)
        : jsonResponse(next.body, next.init);
    }

    return jsonResponse(next ?? { ok: true });
  };

  return {
    fetch,
    calls
  };
}

module.exports = {
  createMockFetch,
  jsonResponse,
  textResponse,
  toHeaders
};
