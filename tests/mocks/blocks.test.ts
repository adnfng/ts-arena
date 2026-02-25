import test from "node:test";
import assert from "node:assert/strict";
import Arena from "../../src/index.js";
import { ACCESS_TOKEN } from "./config.js";
import {
  BLOCK_COMMENTS_RESULT,
  BLOCK_CONNECTIONS_RESULT,
  BLOCK_RESULT,
  NEW_BLOCK_RESULT
} from "./mockData/blocksMockData.js";
import { createMockFetch } from "../helpers/mock-fetch.js";

test("Arena Blocks: fetch a block", async () => {
  const { fetch, calls } = createMockFetch([{ body: BLOCK_RESULT }]);
  const arena = new Arena({ token: ACCESS_TOKEN, fetch });

  const result = await arena.v3.blocks.get({ id: BLOCK_RESULT.id });

  assert.equal(calls.length, 1);
  assert.match(calls[0].url, /\/v3\/blocks\/22573894$/);
  assert.equal(calls[0].init.method, "GET");
  assert.equal(new Headers(calls[0].init.headers).get("authorization"), `Bearer ${ACCESS_TOKEN}`);
  assert.deepEqual(result, BLOCK_RESULT);
});

test("Arena Blocks: fetch comments and connections", async () => {
  const { fetch, calls } = createMockFetch([
    { body: BLOCK_COMMENTS_RESULT },
    { body: BLOCK_CONNECTIONS_RESULT }
  ]);
  const arena = new Arena({ token: ACCESS_TOKEN, fetch });

  const comments = await arena.v3.blocks.listComments({ id: BLOCK_RESULT.id, page: 1, per: 24 });
  const connections = await arena.v3.blocks.listConnections({ id: BLOCK_RESULT.id, page: 1, per: 24 });

  assert.equal(calls.length, 2);
  assert.match(calls[0].url, /\/v3\/blocks\/22573894\/comments\?page=1&per=24$/);
  assert.match(calls[1].url, /\/v3\/blocks\/22573894\/connections\?page=1&per=24$/);
  assert.deepEqual(comments, BLOCK_COMMENTS_RESULT);
  assert.deepEqual(connections, BLOCK_CONNECTIONS_RESULT);
});

test("Arena Blocks: create and update a block", async () => {
  const updated = { ...NEW_BLOCK_RESULT, title: "updated block" };
  const { fetch, calls } = createMockFetch([{ body: NEW_BLOCK_RESULT }, { body: updated }]);
  const arena = new Arena({ token: ACCESS_TOKEN, fetch });

  const created = await arena.v3.blocks.create({
    value: "hello",
    channel_ids: [123],
    title: "new block"
  });
  const result = await arena.v3.blocks.update({
    id: NEW_BLOCK_RESULT.id,
    body: { title: "updated block" }
  });

  assert.equal(calls.length, 2);
  assert.match(calls[0].url, /\/v3\/blocks$/);
  assert.equal(calls[0].init.method, "POST");
  assert.deepEqual(JSON.parse(String(calls[0].init.body)), {
    value: "hello",
    channel_ids: [123],
    title: "new block"
  });
  assert.match(calls[1].url, /\/v3\/blocks\/999$/);
  assert.equal(calls[1].init.method, "PUT");
  assert.deepEqual(JSON.parse(String(calls[1].init.body)), { title: "updated block" });
  assert.deepEqual(created, NEW_BLOCK_RESULT);
  assert.deepEqual(result, updated);
});
