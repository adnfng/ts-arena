# TSARENA-AGENTS

Use this file when writing or reviewing code that uses `ts-arena`.

## Core rules

- Import with `import Arena from "ts-arena"`.
- Prefer `arena.v3.*`.
- Use `arena.legacyV2.*` only for missing V3 capabilities.
- Never hardcode tokens.
- Read token from environment/config (`ARENA_TOKEN`).

## Client setup

```ts
import Arena from "ts-arena";

const arena = new Arena({
  token: process.env.ARENA_TOKEN
});
```

Reuse one client instance per runtime.

## Auth model (important)

The official v3 docs define three auth levels:

- `Public`: no auth required
- `Optional`: works unauthenticated, but auth can unlock additional permissioned data
- `Required`: returns `401` without valid token

Do not assume every endpoint needs bearer auth.

Agent behavior:

- If token exists, send authenticated requests by default.
- If token is missing, `Public` and `Optional` endpoints may still succeed.
- For `Required` endpoints, prompt for auth setup when token is missing.
- Always handle `401`, `403`, and `429`.

## V3 method auth map (34 methods)

| SDK method | HTTP route | Auth level |
| --- | --- | --- |
| `arena.v3.auth.exchangeToken(input)` | `POST /v3/oauth/token` | Public |
| `arena.v3.system.ping()` | `GET /v3/ping` | Public |
| `arena.v3.system.openapi()` | `GET /v3/openapi` | Public |
| `arena.v3.system.openapiJson()` | `GET /v3/openapi.json` | Public |
| `arena.v3.search.query(input)` | `GET /v3/search` | Optional |
| `arena.v3.blocks.get({ id })` | `GET /v3/blocks/{id}` | Optional |
| `arena.v3.blocks.create(body)` | `POST /v3/blocks` | Required |
| `arena.v3.blocks.update({ id, body })` | `PUT /v3/blocks/{id}` | Required |
| `arena.v3.blocks.listComments({ id, ...query })` | `GET /v3/blocks/{id}/comments` | Optional |
| `arena.v3.blocks.createComment({ id, body })` | `POST /v3/blocks/{id}/comments` | Required |
| `arena.v3.blocks.listConnections({ id, ...query })` | `GET /v3/blocks/{id}/connections` | Optional |
| `arena.v3.blocks.createBatch(body)` | `POST /v3/blocks/batch` | Required |
| `arena.v3.blocks.getBatch({ batchId })` | `GET /v3/blocks/batch/{batch_id}` | Required |
| `arena.v3.channels.get({ id })` | `GET /v3/channels/{id}` | Optional |
| `arena.v3.channels.create(body)` | `POST /v3/channels` | Required |
| `arena.v3.channels.update({ id, body })` | `PUT /v3/channels/{id}` | Required |
| `arena.v3.channels.remove({ id })` | `DELETE /v3/channels/{id}` | Required |
| `arena.v3.channels.listContents({ id, ...query })` | `GET /v3/channels/{id}/contents` | Optional |
| `arena.v3.channels.listConnections({ id, ...query })` | `GET /v3/channels/{id}/connections` | Optional |
| `arena.v3.channels.listFollowers({ id, ...query })` | `GET /v3/channels/{id}/followers` | Optional |
| `arena.v3.connections.get({ id })` | `GET /v3/connections/{id}` | Optional |
| `arena.v3.connections.create(body)` | `POST /v3/connections` | Required |
| `arena.v3.connections.move({ id, body })` | `POST /v3/connections/{id}/move` | Required |
| `arena.v3.connections.remove({ id })` | `DELETE /v3/connections/{id}` | Required |
| `arena.v3.comments.remove({ id })` | `DELETE /v3/comments/{id}` | Required |
| `arena.v3.users.getCurrent()` | `GET /v3/me` | Required |
| `arena.v3.users.get({ id })` | `GET /v3/users/{id}` | Optional |
| `arena.v3.users.listContents({ id, ...query })` | `GET /v3/users/{id}/contents` | Optional |
| `arena.v3.users.listFollowers({ id, ...query })` | `GET /v3/users/{id}/followers` | Optional |
| `arena.v3.users.listFollowing({ id, ...query })` | `GET /v3/users/{id}/following` | Optional |
| `arena.v3.groups.get({ id })` | `GET /v3/groups/{id}` | Optional |
| `arena.v3.groups.listContents({ id, ...query })` | `GET /v3/groups/{id}/contents` | Optional |
| `arena.v3.groups.listFollowers({ id, ...query })` | `GET /v3/groups/{id}/followers` | Optional |
| `arena.v3.uploads.presign(body)` | `POST /v3/uploads/presign` | Required |

## Legacy V2 fallback map (deprecated)

| SDK method | HTTP route | Auth guidance |
| --- | --- | --- |
| `arena.legacyV2.channels.list()` | `GET /v2/channels` | Optional/Token recommended |
| `arena.legacyV2.channels.thumb({ slug })` | `GET /v2/channels/{slug}/thumb` | Optional/Token recommended |
| `arena.legacyV2.channels.getCollaborators({ id })` | `GET /v2/channels/{id}/collaborators` | Required |
| `arena.legacyV2.channels.addCollaborator({ id, userId })` | `POST /v2/channels/{id}/collaborators` | Required |
| `arena.legacyV2.channels.removeCollaborator({ id, userId })` | `DELETE /v2/channels/{id}/collaborators` | Required |
| `arena.legacyV2.users.primaryChannel({ id })` | `GET /v2/users/{id}/channel` | Optional/Token recommended |

## Pagination and errors

- List endpoints use `page` and `per` (`per` max 100).
- Expect `{ data, meta }` pagination shape.
- Handle status codes: `400`, `401`, `403`, `404`, `429`.

## Contribution constraints

- V3-first always.
- New V2 methods only in `legacyV2` and keep deprecated annotations.
- Add tests for route mapping and auth behavior when extending SDK.
