<div align="center">
  <img src="./logo.svg" alt="ts-arena logo" width="64" height="64" />
  <h2>ts-arena</h2>
  <p>V3-first TypeScript SDK for the Are.na API, with explicit legacy V2 fallbacks.</p>
  <a href="https://github.com/adnfng/ts-arena">GitHub</a> |
  <a href="https://www.are.na/developers/explore">Are.na V3 Explorer</a> |
  <a href="https://api.are.na/v3/openapi.json">V3 OpenAPI Spec</a>
</div>

---

## Table of contents

- [What is ts-arena?](#what-is-ts-arena)
- [Installation](#installation)
- [Getting started](#getting-started)
- [Authentication](#authentication)
- [Client configuration](#client-configuration)
- [API reference](#api-reference)
- [V3 endpoint coverage (34 operations)](#v3-endpoint-coverage-34-operations)
- [Legacy V2 fallback (deprecated)](#legacy-v2-fallback-deprecated)
- [Agent setup](#agent-setup)
- [Error handling](#error-handling)
- [Development](#development)

## What is ts-arena?

`ts-arena` is an unofficial, typed SDK for Are.na with a strict surface policy:

- `arena.v3.*` is the default interface.
- `arena.legacyV2.*` exists only for missing V3 features.
- Browser and Node runtimes are both supported (`fetch` based).

Are.na currently labels V3 as work in progress, so endpoint behavior may change over time.

## Installation

```bash
npm install ts-arena
```

If you are using the GitHub repository directly:

```bash
npm install github:adnfng/ts-arena
```

## Getting started

```ts
import Arena from "ts-arena";

const arena = new Arena({
  token: process.env.ARENA_TOKEN
});

const channel = await arena.v3.channels.get({ id: "arena-influences" });
console.log(channel.title);
```

## Authentication

Most API operations need a bearer token.

### Personal access token (recommended for server scripts)

1. Create an app at <https://dev.are.na/oauth/applications/new>
2. Copy your personal access token
3. Pass it to the client via `token`

```ts
import Arena from "ts-arena";

const arena = new Arena({ token: process.env.ARENA_TOKEN });
```

### OAuth token exchange

`v3.auth.exchangeToken` is the one V3 method that does not require an existing bearer token.

```ts
import Arena from "ts-arena";

const arena = new Arena();

const tokenResponse = await arena.v3.auth.exchangeToken({
  grant_type: "client_credentials",
  client_id: process.env.ARENA_CLIENT_ID,
  client_secret: process.env.ARENA_CLIENT_SECRET
});

const authedArena = arena.withToken(tokenResponse.access_token);
const me = await authedArena.v3.users.getCurrent();
```

## Client configuration

```ts
import Arena from "ts-arena";

const arena = new Arena({
  token: process.env.ARENA_TOKEN,
  baseUrl: "https://api.are.na",
  legacyV2BaseUrl: "https://api.are.na",
  timeoutMs: 30_000,
  retry: {
    retries: 1,
    baseDelayMs: 250,
    maxDelayMs: 4_000
  }
});
```

### Options

| Option | Type | Default | Notes |
| --- | --- | --- | --- |
| `token` | `string` | `undefined` | Bearer token for authenticated calls |
| `baseUrl` | `string` | `https://api.are.na` | Base URL for V3 calls |
| `legacyV2BaseUrl` | `string` | `https://api.are.na` | Base URL for legacy V2 calls |
| `timeoutMs` | `number` | `30000` | Request timeout |
| `fetch` | `typeof fetch` | global `fetch` | Override fetch implementation |
| `retry` | `object` | disabled (`retries: 0`) | Retry policy for 429/5xx responses |

## API reference

### Main client namespaces

| Namespace | Purpose |
| --- | --- |
| `v3.auth` | OAuth token exchange |
| `v3.system` | Ping + OpenAPI endpoints |
| `v3.search` | Search |
| `v3.blocks` | Block CRUD, comments, connections, batch |
| `v3.channels` | Channel CRUD + followers/connections/contents |
| `v3.connections` | Connection CRUD + move |
| `v3.comments` | Comment deletion |
| `v3.users` | Current user + user followers/following/contents |
| `v3.groups` | Group lookup + followers/contents |
| `v3.uploads` | Upload presign |
| `legacyV2.channels` | Deprecated V2 channel gap methods |
| `legacyV2.users` | Deprecated V2 user gap methods |

### Selected examples

```ts
// Search
await arena.v3.search.query({
  query: "brutalism",
  type: ["Channel", "Image"],
  page: 1,
  per: 24
});

// Create block
await arena.v3.blocks.create({
  value: "https://example.com/article",
  title: "Example article",
  channel_ids: ["my-channel-slug"]
});

// Move connection
await arena.v3.connections.move({
  id: 12345,
  body: { movement: "move_to_top" }
});
```

## V3 endpoint coverage (34 operations)

Auth information below follows the V3 OpenAPI document as of February 25, 2026.

### `v3.auth`

| SDK method | HTTP route | Auth |
| --- | --- | --- |
| `arena.v3.auth.exchangeToken(input)` | `POST /v3/oauth/token` | Not required |

### `v3.system`

| SDK method | HTTP route | Auth |
| --- | --- | --- |
| `arena.v3.system.ping()` | `GET /v3/ping` | Required |
| `arena.v3.system.openapi()` | `GET /v3/openapi` | Required |
| `arena.v3.system.openapiJson()` | `GET /v3/openapi.json` | Required |

### `v3.search`

| SDK method | HTTP route | Auth |
| --- | --- | --- |
| `arena.v3.search.query(input)` | `GET /v3/search` | Required |

### `v3.blocks`

| SDK method | HTTP route | Auth |
| --- | --- | --- |
| `arena.v3.blocks.get({ id })` | `GET /v3/blocks/{id}` | Required |
| `arena.v3.blocks.create(body)` | `POST /v3/blocks` | Required |
| `arena.v3.blocks.update({ id, body })` | `PUT /v3/blocks/{id}` | Required |
| `arena.v3.blocks.listComments({ id, ...query })` | `GET /v3/blocks/{id}/comments` | Required |
| `arena.v3.blocks.createComment({ id, body })` | `POST /v3/blocks/{id}/comments` | Required |
| `arena.v3.blocks.listConnections({ id, ...query })` | `GET /v3/blocks/{id}/connections` | Required |
| `arena.v3.blocks.createBatch(body)` | `POST /v3/blocks/batch` | Required |
| `arena.v3.blocks.getBatch({ batchId })` | `GET /v3/blocks/batch/{batch_id}` | Required |

### `v3.channels`

| SDK method | HTTP route | Auth |
| --- | --- | --- |
| `arena.v3.channels.get({ id })` | `GET /v3/channels/{id}` | Required |
| `arena.v3.channels.create(body)` | `POST /v3/channels` | Required |
| `arena.v3.channels.update({ id, body })` | `PUT /v3/channels/{id}` | Required |
| `arena.v3.channels.remove({ id })` | `DELETE /v3/channels/{id}` | Required |
| `arena.v3.channels.listContents({ id, ...query })` | `GET /v3/channels/{id}/contents` | Required |
| `arena.v3.channels.listConnections({ id, ...query })` | `GET /v3/channels/{id}/connections` | Required |
| `arena.v3.channels.listFollowers({ id, ...query })` | `GET /v3/channels/{id}/followers` | Required |

### `v3.connections`

| SDK method | HTTP route | Auth |
| --- | --- | --- |
| `arena.v3.connections.get({ id })` | `GET /v3/connections/{id}` | Required |
| `arena.v3.connections.create(body)` | `POST /v3/connections` | Required |
| `arena.v3.connections.move({ id, body })` | `POST /v3/connections/{id}/move` | Required |
| `arena.v3.connections.remove({ id })` | `DELETE /v3/connections/{id}` | Required |

### `v3.comments`

| SDK method | HTTP route | Auth |
| --- | --- | --- |
| `arena.v3.comments.remove({ id })` | `DELETE /v3/comments/{id}` | Required |

### `v3.users`

| SDK method | HTTP route | Auth |
| --- | --- | --- |
| `arena.v3.users.getCurrent()` | `GET /v3/me` | Required |
| `arena.v3.users.get({ id })` | `GET /v3/users/{id}` | Required |
| `arena.v3.users.listContents({ id, ...query })` | `GET /v3/users/{id}/contents` | Required |
| `arena.v3.users.listFollowers({ id, ...query })` | `GET /v3/users/{id}/followers` | Required |
| `arena.v3.users.listFollowing({ id, ...query })` | `GET /v3/users/{id}/following` | Required |

### `v3.groups`

| SDK method | HTTP route | Auth |
| --- | --- | --- |
| `arena.v3.groups.get({ id })` | `GET /v3/groups/{id}` | Required |
| `arena.v3.groups.listContents({ id, ...query })` | `GET /v3/groups/{id}/contents` | Required |
| `arena.v3.groups.listFollowers({ id, ...query })` | `GET /v3/groups/{id}/followers` | Required |

### `v3.uploads`

| SDK method | HTTP route | Auth |
| --- | --- | --- |
| `arena.v3.uploads.presign(body)` | `POST /v3/uploads/presign` | Required |

## Legacy V2 fallback (deprecated)

`legacyV2` methods are intentionally separate and deprecated. Use them only if V3 does not yet support the feature.

| SDK method | HTTP route | Auth guidance |
| --- | --- | --- |
| `arena.legacyV2.channels.list()` | `GET /v2/channels` | Token recommended |
| `arena.legacyV2.channels.thumb({ slug })` | `GET /v2/channels/{slug}/thumb` | Token recommended |
| `arena.legacyV2.channels.getCollaborators({ id })` | `GET /v2/channels/{id}/collaborators` | Token typically required |
| `arena.legacyV2.channels.addCollaborator({ id, userId })` | `POST /v2/channels/{id}/collaborators` | Token required |
| `arena.legacyV2.channels.removeCollaborator({ id, userId })` | `DELETE /v2/channels/{id}/collaborators` | Token required |
| `arena.legacyV2.users.primaryChannel({ id })` | `GET /v2/users/{id}/channel` | Token recommended |

## Agent setup

If you use coding agents (Codex, Claude Code, Cursor), generate a project-level file with package-specific instructions:

```bash
npx ts-arena init-agents
```

This creates `TSARENA-AGENTS.md` in the current project root.

## Error handling

```ts
import Arena, { ArenaApiError } from "ts-arena";

try {
  await arena.v3.system.ping();
} catch (error) {
  if (error instanceof ArenaApiError) {
    console.error("status", error.status);
    console.error("code", error.code);
    console.error("details", error.details);
    console.error("rateLimit", error.rateLimit);
  }
}
```

`ArenaApiError` includes:

- `status`
- `code`
- `details`
- `rateLimit` (`limit`, `tier`, `windowSeconds`, `resetUnix`, `retryAfterSeconds`)

## Development

```bash
npm install
npm run typecheck
npm run test
npm run build
```

Contributions should follow the V3-first policy. New V2 methods belong only in `legacyV2` and should be marked deprecated.
