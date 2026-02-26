import type { PaginatedResult } from "../core/types.js";

export type V3Entity = Record<string, unknown>;
export type V3Block = V3Entity;
export type V3Channel = V3Entity;
export type V3Connection = V3Entity;
export type V3Comment = V3Entity;
export type V3User = V3Entity;
export type V3Group = V3Entity;
export type V3SearchEntity = V3Entity;
export type V3Connectable = V3Entity;
export type V3Followable = V3Entity;
export type V3PingResponse = V3Entity;
export type V3BatchCreateResponse = V3Entity;
export type V3BatchStatusResponse = V3Entity;

export type ChannelId = string | number;

export type ConnectionSort = "created_at_desc" | "created_at_asc";
export type ContentSort =
  | "created_at_asc"
  | "created_at_desc"
  | "updated_at_asc"
  | "updated_at_desc";
export type ChannelContentSort =
  | "position_asc"
  | "position_desc"
  | "created_at_asc"
  | "created_at_desc"
  | "updated_at_asc"
  | "updated_at_desc";
export type ContentTypeFilter =
  | "Text"
  | "Image"
  | "Link"
  | "Attachment"
  | "Embed"
  | "Channel"
  | "Block";
export type FollowableType = "User" | "Channel" | "Group";
export type ConnectableType = "Block" | "Channel";
export type Movement =
  | "insert_at"
  | "move_to_top"
  | "move_to_bottom"
  | "move_up"
  | "move_down";
export type SearchTypeFilter =
  | "All"
  | "Text"
  | "Image"
  | "Link"
  | "Attachment"
  | "Embed"
  | "Channel"
  | "Block"
  | "User"
  | "Group";
export type SearchScope = "all" | "my" | "following";
export type SearchSort =
  | "score_desc"
  | "created_at_desc"
  | "created_at_asc"
  | "updated_at_desc"
  | "updated_at_asc"
  | "name_asc"
  | "name_desc"
  | "connections_count_desc"
  | "random";
export type ConnectionFilter = "ALL" | "OWN" | "EXCLUDE_OWN";
export type ChannelVisibility = "public" | "private" | "closed";
export type OAuthGrantType = "authorization_code" | "client_credentials";

export interface V3PaginationInput {
  page?: number;
  per?: number;
}

export interface V3PaginationSortQuery extends V3PaginationInput {
  sort?: ConnectionSort;
}

export interface V3ChannelContentsQuery extends V3PaginationInput {
  sort?: ChannelContentSort;
  user_id?: number;
}

export interface V3UserContentsQuery extends V3PaginationInput {
  sort?: ContentSort;
  type?: ContentTypeFilter;
}

export interface V3GroupContentsQuery extends V3PaginationInput {
  sort?: ContentSort;
  type?: ContentTypeFilter;
}

export interface V3UserFollowingQuery extends V3PaginationSortQuery {
  type?: FollowableType;
}

export interface V3BlockConnectionsQuery extends V3PaginationSortQuery {
  filter?: ConnectionFilter;
}

export interface V3SearchQuery extends V3PaginationInput {
  query?: string;
  type?: SearchTypeFilter[];
  scope?: SearchScope;
  user_id?: number;
  group_id?: number;
  channel_id?: number;
  ext?: string[];
  sort?: SearchSort;
  after?: string;
  seed?: number;
}

export interface V3BlockInput {
  value: string;
  title?: string;
  description?: string;
  original_source_url?: string;
  original_source_title?: string;
  alt_text?: string;
}

export interface V3CreateBlockInput extends V3BlockInput {
  channel_ids: ChannelId[];
  insert_at?: number;
}

export interface V3BatchBlockInput extends V3BlockInput {}

export interface V3CreateBatchInput {
  channel_ids: ChannelId[];
  blocks: V3BatchBlockInput[];
}

export interface V3UpdateBlockInput {
  title?: string;
  description?: string;
  content?: string;
  alt_text?: string;
}

export interface V3CreateCommentInput {
  body: string;
}

export interface V3CreateChannelInput {
  title: string;
  visibility?: ChannelVisibility;
  description?: string;
  group_id?: number;
}

export interface V3UpdateChannelInput {
  title?: string;
  visibility?: ChannelVisibility;
  description?: string;
}

export interface V3CreateConnectionInput {
  connectable_id: number;
  connectable_type: ConnectableType;
  channel_ids: ChannelId[];
  position?: number;
}

export interface V3CreateConnectionResponse {
  data: V3Connection[];
}

export interface V3MoveConnectionInput {
  movement?: Movement;
  position?: number;
}

export interface V3PresignFile {
  filename: string;
  content_type: string;
}

export interface V3PresignInput {
  files: V3PresignFile[];
}

export interface V3PresignedFile {
  upload_url: string;
  key: string;
  content_type: string;
}

export interface V3PresignResponse {
  files: V3PresignedFile[];
  expires_in: number;
}

export interface V3ExchangeTokenInput {
  grant_type: OAuthGrantType;
  client_id?: string;
  client_secret?: string;
  code?: string;
  redirect_uri?: string;
  code_verifier?: string;
}

export interface V3TokenResponse {
  access_token: string;
  token_type: string;
  scope: string;
  created_at: number;
  [key: string]: unknown;
}

export type V3PaginatedBlocks = PaginatedResult<V3Block>;
export type V3PaginatedChannels = PaginatedResult<V3Channel>;
export type V3PaginatedConnections = PaginatedResult<V3Connection>;
export type V3PaginatedComments = PaginatedResult<V3Comment>;
export type V3PaginatedUsers = PaginatedResult<V3User>;
export type V3PaginatedGroups = PaginatedResult<V3Group>;
export type V3PaginatedConnectables = PaginatedResult<V3Connectable>;
export type V3PaginatedFollowables = PaginatedResult<V3Followable>;
export type V3PaginatedSearch = PaginatedResult<V3SearchEntity>;
