import { ArenaHttpClient } from "../core/http.js";
import { ArenaLegacyV2ChannelsApi } from "./channels.js";
import { ArenaLegacyV2UsersApi } from "./users.js";

export interface ArenaLegacyV2Namespace {
  readonly channels: ArenaLegacyV2ChannelsApi;
  readonly users: ArenaLegacyV2UsersApi;
}

export class ArenaLegacyV2Client implements ArenaLegacyV2Namespace {
  public readonly channels: ArenaLegacyV2ChannelsApi;
  public readonly users: ArenaLegacyV2UsersApi;

  public constructor(http: ArenaHttpClient) {
    this.channels = new ArenaLegacyV2ChannelsApi(http);
    this.users = new ArenaLegacyV2UsersApi(http);
  }
}

export * from "./types.js";
