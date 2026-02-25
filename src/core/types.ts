export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export type QueryPrimitive = string | number | boolean;
export type QueryValue =
  | QueryPrimitive
  | null
  | undefined
  | ReadonlyArray<QueryPrimitive>;
export type QueryParams = Record<string, QueryValue>;

export interface PaginationMeta {
  current_page: number;
  per_page: number;
  total_pages: number;
  total_count: number;
  next_page: number | null;
  prev_page: number | null;
  has_more_pages: boolean;
}

export interface PaginatedResult<T> {
  data: T[];
  meta: PaginationMeta;
}

export interface RequestOptions {
  signal?: AbortSignal;
  headers?: Record<string, string>;
}

export interface ArenaRateLimit {
  limit?: number;
  tier?: "guest" | "free" | "premium" | "supporter";
  windowSeconds?: number;
  resetUnix?: number;
  retryAfterSeconds?: number;
}

export interface RetryOptions {
  retries?: number;
  baseDelayMs?: number;
  maxDelayMs?: number;
  retryOn?: Array<429 | 500 | 502 | 503 | 504>;
}

export interface ArenaClientOptions {
  token?: string;
  baseUrl?: string;
  legacyV2BaseUrl?: string;
  timeoutMs?: number;
  userAgent?: string;
  fetch?: typeof globalThis.fetch;
  retry?: RetryOptions;
}

export interface InternalClientOptions {
  token?: string;
  baseUrl: string;
  legacyV2BaseUrl: string;
  timeoutMs: number;
  userAgent?: string;
  fetchImpl: typeof globalThis.fetch;
  retry: Required<RetryOptions>;
}

export interface HttpRequestInput {
  method: HttpMethod;
  path: string;
  query?: object;
  body?: unknown;
  form?: object;
  headers?: Record<string, string>;
  signal?: AbortSignal;
  auth?: boolean;
  responseType?: "json" | "text" | "void";
  baseUrl?: string;
}
