import { ArenaHttpClient, normalizeClientOptions } from "./core/http.js";
import type { ArenaClientOptions } from "./core/types.js";
import { ArenaV3Client, type ArenaV3Namespace } from "./v3/index.js";
import { ArenaLegacyV2Client, type ArenaLegacyV2Namespace } from "./legacy-v2/index.js";

export type {
  ArenaClientOptions,
  ArenaRateLimit,
  HttpMethod,
  PaginatedResult,
  PaginationMeta,
  QueryParams,
  QueryPrimitive,
  QueryValue,
  RequestOptions,
  RetryOptions
} from "./core/types.js";
export { ArenaApiError } from "./core/errors.js";

export * from "./v3/types.js";
export * from "./legacy-v2/types.js";
export type { ArenaV3Namespace } from "./v3/index.js";
export type { ArenaLegacyV2Namespace } from "./legacy-v2/index.js";

export interface ArenaClient {
  readonly v3: ArenaV3Namespace;
  readonly legacyV2: ArenaLegacyV2Namespace;
  setToken(token?: string): void;
  withToken(token?: string): ArenaClient;
}

export class Arena implements ArenaClient {
  public readonly v3: ArenaV3Namespace;
  public readonly legacyV2: ArenaLegacyV2Namespace;
  private readonly http: ArenaHttpClient;
  private readonly options: ArenaClientOptions;

  public constructor(options: ArenaClientOptions = {}) {
    this.options = { ...options };
    this.http = new ArenaHttpClient(normalizeClientOptions(options));
    this.v3 = new ArenaV3Client(this.http);
    this.legacyV2 = new ArenaLegacyV2Client(this.http);
  }

  public setToken(token?: string): void {
    this.http.setToken(token);
    this.options.token = token;
  }

  public withToken(token?: string): ArenaClient {
    return createArenaClient({
      ...this.options,
      token
    });
  }
}

export function createArenaClient(options: ArenaClientOptions = {}): ArenaClient {
  return new Arena(options);
}

export default Arena;
