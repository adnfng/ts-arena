import test from "node:test";
import assert from "node:assert/strict";
import Arena from "../../src/index.js";
import { ACCESS_TOKEN } from "./config.js";
import {
  CHANNEL_CONNECTIONS_RESULT,
  CHANNEL_CONTENTS_RESULT,
  CHANNEL_RESULT,
  NEW_CHANNEL_RESULT
} from "./mockData/channelsMockData.js";
import { createMockFetch } from "../helpers/mock-fetch.js";

test("Arena Channels: fetch a channel", async () => {
  const { fetch, calls } = createMockFetch([{ body: CHANNEL_RESULT }]);
  const arena = new Arena({ token: ACCESS_TOKEN, fetch });

  const result = await arena.v3.channels.get({ id: CHANNEL_RESULT.id });

  assert.equal(calls.length, 1);
  assert.match(calls[0].url, /\/v3\/channels\/changelog$/);
  assert.equal(calls[0].init.method, "GET");
  assert.deepEqual(result, CHANNEL_RESULT);
});

test("Arena Channels: fetch contents and connections", async () => {
  const { fetch, calls } = createMockFetch([
    { body: CHANNEL_CONTENTS_RESULT },
    { body: CHANNEL_CONNECTIONS_RESULT }
  ]);
  const arena = new Arena({ token: ACCESS_TOKEN, fetch });

  const contents = await arena.v3.channels.listContents({ id: "changelog", page: 1, per: 24 });
  const connections = await arena.v3.channels.listConnections({ id: "changelog", page: 1, per: 24 });

  assert.equal(calls.length, 2);
  assert.match(calls[0].url, /\/v3\/channels\/changelog\/contents\?page=1&per=24$/);
  assert.match(calls[1].url, /\/v3\/channels\/changelog\/connections\?page=1&per=24$/);
  assert.deepEqual(contents, CHANNEL_CONTENTS_RESULT);
  assert.deepEqual(connections, CHANNEL_CONNECTIONS_RESULT);
});

test("Arena Channels: create, update, delete", async () => {
  const updatedChannel = { ...CHANNEL_RESULT, title: "updated channel" };
  const { fetch, calls } = createMockFetch([
    { body: NEW_CHANNEL_RESULT },
    { body: updatedChannel },
    { body: "", init: { status: 204 } }
  ]);
  const arena = new Arena({ token: ACCESS_TOKEN, fetch });

  const created = await arena.v3.channels.create({ title: "new channel" });
  const updated = await arena.v3.channels.update({ id: CHANNEL_RESULT.id, body: { title: "updated channel" } });
  await arena.v3.channels.remove({ id: CHANNEL_RESULT.id });

  assert.equal(calls.length, 3);
  assert.match(calls[0].url, /\/v3\/channels$/);
  assert.equal(calls[0].init.method, "POST");
  assert.match(calls[1].url, /\/v3\/channels\/changelog$/);
  assert.equal(calls[1].init.method, "PUT");
  assert.match(calls[2].url, /\/v3\/channels\/changelog$/);
  assert.equal(calls[2].init.method, "DELETE");
  assert.deepEqual(created, NEW_CHANNEL_RESULT);
  assert.deepEqual(updated, updatedChannel);
});
