import type { RequestOptions } from "../core/types.js";
import { ArenaHttpClient } from "../core/http.js";
import type { V3PresignInput, V3PresignResponse } from "./types.js";

const TEMP_SOURCE_BASE_URL = "https://s3.amazonaws.com/arena_images-temp";

function encodeS3Key(key: string): string {
  const normalizedKey = key.replace(/^\/+/, "");
  return normalizedKey
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/");
}

export function toTempSourceUrl(key: string): string {
  return `${TEMP_SOURCE_BASE_URL}/${encodeS3Key(key)}`;
}

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

  public toTempSourceUrl(key: string): string {
    return toTempSourceUrl(key);
  }
}
