import test from "node:test";
import assert from "node:assert/strict";
import Arena from "../dist/esm/index.js";
import { createMockFetch, toHeaders } from "./helpers/mock-fetch.js";

test("v3.blocks methods hit expected routes and payloads", async () => {
  const { fetch, calls } = createMockFetch([
    { body: { id: 1 } },
    {
      body: {
        data: [],
        meta: {
          current_page: 1,
          per_page: 5,
          total_pages: 1,
          total_count: 0,
          next_page: null,
          prev_page: null,
          has_more_pages: false
        }
      }
    },
    { body: { id: 2 } },
    { body: { id: 3 } },
    { body: { id: "batch-1", state: "processing" } }
  ]);

  const arena = new Arena({ token: "tkn", fetch });
  await arena.v3.blocks.get({ id: 1 });
  await arena.v3.blocks.listComments({ id: 1, page: 1, per: 5 });
  await arena.v3.blocks.create({
    value: "https://example.com",
    channel_ids: [123],
    title: "Title"
  });
  await arena.v3.blocks.createBatch({
    channel_ids: [123],
    blocks: [{ value: "Hello" }]
  });
  await arena.v3.blocks.getBatch({ batchId: "batch-1" });

  assert.equal(calls.length, 5);

  assert.match(calls[0].url, /\/v3\/blocks\/1$/);
  assert.equal(calls[0].init.method, "GET");

  assert.match(calls[1].url, /\/v3\/blocks\/1\/comments\?page=1&per=5$/);
  assert.equal(calls[1].init.method, "GET");

  assert.match(calls[2].url, /\/v3\/blocks$/);
  assert.equal(calls[2].init.method, "POST");
  assert.deepEqual(JSON.parse(String(calls[2].init.body)), {
    value: "https://example.com",
    channel_ids: [123],
    title: "Title"
  });

  assert.match(calls[3].url, /\/v3\/blocks\/batch$/);
  assert.equal(calls[3].init.method, "POST");

  assert.match(calls[4].url, /\/v3\/blocks\/batch\/batch-1$/);
  assert.equal(calls[4].init.method, "GET");
});

test("v3.channels and v3.connections methods route correctly", async () => {
  const { fetch, calls } = createMockFetch([
    { body: { id: "ch-1" } },
    { body: { id: "ch-1" } },
    { body: "", init: { status: 204 } },
    {
      body: {
        data: [],
        meta: {
          current_page: 1,
          per_page: 10,
          total_pages: 1,
          total_count: 0,
          next_page: null,
          prev_page: null,
          has_more_pages: false
        }
      }
    },
    { body: { data: [{ id: 42 }] } },
    { body: { id: 42 } },
    { body: "", init: { status: 204 } }
  ]);

  const arena = new Arena({ token: "tkn", fetch });
  await arena.v3.channels.create({ title: "My Channel" });
  await arena.v3.channels.update({ id: "my-channel", body: { title: "Updated" } });
  await arena.v3.channels.remove({ id: "my-channel" });
  await arena.v3.channels.listContents({ id: "my-channel", page: 1, per: 10, sort: "position_asc" });
  const createdConnections = await arena.v3.connections.create({
    connectable_id: 10,
    connectable_type: "Block",
    channel_ids: [12]
  });
  await arena.v3.connections.move({ id: 42, body: { movement: "move_to_top" } });
  await arena.v3.connections.remove({ id: 42 });

  assert.equal(createdConnections.length, 1);
  assert.equal(calls.length, 7);

  assert.match(calls[0].url, /\/v3\/channels$/);
  assert.equal(calls[0].init.method, "POST");

  assert.match(calls[1].url, /\/v3\/channels\/my-channel$/);
  assert.equal(calls[1].init.method, "PUT");

  assert.match(calls[2].url, /\/v3\/channels\/my-channel$/);
  assert.equal(calls[2].init.method, "DELETE");

  assert.match(calls[3].url, /\/v3\/channels\/my-channel\/contents\?page=1&per=10&sort=position_asc$/);
  assert.equal(calls[3].init.method, "GET");

  assert.match(calls[4].url, /\/v3\/connections$/);
  assert.equal(calls[4].init.method, "POST");

  assert.match(calls[5].url, /\/v3\/connections\/42\/move$/);
  assert.equal(calls[5].init.method, "POST");

  assert.match(calls[6].url, /\/v3\/connections\/42$/);
  assert.equal(calls[6].init.method, "DELETE");
});

test("v3.users, v3.groups, v3.search, and v3.system route correctly", async () => {
  const { fetch, calls } = createMockFetch([
    { body: { id: "me" } },
    { body: { id: "user-1" } },
    {
      body: {
        data: [],
        meta: {
          current_page: 1,
          per_page: 24,
          total_pages: 1,
          total_count: 0,
          next_page: null,
          prev_page: null,
          has_more_pages: false
        }
      }
    },
    { body: { id: "grp-1" } },
    {
      body: {
        data: [],
        meta: {
          current_page: 1,
          per_page: 24,
          total_pages: 1,
          total_count: 0,
          next_page: null,
          prev_page: null,
          has_more_pages: false
        }
      }
    },
    {
      body: {
        data: [],
        meta: {
          current_page: 1,
          per_page: 24,
          total_pages: 1,
          total_count: 0,
          next_page: null,
          prev_page: null,
          has_more_pages: false
        }
      }
    },
    { body: "openapi: 3.1.0", kind: "text" }
  ]);

  const arena = new Arena({ token: "tkn", fetch });
  await arena.v3.users.getCurrent();
  await arena.v3.users.get({ id: "user-1" });
  await arena.v3.users.listFollowing({ id: "user-1", type: "Channel", page: 1, per: 24 });
  await arena.v3.groups.get({ id: "grp-1" });
  await arena.v3.groups.listContents({ id: "grp-1", type: "Channel", page: 1, per: 24 });
  await arena.v3.search.query({ query: "design", type: ["Channel", "User"] });
  const openapi = await arena.v3.system.openapi();

  assert.equal(openapi, "openapi: 3.1.0");
  assert.equal(calls.length, 7);

  assert.match(calls[0].url, /\/v3\/me$/);
  assert.match(calls[1].url, /\/v3\/users\/user-1$/);
  assert.match(calls[2].url, /\/v3\/users\/user-1\/following\?type=Channel&page=1&per=24$/);
  assert.match(calls[3].url, /\/v3\/groups\/grp-1$/);
  assert.match(calls[4].url, /\/v3\/groups\/grp-1\/contents\?type=Channel&page=1&per=24$/);
  assert.match(calls[5].url, /\/v3\/search\?query=design&type=Channel%2CUser$/);
  assert.match(calls[6].url, /\/v3\/openapi$/);
  assert.equal(toHeaders(calls[6].init.headers).get("accept")?.includes("yaml"), true);
});
