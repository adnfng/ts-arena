import test from "node:test";
import assert from "node:assert/strict";
import Arena from "../../src/index.js";
import { ACCESS_TOKEN } from "./config.js";
import { SEARCH_RESULT } from "./mockData/searchMockData.js";
import { createMockFetch } from "../helpers/mock-fetch.js";

test("Arena Search: query and return paginated results", async () => {
  const { fetch, calls } = createMockFetch([{ body: SEARCH_RESULT }]);
  const arena = new Arena({ token: ACCESS_TOKEN, fetch });

  const result = await arena.v3.search.query({
    query: "testing",
    type: ["Channel", "User"]
  });

  assert.equal(calls.length, 1);
  assert.match(calls[0].url, /\/v3\/search\?query=testing&type=Channel%2CUser$/);
  assert.equal(calls[0].init.method, "GET");
  assert.equal(new Headers(calls[0].init.headers).get("authorization"), `Bearer ${ACCESS_TOKEN}`);
  assert.deepEqual(result, SEARCH_RESULT);
});
