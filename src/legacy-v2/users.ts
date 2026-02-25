import type { RequestOptions } from "../core/types.js";
import { ArenaHttpClient } from "../core/http.js";
import type { LegacyV2Channel } from "./types.js";

export class ArenaLegacyV2UsersApi {
  public constructor(private readonly http: ArenaHttpClient) {}

  /**
   * @deprecated Use v3 endpoints whenever possible.
   */
  public primaryChannel(
    input: { id: string | number },
    options?: RequestOptions
  ): Promise<LegacyV2Channel> {
    return this.http.request<LegacyV2Channel>({
      method: "GET",
      path: `/v2/users/${encodeURIComponent(String(input.id))}/channel`,
      baseUrl: this.http.getLegacyV2BaseUrl(),
      headers: options?.headers,
      signal: options?.signal
    });
  }
}
