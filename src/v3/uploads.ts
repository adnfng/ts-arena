import type { RequestOptions } from "../core/types.js";
import { ArenaHttpClient } from "../core/http.js";
import type { V3PresignInput, V3PresignResponse } from "./types.js";

export class ArenaV3UploadsApi {
  public constructor(private readonly http: ArenaHttpClient) {}

  public presign(
    input: V3PresignInput,
    options?: RequestOptions
  ): Promise<V3PresignResponse> {
    return this.http.request<V3PresignResponse>({
      method: "POST",
      path: "/v3/uploads/presign",
      body: input,
      headers: options?.headers,
      signal: options?.signal
    });
  }
}
