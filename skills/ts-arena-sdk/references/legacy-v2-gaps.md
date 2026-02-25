# legacyV2 Gaps (Allowed Scope)

Use `client.legacyV2.*` only for these missing V3 capabilities:

- `legacyV2.channels.list` (`GET /v2/channels`)
- `legacyV2.channels.thumb` (`GET /v2/channels/:slug/thumb`)
- `legacyV2.channels.getCollaborators` (`GET /v2/channels/:id/collaborators`)
- `legacyV2.channels.addCollaborator` (`POST /v2/channels/:id/collaborators`)
- `legacyV2.channels.removeCollaborator` (`DELETE /v2/channels/:id/collaborators`)
- `legacyV2.users.primaryChannel` (`GET /v2/users/:id/channel`)

Rules:
- Mark all legacy usage as deprecated in code comments and docs.
- Do not add new legacy endpoints without updating the SDK plan and public API contract.
- Prefer partial V3 replacements when possible.

