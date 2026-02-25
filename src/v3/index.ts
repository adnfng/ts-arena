import { ArenaHttpClient } from "../core/http.js";
import { ArenaV3AuthApi } from "./auth.js";
import { ArenaV3BlocksApi } from "./blocks.js";
import { ArenaV3ChannelsApi } from "./channels.js";
import { ArenaV3CommentsApi } from "./comments.js";
import { ArenaV3ConnectionsApi } from "./connections.js";
import { ArenaV3GroupsApi } from "./groups.js";
import { ArenaV3SearchApi } from "./search.js";
import { ArenaV3SystemApi } from "./system.js";
import { ArenaV3UploadsApi } from "./uploads.js";
import { ArenaV3UsersApi } from "./users.js";

export interface ArenaV3Namespace {
  readonly auth: ArenaV3AuthApi;
  readonly blocks: ArenaV3BlocksApi;
  readonly channels: ArenaV3ChannelsApi;
  readonly comments: ArenaV3CommentsApi;
  readonly connections: ArenaV3ConnectionsApi;
  readonly groups: ArenaV3GroupsApi;
  readonly search: ArenaV3SearchApi;
  readonly system: ArenaV3SystemApi;
  readonly uploads: ArenaV3UploadsApi;
  readonly users: ArenaV3UsersApi;
}

export class ArenaV3Client implements ArenaV3Namespace {
  public readonly auth: ArenaV3AuthApi;
  public readonly blocks: ArenaV3BlocksApi;
  public readonly channels: ArenaV3ChannelsApi;
  public readonly comments: ArenaV3CommentsApi;
  public readonly connections: ArenaV3ConnectionsApi;
  public readonly groups: ArenaV3GroupsApi;
  public readonly search: ArenaV3SearchApi;
  public readonly system: ArenaV3SystemApi;
  public readonly uploads: ArenaV3UploadsApi;
  public readonly users: ArenaV3UsersApi;

  public constructor(http: ArenaHttpClient) {
    this.auth = new ArenaV3AuthApi(http);
    this.blocks = new ArenaV3BlocksApi(http);
    this.channels = new ArenaV3ChannelsApi(http);
    this.comments = new ArenaV3CommentsApi(http);
    this.connections = new ArenaV3ConnectionsApi(http);
    this.groups = new ArenaV3GroupsApi(http);
    this.search = new ArenaV3SearchApi(http);
    this.system = new ArenaV3SystemApi(http);
    this.uploads = new ArenaV3UploadsApi(http);
    this.users = new ArenaV3UsersApi(http);
  }
}

export * from "./types.js";
