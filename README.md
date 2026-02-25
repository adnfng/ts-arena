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
- [Rate limiting](#rate-limiting)
- [Client configuration](#client-configuration)
- [V3 endpoint auth matrix (34 methods)](#v3-endpoint-auth-matrix-34-methods)
- [Legacy V2 fallback (deprecated)](#legacy-v2-fallback-deprecated)
- [Agent setup](#agent-setup)
- [Error handling](#error-handling)
- [Development](#development)

## What is ts-arena?

`ts-arena` is an unofficial typed SDK for Are.na's v3 API with one policy:

- Use `arena.v3.*` first.
- Use `arena.legacyV2.*` only for gaps.

Are.na explicitly marks v3 as a work in progress, so breaking changes can happen.

## Installation

```bash
npm install ts-arena
```

GitHub install:

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

Base URL: `https://api.are.na`

The official v3 docs describe three auth levels:

- `Public`: no token needed
- `Optional`: works without token, but token can unlock permissioned/private data
- `Required`: returns `401` without valid token

Use bearer auth when available:

```http
Authorization: Bearer YOUR_TOKEN
```

Supported token sources:

- OAuth2 access token
- Personal access token (`are.na/settings/oauth`)

OAuth2 note:

- Authorize endpoint: `https://www.are.na/oauth/authorize`
- Token endpoint: `https://api.are.na/v3/oauth/token`

Practical SDK rule:

- Pass a token by default in server apps.
- For read-only/public workflows, calls can still succeed without a token on `Public`/`Optional` routes.
- Always handle `401` and `403`.

## Rate limiting

The docs define per-minute limits by tier:

| Tier | Requests/min |
| --- | --- |
| Guest (unauthenticated) | 30 |
| Free | 120 |
| Premium | 300 |
| Supporter/Lifetime | 600 |

Relevant response headers:

- `X-RateLimit-Limit`
- `X-RateLimit-Tier`
- `X-RateLimit-Window`
- `X-RateLimit-Reset`

`ts-arena` surfaces these values on `ArenaApiError.rateLimit`.

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
| `retry` | `object` | disabled (`retries: 0`) | Retry policy for 429/5xx |

## V3 endpoint auth matrix (34 methods)

Auth levels below follow the official v3 docs model (`Public / Optional / Required`) and are aligned to SDK methods.
Because v3 is actively evolving, treat this as guidance and handle runtime `401/403`.

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

## Legacy V2 fallback (deprecated)

Use only when V3 cannot satisfy the feature.

| SDK method | HTTP route | Auth guidance |
| --- | --- | --- |
| `arena.legacyV2.channels.list()` | `GET /v2/channels` | Optional/Token recommended |
| `arena.legacyV2.channels.thumb({ slug })` | `GET /v2/channels/{slug}/thumb` | Optional/Token recommended |
| `arena.legacyV2.channels.getCollaborators({ id })` | `GET /v2/channels/{id}/collaborators` | Required |
| `arena.legacyV2.channels.addCollaborator({ id, userId })` | `POST /v2/channels/{id}/collaborators` | Required |
| `arena.legacyV2.channels.removeCollaborator({ id, userId })` | `DELETE /v2/channels/{id}/collaborators` | Required |
| `arena.legacyV2.users.primaryChannel({ id })` | `GET /v2/users/{id}/channel` | Optional/Token recommended |

## Agent setup

Generate package-specific guidance for coding agents:

```bash
npx ts-arena init-agents
```

This writes `TSARENA-AGENTS.md` in the current project root.

## Error handling

```ts
import Arena, { ArenaApiError } from "ts-arena";

try {
  await arena.v3.users.getCurrent();
} catch (error) {
  if (error instanceof ArenaApiError) {
    console.error("status", error.status);
    console.error("code", error.code);
    console.error("details", error.details);
    console.error("rateLimit", error.rateLimit);
  }
}
```

Common status codes:

- `400` invalid request
- `401` missing/invalid auth
- `403` insufficient permissions
- `404` missing resource
- `429` rate limited

## Development

```bash
npm install
npm run typecheck
npm run test
npm run build
```

Contributions should stay V3-first. Add V2 only under `legacyV2` and mark it deprecated.
