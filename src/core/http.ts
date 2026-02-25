import { ArenaApiError } from "./errors.js";
import type {
  ArenaClientOptions,
  ArenaRateLimit,
  HttpRequestInput,
  InternalClientOptions,
  QueryPrimitive,
  RetryOptions
} from "./types.js";

const DEFAULT_BASE_URL = "https://api.are.na";
const DEFAULT_TIMEOUT_MS = 30_000;
const DEFAULT_RETRY: Required<RetryOptions> = {
  retries: 0,
  baseDelayMs: 250,
  maxDelayMs: 4_000,
  retryOn: [429, 500, 502, 503, 504]
};

function trimTrailingSlash(value: string): string {
  return value.endsWith("/") ? value.slice(0, -1) : value;
}

function isQueryPrimitive(value: unknown): value is QueryPrimitive {
  return (
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  );
}

function toSearchParams(query?: object): string {
  if (!query) {
    return "";
  }

  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (value === undefined || value === null) {
      continue;
    }

    if (Array.isArray(value)) {
      if (value.length === 0) {
        continue;
      }

      params.set(
        key,
        value
          .filter((item) => isQueryPrimitive(item))
          .map((item) => String(item))
          .join(",")
      );
      continue;
    }

    if (isQueryPrimitive(value)) {
      params.set(key, String(value));
    }
  }

  return params.toString();
}

function buildUrl(baseUrl: string, path: string, query?: object): string {
  const queryString = toSearchParams(query);
  const targetPath = path.startsWith("/") ? path : `/${path}`;
  const url = `${trimTrailingSlash(baseUrl)}${targetPath}`;
  return queryString ? `${url}?${queryString}` : url;
}

function parseIntegerHeader(value: string | null): number | undefined {
  if (!value) {
    return undefined;
  }

  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function extractRateLimit(headers: Headers): ArenaRateLimit | undefined {
  const rateLimit: ArenaRateLimit = {
    limit: parseIntegerHeader(headers.get("X-RateLimit-Limit")),
    tier: (headers.get("X-RateLimit-Tier") as ArenaRateLimit["tier"]) ?? undefined,
    windowSeconds: parseIntegerHeader(headers.get("X-RateLimit-Window")),
    resetUnix: parseIntegerHeader(headers.get("X-RateLimit-Reset")),
    retryAfterSeconds: parseIntegerHeader(headers.get("Retry-After"))
  };

  if (
    rateLimit.limit === undefined &&
    rateLimit.tier === undefined &&
    rateLimit.windowSeconds === undefined &&
    rateLimit.resetUnix === undefined &&
    rateLimit.retryAfterSeconds === undefined
  ) {
    return undefined;
  }

  return rateLimit;
}

function isJsonResponse(response: Response): boolean {
  const contentType = response.headers.get("content-type") ?? "";
  return contentType.includes("application/json");
}

function isAbortError(error: unknown): boolean {
  return (
    error instanceof DOMException && error.name === "AbortError"
  ) || (
    error instanceof Error && error.name === "AbortError"
  );
}

function toDelayMs(input: number, max: number): number {
  return Math.min(input, max);
}

function sleep(durationMs: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, durationMs);
  });
}

function normalizeRetryOptions(input?: RetryOptions): Required<RetryOptions> {
  return {
    retries: input?.retries ?? DEFAULT_RETRY.retries,
    baseDelayMs: input?.baseDelayMs ?? DEFAULT_RETRY.baseDelayMs,
    maxDelayMs: input?.maxDelayMs ?? DEFAULT_RETRY.maxDelayMs,
    retryOn: input?.retryOn ?? DEFAULT_RETRY.retryOn
  };
}

export function normalizeClientOptions(
  options: ArenaClientOptions = {}
): InternalClientOptions {
  const fetchImpl = options.fetch ?? globalThis.fetch;
  if (!fetchImpl) {
    throw new Error(
      "No fetch implementation found. Provide options.fetch or use a runtime with global fetch."
    );
  }

  return {
    token: options.token,
    baseUrl: trimTrailingSlash(options.baseUrl ?? DEFAULT_BASE_URL),
    legacyV2BaseUrl: trimTrailingSlash(options.legacyV2BaseUrl ?? options.baseUrl ?? DEFAULT_BASE_URL),
    timeoutMs: options.timeoutMs ?? DEFAULT_TIMEOUT_MS,
    userAgent: options.userAgent,
    fetchImpl,
    retry: normalizeRetryOptions(options.retry)
  };
}

export class ArenaHttpClient {
  private readonly options: InternalClientOptions;

  public constructor(options: InternalClientOptions) {
    this.options = options;
  }

  public setToken(token?: string): void {
    this.options.token = token;
  }

  public withToken(token?: string): ArenaHttpClient {
    return new ArenaHttpClient({
      ...this.options,
      token
    });
  }

  public getLegacyV2BaseUrl(): string {
    return this.options.legacyV2BaseUrl;
  }

  public request<T>(input: HttpRequestInput): Promise<T> {
    return this.requestWithRetry<T>(input, 0);
  }

  private async requestWithRetry<T>(
    input: HttpRequestInput,
    attempt: number
  ): Promise<T> {
    try {
      return await this.requestOnce<T>(input);
    } catch (error) {
      const canRetry = this.canRetry(error, attempt, input.signal);
      if (!canRetry) {
        throw error;
      }

      const delayMs = toDelayMs(
        this.options.retry.baseDelayMs * (2 ** attempt),
        this.options.retry.maxDelayMs
      );
      await sleep(delayMs);
      return this.requestWithRetry<T>(input, attempt + 1);
    }
  }

  private canRetry(
    error: unknown,
    attempt: number,
    signal?: AbortSignal
  ): boolean {
    if (signal?.aborted) {
      return false;
    }

    if (attempt >= this.options.retry.retries) {
      return false;
    }

    if (error instanceof ArenaApiError) {
      return this.options.retry.retryOn.includes(error.status as 429 | 500 | 502 | 503 | 504);
    }

    return !isAbortError(error);
  }

  private async requestOnce<T>(input: HttpRequestInput): Promise<T> {
    const { signal, cleanup } = this.createAbortSignal(input.signal);
    try {
      const response = await this.options.fetchImpl.call(
        globalThis,
        buildUrl(input.baseUrl ?? this.options.baseUrl, input.path, input.query),
        {
          method: input.method,
          headers: this.buildHeaders(input),
          body: this.buildBody(input),
          signal
        }
      );

      if (!response.ok) {
        throw await this.toApiError(response);
      }

      if (input.responseType === "void" || response.status === 204) {
        return undefined as T;
      }

      if (input.responseType === "text") {
        return (await response.text()) as T;
      }

      if (isJsonResponse(response)) {
        return (await response.json()) as T;
      }

      const text = await response.text();
      if (!text) {
        return undefined as T;
      }

      try {
        return JSON.parse(text) as T;
      } catch {
        return text as unknown as T;
      }
    } finally {
      cleanup();
    }
  }

  private buildHeaders(input: HttpRequestInput): Headers {
    const headers = new Headers(input.headers);

    if (!headers.has("Accept")) {
      headers.set("Accept", "application/json");
    }

    if (input.form && !headers.has("Content-Type")) {
      headers.set("Content-Type", "application/x-www-form-urlencoded");
    } else if (input.body !== undefined && !headers.has("Content-Type")) {
      headers.set("Content-Type", "application/json");
    }

    if (input.auth !== false && this.options.token && !headers.has("Authorization")) {
      headers.set("Authorization", `Bearer ${this.options.token}`);
    }

    if (
      this.options.userAgent &&
      typeof window === "undefined" &&
      !headers.has("User-Agent")
    ) {
      headers.set("User-Agent", this.options.userAgent);
    }

    return headers;
  }

  private buildBody(input: HttpRequestInput): BodyInit | undefined {
    if (input.form) {
      const formData = new URLSearchParams();
      for (const [key, value] of Object.entries(input.form)) {
        if (value === undefined || value === null) {
          continue;
        }

        if (Array.isArray(value)) {
          const serialized = value
            .filter((item) => isQueryPrimitive(item))
            .map((item) => String(item))
            .join(",");
          if (serialized.length > 0) {
            formData.set(key, serialized);
          }
          continue;
        }

        if (isQueryPrimitive(value)) {
          formData.set(key, String(value));
        }
      }
      return formData;
    }

    if (input.body === undefined) {
      return undefined;
    }

    if (
      input.body instanceof URLSearchParams ||
      input.body instanceof FormData ||
      input.body instanceof Blob ||
      typeof input.body === "string"
    ) {
      return input.body;
    }

    return JSON.stringify(input.body);
  }

  private createAbortSignal(signal?: AbortSignal): {
    signal: AbortSignal | undefined;
    cleanup: () => void;
  } {
    const timeoutMs = this.options.timeoutMs;
    if (!signal && timeoutMs <= 0) {
      return { signal: undefined, cleanup: () => undefined };
    }

    const controller = new AbortController();
    const onAbort = (): void => {
      controller.abort();
    };

    let timeoutHandle: ReturnType<typeof setTimeout> | undefined;
    if (timeoutMs > 0) {
      timeoutHandle = setTimeout(() => {
        controller.abort();
      }, timeoutMs);
    }

    if (signal) {
      if (signal.aborted) {
        controller.abort();
      } else {
        signal.addEventListener("abort", onAbort, { once: true });
      }
    }

    return {
      signal: controller.signal,
      cleanup: () => {
        if (timeoutHandle) {
          clearTimeout(timeoutHandle);
        }
        if (signal) {
          signal.removeEventListener("abort", onAbort);
        }
      }
    };
  }

  private async toApiError(response: Response): Promise<ArenaApiError> {
    const requestId = response.headers.get("X-Request-Id") ?? undefined;
    const rateLimit = extractRateLimit(response.headers);
    let raw: unknown;
    let message = `Request failed with status ${response.status}`;
    let code: number | undefined;
    let details: unknown;

    try {
      if (isJsonResponse(response)) {
        raw = await response.json();
      } else {
        raw = await response.text();
      }
    } catch {
      raw = undefined;
    }

    if (raw && typeof raw === "object") {
      const candidate = raw as Record<string, unknown>;
      if (typeof candidate.error === "string") {
        message = candidate.error;
      }
      if (typeof candidate.code === "number") {
        code = candidate.code;
      }
      details = candidate.details;
    } else if (typeof raw === "string" && raw.length > 0) {
      message = raw;
    }

    return new ArenaApiError(message, {
      status: response.status,
      code,
      details,
      rateLimit,
      requestId,
      raw
    });
  }
}
