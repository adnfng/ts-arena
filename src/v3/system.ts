import type { RequestOptions } from "../core/types.js";
import { ArenaHttpClient } from "../core/http.js";
import type { V3PingResponse } from "./types.js";

export class ArenaV3SystemApi {
  public constructor(private readonly http: ArenaHttpClient) {}

  public ping(options?: RequestOptions): Promise<V3PingResponse> {
    return this.http.request<V3PingResponse>({
      method: "GET",
      path: "/v3/ping",
      headers: options?.headers,
      signal: options?.signal
    });
  }

  public openapi(options?: RequestOptions): Promise<string> {
    return this.http.request<string>({
      method: "GET",
      path: "/v3/openapi",
      responseType: "text",
      headers: {
        Accept: "application/yaml, text/yaml, text/plain, */*",
        ...(options?.headers ?? {})
      },
      signal: options?.signal
    });
  }

  public openapiJson(options?: RequestOptions): Promise<unknown> {
    return this.http.request<unknown>({
      method: "GET",
      path: "/v3/openapi.json",
      headers: options?.headers,
      signal: options?.signal
    });
  }
}
