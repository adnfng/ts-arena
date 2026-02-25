import type { RequestOptions } from "../core/types.js";
import { ArenaHttpClient } from "../core/http.js";
import type {
  LegacyV2ChannelListResponse,
  LegacyV2ChannelThumbResponse,
  LegacyV2CollaboratorAddResponse,
  LegacyV2CollaboratorListResponse
} from "./types.js";

export class ArenaLegacyV2ChannelsApi {
  public constructor(private readonly http: ArenaHttpClient) {}

  /**
   * @deprecated Use v3 endpoints whenever possible.
   */
  public list(options?: RequestOptions): Promise<LegacyV2ChannelListResponse> {
    return this.http.request<LegacyV2ChannelListResponse>({
      method: "GET",
      path: "/v2/channels",
      baseUrl: this.http.getLegacyV2BaseUrl(),
      headers: options?.headers,
      signal: options?.signal
    });
  }

  /**
   * @deprecated Use v3 endpoints whenever possible.
   */
  public thumb(
    input: { slug: string },
    options?: RequestOptions
  ): Promise<LegacyV2ChannelThumbResponse> {
    return this.http.request<LegacyV2ChannelThumbResponse>({
      method: "GET",
      path: `/v2/channels/${encodeURIComponent(input.slug)}/thumb`,
      baseUrl: this.http.getLegacyV2BaseUrl(),
      headers: options?.headers,
      signal: options?.signal
    });
  }

  /**
   * @deprecated Use v3 endpoints whenever possible.
   */
  public getCollaborators(
    input: { id: string | number },
    options?: RequestOptions
  ): Promise<LegacyV2CollaboratorListResponse> {
    return this.http.request<LegacyV2CollaboratorListResponse>({
      method: "GET",
      path: `/v2/channels/${encodeURIComponent(String(input.id))}/collaborators`,
      baseUrl: this.http.getLegacyV2BaseUrl(),
      headers: options?.headers,
      signal: options?.signal
    });
  }

  /**
   * @deprecated Use v3 endpoints whenever possible.
   */
  public addCollaborator(
    input: { id: string | number; userId: string | number },
    options?: RequestOptions
  ): Promise<LegacyV2CollaboratorAddResponse> {
    return this.http.request<LegacyV2CollaboratorAddResponse>({
      method: "POST",
      path: `/v2/channels/${encodeURIComponent(String(input.id))}/collaborators`,
      baseUrl: this.http.getLegacyV2BaseUrl(),
      body: { user_id: input.userId },
      headers: options?.headers,
      signal: options?.signal
    });
  }

  /**
   * @deprecated Use v3 endpoints whenever possible.
   */
  public removeCollaborator(
    input: { id: string | number; userId: string | number },
    options?: RequestOptions
  ): Promise<void> {
    return this.http.request<void>({
      method: "DELETE",
      path: `/v2/channels/${encodeURIComponent(String(input.id))}/collaborators`,
      baseUrl: this.http.getLegacyV2BaseUrl(),
      query: { user_id: String(input.userId) },
      responseType: "void",
      headers: options?.headers,
      signal: options?.signal
    });
  }
}
