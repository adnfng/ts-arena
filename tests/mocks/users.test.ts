import test from "node:test";
import assert from "node:assert/strict";
import Arena from "../../src/index.js";
import { ACCESS_TOKEN } from "./config.js";
import {
  USER_CONTENTS_RESULT,
  USER_FOLLOWERS_RESULT,
  USER_FOLLOWING_RESULT,
  USER_RESULT
} from "./mockData/usersMockData.js";
import { createMockFetch } from "../helpers/mock-fetch.js";

test("Arena Users: return a user", async () => {
  const { fetch, calls } = createMockFetch([{ body: USER_RESULT }]);
  const arena = new Arena({ token: ACCESS_TOKEN, fetch });

  const result = await arena.v3.users.get({ id: USER_RESULT.id });

  assert.equal(calls.length, 1);
  assert.match(calls[0].url, /\/v3\/users\/testing-arena$/);
  assert.equal(calls[0].init.method, "GET");
  assert.deepEqual(result, USER_RESULT);
});

test("Arena Users: return contents, followers, and following", async () => {
  const { fetch, calls } = createMockFetch([
    { body: USER_CONTENTS_RESULT },
    { body: USER_FOLLOWERS_RESULT },
    { body: USER_FOLLOWING_RESULT }
  ]);
  const arena = new Arena({ token: ACCESS_TOKEN, fetch });

  const contents = await arena.v3.users.listContents({ id: USER_RESULT.id, page: 1, per: 24 });
  const followers = await arena.v3.users.listFollowers({ id: USER_RESULT.id, page: 1, per: 24 });
  const following = await arena.v3.users.listFollowing({ id: USER_RESULT.id, page: 1, per: 24 });

  assert.equal(calls.length, 3);
  assert.match(calls[0].url, /\/v3\/users\/testing-arena\/contents\?page=1&per=24$/);
  assert.match(calls[1].url, /\/v3\/users\/testing-arena\/followers\?page=1&per=24$/);
  assert.match(calls[2].url, /\/v3\/users\/testing-arena\/following\?page=1&per=24$/);
  assert.deepEqual(contents, USER_CONTENTS_RESULT);
  assert.deepEqual(followers, USER_FOLLOWERS_RESULT);
  assert.deepEqual(following, USER_FOLLOWING_RESULT);
});
