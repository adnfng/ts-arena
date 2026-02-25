import type { RequestOptions } from "../core/types.js";
import { ArenaHttpClient } from "../core/http.js";
import type {
  V3PaginatedConnectables,
  V3PaginatedFollowables,
  V3PaginatedUsers,
  V3PaginationSortQuery,
  V3User,
  V3UserContentsQuery,
  V3UserFollowingQuery
} from "./types.js";

export class ArenaV3UsersApi {
  public constructor(private readonly http: ArenaHttpClient) {}

  public getCurrent(options?: RequestOptions): Promise<V3User> {
    return this.http.request<V3User>({
      method: "GET",
      path: "/v3/me",
      headers: options?.headers,
      signal: options?.signal
    });
  }

  public get(
    input: { id: string | number },
    options?: RequestOptions
  ): Promise<V3User> {
    return this.http.request<V3User>({
      method: "GET",
      path: `/v3/users/${encodeURIComponent(String(input.id))}`,
      headers: options?.headers,
      signal: options?.signal
    });
  }

  public listContents(
    input: { id: string | number } & V3UserContentsQuery,
    options?: RequestOptions
  ): Promise<V3PaginatedConnectables> {
    const { id, ...query } = input;
    return this.http.request<V3PaginatedConnectables>({
      method: "GET",
      path: `/v3/users/${encodeURIComponent(String(id))}/contents`,
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
      path: `/v3/users/${encodeURIComponent(String(id))}/followers`,
      query,
      headers: options?.headers,
      signal: options?.signal
    });
  }

  public listFollowing(
    input: { id: string | number } & V3UserFollowingQuery,
    options?: RequestOptions
  ): Promise<V3PaginatedFollowables> {
    const { id, ...query } = input;
    return this.http.request<V3PaginatedFollowables>({
      method: "GET",
      path: `/v3/users/${encodeURIComponent(String(id))}/following`,
      query,
      headers: options?.headers,
      signal: options?.signal
    });
  }
}
