import type { RequestOptions } from "../core/types.js";
import { ArenaHttpClient } from "../core/http.js";
import type {
  V3Group,
  V3GroupContentsQuery,
  V3PaginatedConnectables,
  V3PaginatedUsers,
  V3PaginationSortQuery
} from "./types.js";

export class ArenaV3GroupsApi {
  public constructor(private readonly http: ArenaHttpClient) {}

  public get(
    input: { id: string | number },
    options?: RequestOptions
  ): Promise<V3Group> {
    return this.http.request<V3Group>({
      method: "GET",
      path: `/v3/groups/${encodeURIComponent(String(input.id))}`,
      headers: options?.headers,
      signal: options?.signal
    });
  }

  public listContents(
    input: { id: string | number } & V3GroupContentsQuery,
    options?: RequestOptions
  ): Promise<V3PaginatedConnectables> {
    const { id, ...query } = input;
    return this.http.request<V3PaginatedConnectables>({
      method: "GET",
      path: `/v3/groups/${encodeURIComponent(String(id))}/contents`,
      query,
      headers: options?.headers,
      signal: options?.signal
    });
  }

  public listFollowers(
    input: { id: string | number } & V3PaginationSortQuery,
    options?: RequestOptions
  ): Promise<V3PaginatedUsers> {
    const { id, ...query } = input;
    return this.http.request<V3PaginatedUsers>({
      method: "GET",
      path: `/v3/groups/${encodeURIComponent(String(id))}/followers`,
      query,
      headers: options?.headers,
      signal: options?.signal
    });
  }
}
