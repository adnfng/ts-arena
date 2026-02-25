import type { RequestOptions } from "../core/types.js";
import { ArenaHttpClient } from "../core/http.js";
import type {
  V3PaginatedSearch,
  V3SearchQuery
} from "./types.js";

export class ArenaV3SearchApi {
  public constructor(private readonly http: ArenaHttpClient) {}

  public query(
    input: V3SearchQuery = {},
    options?: RequestOptions
  ): Promise<V3PaginatedSearch> {
    return this.http.request<V3PaginatedSearch>({
      method: "GET",
      path: "/v3/search",
      query: input,
      headers: options?.headers,
      signal: options?.signal
    });
  }
}
