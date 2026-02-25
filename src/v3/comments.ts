import type { RequestOptions } from "../core/types.js";
import { ArenaHttpClient } from "../core/http.js";

export class ArenaV3CommentsApi {
  public constructor(private readonly http: ArenaHttpClient) {}

  public remove(
    input: { id: string | number },
    options?: RequestOptions
  ): Promise<void> {
    return this.http.request<void>({
      method: "DELETE",
      path: `/v3/comments/${encodeURIComponent(String(input.id))}`,
      responseType: "void",
      headers: options?.headers,
      signal: options?.signal
    });
  }
}
