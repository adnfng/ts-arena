<div align="center">
  <img src="./logo.svg" alt="ts-arena logo" width="64" height="64" />
  <h2>ts-arena</h2>
  <p>V3-first TypeScript SDK for the Are.na API.</p>
  <a href="https://github.com/adnfng/ts-arena">GitHub</a> |
  <a href="https://www.are.na/developers/explore">Are.na V3 Explorer</a> |
  <a href="https://api.are.na/v3/openapi.json">V3 OpenAPI Spec</a>
</div>

---

## Table of contents

- [What is ts-arena?](#what-is-ts-arena)
- [Current status](#current-status)
- [Features](#features)
- [Installation](#installation)
- [Quick start](#quick-start)
- [Client configuration](#client-configuration)
- [API overview](#api-overview)
- [V3 examples](#v3-examples)
- [Legacy V2 fallback](#legacy-v2-fallback)
- [Error handling](#error-handling)
- [Development](#development)
- [Contributing](#contributing)

## What is ts-arena?

`ts-arena` is an unofficial, strongly-typed Are.na SDK focused on the current V3 API.

The project is intentionally structured around:

- `client.v3.*` as the default and primary interface
- `client.legacyV2.*` as explicit fallback only for known V3 gaps
- predictable request behavior for Node and browser runtimes

## Current status

- V3 client implemented against the current published V3 spec
- Explicit legacy V2 namespace implemented for gap endpoints
- Route-level mock tests and runtime behavior tests included
- Not published to npm yet

## Features

- V3-first design (`v3` namespace is the core API surface)
- Explicit deprecated V2 fallback (`legacyV2` namespace)
- Works in Node 18+ and modern browsers (`fetch` based)
- Built-in timeout/retry options
- Normalized error class (`ArenaApiError`) with rate-limit metadata
- ESM + CommonJS builds

## Installation

Until npm publication, install directly from GitHub:

```bash
npm install github:adnfng/ts-arena
```

After npm publish, install will be:

```bash
npm install ts-arena
```

## Quick start

```ts
import Arena from "ts-arena";

const arena = new Arena({
  token: process.env.ARENA_TOKEN
});

const channel = await arena.v3.channels.get({ id: "arena-influences" });
console.log(channel);
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
| `fetch` | `fetch` | global `fetch` | Inject custom fetch (tests/runtime) |
| `retry` | `object` | disabled (`retries: 0`) | Retry policy for 429/5xx responses |

## API overview

### V3 namespaces

| Namespace | Methods |
| --- | --- |
| `v3.auth` | `exchangeToken` |
| `v3.system` | `ping`, `openapi`, `openapiJson` |
| `v3.search` | `query` |
| `v3.blocks` | `get`, `create`, `update`, `listComments`, `createComment`, `listConnections`, `createBatch`, `getBatch` |
| `v3.channels` | `get`, `create`, `update`, `remove`, `listContents`, `listConnections`, `listFollowers` |
| `v3.connections` | `get`, `create`, `move`, `remove` |
| `v3.comments` | `remove` |
| `v3.users` | `getCurrent`, `get`, `listContents`, `listFollowers`, `listFollowing` |
| `v3.groups` | `get`, `listContents`, `listFollowers` |
| `v3.uploads` | `presign` |

### Legacy V2 namespace (deprecated fallback)

| Namespace | Methods |
| --- | --- |
| `legacyV2.channels` | `list`, `thumb`, `getCollaborators`, `addCollaborator`, `removeCollaborator` |
| `legacyV2.users` | `primaryChannel` |

## V3 examples

### Search

```ts
const result = await arena.v3.search.query({
  query: "brutalism",
  type: ["Channel", "Image"],
  page: 1,
  per: 24
});
```

### Create a block and connect it

```ts
const block = await arena.v3.blocks.create({
  value: "https://example.com/article",
  title: "Example article",
  channel_ids: ["my-channel-slug"]
});
```

### Move a connection

```ts
await arena.v3.connections.move({
  id: 12345,
  body: {
    movement: "move_to_top"
  }
});
```

### Presign uploads

```ts
const presigned = await arena.v3.uploads.presign({
  files: [
    { filename: "image.jpg", content_type: "image/jpeg" }
  ]
});
```

## Legacy V2 fallback

`legacyV2` exists to cover endpoints that are not currently available in V3.  
It is intentionally explicit and typed as deprecated.

```ts
// Deprecated fallback surface by design
const collaborators = await arena.legacyV2.channels.getCollaborators({ id: 12345 });
```

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

## Contributing

Issues and pull requests are welcome.  
If you add endpoint support, prefer V3 first and keep any new V2 fallback explicit under `legacyV2`.
