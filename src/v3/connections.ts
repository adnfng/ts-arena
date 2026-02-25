import type { RequestOptions } from "../core/types.js";
import { ArenaHttpClient } from "../core/http.js";
import type {
  V3Connection,
  V3CreateConnectionInput,
  V3CreateConnectionResponse,
  V3MoveConnectionInput
} from "./types.js";

export class ArenaV3ConnectionsApi {
  public constructor(private readonly http: ArenaHttpClient) {}

  public get(
    input: { id: string | number },
    options?: RequestOptions
  ): Promise<V3Connection> {
    return this.http.request<V3Connection>({
      method: "GET",
      path: `/v3/connections/${encodeURIComponent(String(input.id))}`,
      headers: options?.headers,
      signal: options?.signal
    });
  }

  public async create(
    input: V3CreateConnectionInput,
    options?: RequestOptions
  ): Promise<V3Connection[]> {
    const response = await this.http.request<V3CreateConnectionResponse>({
      method: "POST",
      path: "/v3/connections",
      body: input,
      headers: options?.headers,
      signal: options?.signal
    });
    return response.data;
  }

  public move(
    input: { id: string | number; body: V3MoveConnectionInput },
    options?: RequestOptions
  ): Promise<V3Connection> {
    return this.http.request<V3Connection>({
      method: "POST",
      path: `/v3/connections/${encodeURIComponent(String(input.id))}/move`,
      body: input.body,
      headers: options?.headers,
      signal: options?.signal
    });
  }

  public remove(
    input: { id: string | number },
    options?: RequestOptions
  ): Promise<void> {
    return this.http.request<void>({
      method: "DELETE",
      path: `/v3/connections/${encodeURIComponent(String(input.id))}`,
      responseType: "void",
      headers: options?.headers,
      signal: options?.signal
    });
  }
}
