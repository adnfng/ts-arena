const test = require("node:test");
const assert = require("node:assert/strict");
const mod = require("../dist/cjs/index.js");

test("Arena exposes v3 and legacyV2 namespaces", () => {
  const Arena = mod.default;
  const arena = new Arena();

  assert.equal(typeof arena.v3.blocks.get, "function");
  assert.equal(typeof arena.v3.channels.get, "function");
  assert.equal(typeof arena.v3.search.query, "function");
  assert.equal(typeof arena.legacyV2.channels.list, "function");
  assert.equal(typeof arena.legacyV2.users.primaryChannel, "function");
});

test("withToken returns a new client instance", () => {
  const Arena = mod.default;
  const arena = new Arena();
  const arenaWithToken = arena.withToken("abc123");

  assert.notEqual(arena, arenaWithToken);
  assert.equal(typeof arenaWithToken.v3.system.ping, "function");
});
