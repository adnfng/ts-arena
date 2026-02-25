---
name: ts-arena-sdk
description: Build and maintain integrations with the ts-arena TypeScript SDK. Use when users ask to implement Are.na API features in TypeScript/JavaScript apps, migrate raw HTTP calls to the SDK, design or review SDK usage, or add endpoints. Enforce V3-first usage through client.v3 and use client.legacyV2 only for documented missing V3 features.
---

# ts-arena-sdk

Implement Are.na integrations with `ts-arena` in a V3-first way.

## Follow This Contract
1. Import from `ts-arena` and instantiate the client once per app context.
2. Use `client.v3.*` for all standard functionality.
3. Use `client.legacyV2.*` only for known V3 gaps in `references/legacy-v2-gaps.md`.
4. Keep all new feature work in V3 modules unless a documented gap blocks progress.
5. Surface `ArenaApiError` details (`status`, `details`, `rateLimit`) in app error handling.

## Use This Default Pattern
```ts
import Arena from 'ts-arena';

const arena = new Arena({
  token: process.env.ARENA_TOKEN,
});
```

## Prefer These V3 Namespaces
- `v3.auth`
- `v3.system`
- `v3.search`
- `v3.blocks`
- `v3.channels`
- `v3.connections`
- `v3.comments`
- `v3.users`
- `v3.groups`
- `v3.uploads`

Read `references/public-api-shape.md` for the final method-level surface.

## Legacy V2 Policy
- Treat all `legacyV2` methods as deprecated.
- Add migration comments when touching legacy code paths.
- Do not auto-fallback from V3 calls into V2.

## Implementation Checklist
1. Select the smallest matching `v3` method for the request.
2. Keep request params typed and explicit.
3. Return paginated responses as-is unless caller asks to flatten.
4. If blocked by missing V3 endpoint, use the corresponding `legacyV2` method and document why.

