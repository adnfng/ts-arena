# ts-arena API Shape (Reference)

## Import
```ts
import Arena, { createArenaClient, ArenaApiError } from 'ts-arena';
```

## Client
- `new Arena(options?)`
- `createArenaClient(options?)`
- `setToken(token?)`
- `withToken(token?)`

## V3 Surface
- `v3.auth.exchangeToken`
- `v3.system.ping`
- `v3.system.openapi`
- `v3.system.openapiJson`
- `v3.search.query`
- `v3.blocks.get`
- `v3.blocks.create`
- `v3.blocks.update`
- `v3.blocks.listComments`
- `v3.blocks.createComment`
- `v3.blocks.listConnections`
- `v3.blocks.createBatch`
- `v3.blocks.getBatch`
- `v3.channels.get`
- `v3.channels.create`
- `v3.channels.update`
- `v3.channels.remove`
- `v3.channels.listContents`
- `v3.channels.listConnections`
- `v3.channels.listFollowers`
- `v3.connections.get`
- `v3.connections.create`
- `v3.connections.move`
- `v3.connections.remove`
- `v3.comments.remove`
- `v3.users.getCurrent`
- `v3.users.get`
- `v3.users.listContents`
- `v3.users.listFollowers`
- `v3.users.listFollowing`
- `v3.groups.get`
- `v3.groups.listContents`
- `v3.groups.listFollowers`
- `v3.uploads.presign`

## Error Handling
- Catch `ArenaApiError`
- Read `status`, `details`, and `rateLimit`

