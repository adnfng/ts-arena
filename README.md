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

## Design

- `v3.*` is the primary API surface.
- `legacyV2.*` is explicit fallback only for known V3 gaps.
- Legacy methods are marked deprecated in typings.

## Legacy Example

```ts
// @deprecated method surface
const collaborators = await arena.legacyV2.channels.getCollaborators({ id: "12345" });
```

## Error Handling

```ts
import Arena, { ArenaApiError } from "ts-arena";

try {
  await arena.v3.system.ping();
} catch (error) {
  if (error instanceof ArenaApiError) {
    console.error(error.status, error.details, error.rateLimit);
  }
}
```
