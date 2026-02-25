# TSARENA-AGENTS

Use this file as the source of truth when an agent writes code with `ts-arena`.

## Core rules

- Import with `import Arena from "ts-arena"`.
- Default to `arena.v3.*` methods.
- Use `arena.legacyV2.*` only for missing V3 features.
- Never hardcode tokens.
- Read tokens from env (`ARENA_TOKEN`) or secure runtime config.

## Quick setup

```ts
import Arena from "ts-arena";

const arena = new Arena({
  token: process.env.ARENA_TOKEN
});
```

Reuse one client instance per runtime.

## Auth model

According to the current V3 OpenAPI (`/v3/openapi.json`), all V3 operations require bearer auth except OAuth token exchange.

- No token needed: `arena.v3.auth.exchangeToken(...)`
- Token required: all other `arena.v3.*` calls

If a token is missing, agents should fail fast with a setup message.

## V3 endpoint map (34 operations)

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

## Legacy V2 fallback map (deprecated)

Use only when there is no V3 equivalent.

| SDK method | HTTP route | Auth guidance |
| --- | --- | --- |
| `arena.legacyV2.channels.list()` | `GET /v2/channels` | Token recommended |
| `arena.legacyV2.channels.thumb({ slug })` | `GET /v2/channels/{slug}/thumb` | Token recommended |
| `arena.legacyV2.channels.getCollaborators({ id })` | `GET /v2/channels/{id}/collaborators` | Token typically required |
| `arena.legacyV2.channels.addCollaborator({ id, userId })` | `POST /v2/channels/{id}/collaborators` | Token required |
| `arena.legacyV2.channels.removeCollaborator({ id, userId })` | `DELETE /v2/channels/{id}/collaborators` | Token required |
| `arena.legacyV2.users.primaryChannel({ id })` | `GET /v2/users/{id}/channel` | Token recommended |

## Error handling

Catch `ArenaApiError` and surface:

- `status`
- `code`
- `details`
- `rateLimit` (`limit`, `tier`, `windowSeconds`, `resetUnix`, `retryAfterSeconds`)

## Pagination and query behavior

- Pass explicit pagination/query fields (`page`, `per`, `sort`) where supported.
- Array query params are serialized as comma-separated values.
- Do not assume a single response contains all results.

## Browser usage

- The SDK supports browser and Node runtimes.
- In browser apps, avoid exposing privileged tokens.
- Prefer backend proxy patterns for authenticated operations.

## Extension policy for agents

- Add new methods under `v3` first.
- Add `legacyV2` methods only as explicit deprecated fallbacks.
- Include tests for method/route/auth behavior when extending the SDK.
