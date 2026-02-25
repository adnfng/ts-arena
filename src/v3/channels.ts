import type { RequestOptions } from "../core/types.js";
import { ArenaHttpClient } from "../core/http.js";
import type {
  V3Channel,
  V3ChannelContentsQuery,
  V3CreateChannelInput,
  V3PaginatedChannels,
  V3PaginatedConnectables,
  V3PaginatedUsers,
  V3PaginationSortQuery,
  V3UpdateChannelInput
} from "./types.js";

export class ArenaV3ChannelsApi {
  public constructor(private readonly http: ArenaHttpClient) {}

  public get(
    input: { id: string | number },
    options?: RequestOptions
  ): Promise<V3Channel> {
    return this.http.request<V3Channel>({
      method: "GET",
      path: `/v3/channels/${encodeURIComponent(String(input.id))}`,
      headers: options?.headers,
      signal: options?.signal
    });
  }

  public create(
    input: V3CreateChannelInput,
    options?: RequestOptions
  ): Promise<V3Channel> {
    return this.http.request<V3Channel>({
      method: "POST",
      path: "/v3/channels",
      body: input,
      headers: options?.headers,
      signal: options?.signal
    });
  }

  public update(
    input: { id: string | number; body: V3UpdateChannelInput },
    options?: RequestOptions
  ): Promise<V3Channel> {
    return this.http.request<V3Channel>({
      method: "PUT",
      path: `/v3/channels/${encodeURIComponent(String(input.id))}`,
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
      path: `/v3/channels/${encodeURIComponent(String(input.id))}`,
      responseType: "void",
      headers: options?.headers,
      signal: options?.signal
    });
  }

  public listContents(
    input: { id: string | number } & V3ChannelContentsQuery,
    options?: RequestOptions
  ): Promise<V3PaginatedConnectables> {
    const { id, ...query } = input;
    return this.http.request<V3PaginatedConnectables>({
      method: "GET",
      path: `/v3/channels/${encodeURIComponent(String(id))}/contents`,
      query,
      headers: options?.headers,
      signal: options?.signal
    });
  }

  public listConnections(
    input: { id: string | number } & V3PaginationSortQuery,
    options?: RequestOptions
  ): Promise<V3PaginatedChannels> {
    const { id, ...query } = input;
    return this.http.request<V3PaginatedChannels>({
      method: "GET",
      path: `/v3/channels/${encodeURIComponent(String(id))}/connections`,
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
      path: `/v3/channels/${encodeURIComponent(String(id))}/followers`,
      query,
      headers: options?.headers,
      signal: options?.signal
    });
  }
}
