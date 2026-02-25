# TSARENA-AGENTS

This project uses `ts-arena`, an unofficial TypeScript SDK for the Are.na API.

## Package goals

- Use Are.na V3 as the default API surface.
- Only use V2 through `legacyV2` for missing V3 features.
- Keep code typed and explicit around auth, pagination, and error handling.

## Required usage pattern

Use the default import:

```ts
import Arena from "ts-arena";
```

Instantiate once per runtime and share it across modules:

```ts
const arena = new Arena({
  token: process.env.ARENA_TOKEN
});
```

## API surface policy

- Preferred: `arena.v3.*`
- Fallback only: `arena.legacyV2.*`
- If a request can be satisfied in V3, do not add a V2 call.
- Any new V2 usage must include a short comment explaining the V3 gap.

## Auth policy

- Use Bearer token auth via `token` option.
- Never hardcode tokens.
- Read tokens from environment variables.
- If a token is missing, fail clearly with a setup instruction.

## Error handling policy

- Catch `ArenaApiError` for API failures.
- Log or surface:
  - `status`
  - `code`
  - `details`
  - `rateLimit` metadata when present
- For write operations, return actionable error messages to callers.

## Pagination policy

- Explicitly pass pagination options (`page`, `per`, `sort`) where supported.
- Do not assume full datasets in one response.
- For sync jobs, loop on pagination metadata until completion.

## Browser and server usage

- `ts-arena` supports both Node and modern browsers.
- In browser apps, proxy tokens through your backend when possible.
- Do not expose privileged tokens in client-side code.

## Contribution constraints

- Keep new features V3-first.
- Put V2 additions only under `legacyV2` and mark as deprecated where relevant.
- Add tests for route/method/path behavior when extending namespaces.
- Keep public API predictable and avoid breaking import paths.
