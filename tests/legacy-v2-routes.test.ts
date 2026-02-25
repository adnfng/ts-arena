import test from "node:test";
import assert from "node:assert/strict";
import Arena from "../src/index.js";
import { createMockFetch } from "./helpers/mock-fetch.js";

test("legacyV2 routes target v2 endpoints and custom base URL", async () => {
  const { fetch, calls } = createMockFetch([
    { body: { channels: [] } },
    { body: { id: 1 } },
    { body: { users: [] } },
    { body: { users: [] } },
    { body: "", init: { status: 204 } },
    { body: { id: 10 } }
  ]);

  const arena = new Arena({
    token: "legacy-token",
    legacyV2BaseUrl: "https://legacy.example.com",
    fetch
  });

  await arena.legacyV2.channels.list();
  await arena.legacyV2.channels.thumb({ slug: "arena-influences" });
  await arena.legacyV2.channels.getCollaborators({ id: 123 });
  await arena.legacyV2.channels.addCollaborator({ id: 123, userId: 456 });
  await arena.legacyV2.channels.removeCollaborator({ id: 123, userId: 456 });
  await arena.legacyV2.users.primaryChannel({ id: "user-1" });

  assert.equal(calls.length, 6);
  assert.match(calls[0].url, /^https:\/\/legacy\.example\.com\/v2\/channels$/);
  assert.match(calls[1].url, /^https:\/\/legacy\.example\.com\/v2\/channels\/arena-influences\/thumb$/);
  assert.match(calls[2].url, /^https:\/\/legacy\.example\.com\/v2\/channels\/123\/collaborators$/);
  assert.match(calls[3].url, /^https:\/\/legacy\.example\.com\/v2\/channels\/123\/collaborators$/);
  assert.equal(calls[3].init.method, "POST");
  assert.deepEqual(JSON.parse(String(calls[3].init.body)), { user_id: 456 });
  assert.match(calls[4].url, /^https:\/\/legacy\.example\.com\/v2\/channels\/123\/collaborators\?user_id=456$/);
  assert.equal(calls[4].init.method, "DELETE");
  assert.match(calls[5].url, /^https:\/\/legacy\.example\.com\/v2\/users\/user-1\/channel$/);
});
