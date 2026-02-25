import type { RequestOptions } from "../core/types.js";
import { ArenaHttpClient } from "../core/http.js";
import type { V3ExchangeTokenInput, V3TokenResponse } from "./types.js";

export class ArenaV3AuthApi {
  public constructor(private readonly http: ArenaHttpClient) {}

  public exchangeToken(
    input: V3ExchangeTokenInput,
    options?: RequestOptions
  ): Promise<V3TokenResponse> {
    return this.http.request<V3TokenResponse>({
      method: "POST",
      path: "/v3/oauth/token",
      form: input,
      auth: false,
      headers: options?.headers,
      signal: options?.signal
    });
  }
}
