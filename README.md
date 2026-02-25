# ts-arena

V3-first TypeScript SDK for the Are.na API.

## Install

```bash
npm install ts-arena
```

## Quick Start

```ts
import Arena from "ts-arena";

const arena = new Arena({
  token: process.env.ARENA_TOKEN
});

const channel = await arena.v3.channels.get({ id: "my-channel-slug" });
console.log(channel);
```

## Why this SDK

- V3-first API surface under `client.v3.*`
- Explicit V2 fallback under `client.legacyV2.*` for known gaps only
- Isomorphic fetch runtime (Node + browser)
- Strong TypeScript signatures for params and options

## Client Setup

```ts
import Arena from "ts-arena";

const arena = new Arena({
  token: process.env.ARENA_TOKEN,
  baseUrl: "https://api.are.na",
  legacyV2BaseUrl: "https://api.are.na",
  timeoutMs: 30_000,
  retry: {
    retries: 1
  }
});
```

You can also build clients via:

```ts
import { createArenaClient } from "ts-arena";

const arena = createArenaClient({ token: process.env.ARENA_TOKEN });
```

## Authentication

- Pass bearer token once in constructor options (`token`)
- Override token at runtime:

```ts
arena.setToken("new-token");

const withDifferentToken = arena.withToken("another-token");
```

## API Namespaces

### V3 (primary)

- `v3.auth.exchangeToken`
- `v3.system.ping`, `v3.system.openapi`, `v3.system.openapiJson`
- `v3.search.query`
- `v3.blocks.*` (`get`, `create`, `update`, comments/connections, batch)
- `v3.channels.*` (`get`, `create`, `update`, `remove`, list subresources)
- `v3.connections.*` (`get`, `create`, `move`, `remove`)
- `v3.comments.remove`
- `v3.users.*` (`getCurrent`, `get`, list subresources)
- `v3.groups.*` (`get`, list subresources)
- `v3.uploads.presign`

### legacyV2 (deprecated fallback)

All methods are intentionally deprecated and explicit.

- `legacyV2.channels.list`
- `legacyV2.channels.thumb`
- `legacyV2.channels.getCollaborators`
- `legacyV2.channels.addCollaborator`
- `legacyV2.channels.removeCollaborator`
- `legacyV2.users.primaryChannel`

## Usage Examples

### V3 search

```ts
const search = await arena.v3.search.query({
  query: "brutalism",
  type: ["Channel", "Image"],
  page: 1,
  per: 24
});
```

### V3 create block and connect to channel

```ts
const block = await arena.v3.blocks.create({
  value: "https://example.com/article",
  channel_ids: ["my-channel"],
  title: "Article"
});
```

### Legacy V2 fallback

```ts
// Deprecated fallback surface by design
const collaborators = await arena.legacyV2.channels.getCollaborators({ id: 12345 });
```

## Error Handling

```ts
import Arena, { ArenaApiError } from "ts-arena";

try {
  await arena.v3.system.ping();
} catch (error) {
  if (error instanceof ArenaApiError) {
    console.error("status", error.status);
    console.error("details", error.details);
    console.error("rateLimit", error.rateLimit);
  }
}
```

`ArenaApiError` normalizes HTTP failures and includes:

- `status`
- `code`
- `details`
- `rateLimit` metadata (when available)

## Development

```bash
npm install
npm run typecheck
npm run test
```

## Notes

- This SDK follows the V3 explorer and spec as source of truth.
- Because V3 is evolving, minor releases may add endpoint coverage as spec updates land.
