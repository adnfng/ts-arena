import type { RequestOptions } from "../core/types.js";
import { ArenaHttpClient } from "../core/http.js";
import type {
  V3BatchCreateResponse,
  V3BatchStatusResponse,
  V3Block,
  V3BlockConnectionsQuery,
  V3CreateBatchInput,
  V3CreateBlockInput,
  V3CreateCommentInput,
  V3Comment,
  V3PaginatedComments,
  V3PaginatedConnectables,
  V3PaginationInput,
  V3UpdateBlockInput
} from "./types.js";

export class ArenaV3BlocksApi {
  public constructor(private readonly http: ArenaHttpClient) {}

  public get(
    input: { id: string | number },
    options?: RequestOptions
  ): Promise<V3Block> {
    return this.http.request<V3Block>({
      method: "GET",
      path: `/v3/blocks/${encodeURIComponent(String(input.id))}`,
      headers: options?.headers,
      signal: options?.signal
    });
  }

  public create(
    input: V3CreateBlockInput,
    options?: RequestOptions
  ): Promise<V3Block> {
    return this.http.request<V3Block>({
      method: "POST",
      path: "/v3/blocks",
      body: input,
      headers: options?.headers,
      signal: options?.signal
    });
  }

  public update(
    input: { id: string | number; body: V3UpdateBlockInput },
    options?: RequestOptions
  ): Promise<V3Block> {
    return this.http.request<V3Block>({
      method: "PUT",
      path: `/v3/blocks/${encodeURIComponent(String(input.id))}`,
      body: input.body,
      headers: options?.headers,
      signal: options?.signal
    });
  }

  public listComments(
    input: { id: string | number } & V3PaginationInput,
    options?: RequestOptions
  ): Promise<V3PaginatedComments> {
    const { id, ...query } = input;
    return this.http.request<V3PaginatedComments>({
      method: "GET",
      path: `/v3/blocks/${encodeURIComponent(String(id))}/comments`,
      query,
      headers: options?.headers,
      signal: options?.signal
    });
  }

  public createComment(
    input: { id: string | number; body: V3CreateCommentInput },
    options?: RequestOptions
  ): Promise<V3Comment> {
    return this.http.request<V3Comment>({
      method: "POST",
      path: `/v3/blocks/${encodeURIComponent(String(input.id))}/comments`,
      body: input.body,
      headers: options?.headers,
      signal: options?.signal
    });
  }

  public listConnections(
    input: { id: string | number } & V3BlockConnectionsQuery,
    options?: RequestOptions
  ): Promise<V3PaginatedConnectables> {
    const { id, ...query } = input;
    return this.http.request<V3PaginatedConnectables>({
      method: "GET",
      path: `/v3/blocks/${encodeURIComponent(String(id))}/connections`,
      query,
      headers: options?.headers,
      signal: options?.signal
    });
  }

  public createBatch(
    input: V3CreateBatchInput,
    options?: RequestOptions
  ): Promise<V3BatchCreateResponse> {
    return this.http.request<V3BatchCreateResponse>({
      method: "POST",
      path: "/v3/blocks/batch",
      body: input,
      headers: options?.headers,
      signal: options?.signal
    });
  }

  public getBatch(
    input: { batchId: string | number },
    options?: RequestOptions
  ): Promise<V3BatchStatusResponse> {
    return this.http.request<V3BatchStatusResponse>({
      method: "GET",
      path: `/v3/blocks/batch/${encodeURIComponent(String(input.batchId))}`,
      headers: options?.headers,
      signal: options?.signal
    });
  }
}
