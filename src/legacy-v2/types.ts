export type LegacyV2Entity = Record<string, unknown>;
export type LegacyV2Channel = LegacyV2Entity;
export type LegacyV2User = LegacyV2Entity;

export interface LegacyV2ChannelListResponse extends LegacyV2Entity {}
export interface LegacyV2ChannelThumbResponse extends LegacyV2Entity {}
export interface LegacyV2CollaboratorListResponse extends LegacyV2Entity {}
export interface LegacyV2CollaboratorAddResponse extends LegacyV2Entity {}
