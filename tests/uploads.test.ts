import test from "node:test";
import assert from "node:assert/strict";
import Arena, { toTempSourceUrl } from "../src/index.js";

test("toTempSourceUrl encodes spaces and preserves path separators", () => {
  const key = "uploads/uuid/image 41.png";
  const url = toTempSourceUrl(key);

  assert.equal(url, "https://s3.amazonaws.com/arena_images-temp/uploads/uuid/image%2041.png");
  assert.doesNotThrow(() => new URL(url));
});

test("toTempSourceUrl encodes unicode characters", () => {
  const key = "uploads/uuid/你好.png";
  const url = toTempSourceUrl(key);

  assert.equal(url, "https://s3.amazonaws.com/arena_images-temp/uploads/uuid/%E4%BD%A0%E5%A5%BD.png");
  assert.doesNotThrow(() => new URL(url));
});

test("toTempSourceUrl encodes reserved characters", () => {
  const key = "uploads/uuid/a#b?.png";
  const url = toTempSourceUrl(key);

  assert.equal(url, "https://s3.amazonaws.com/arena_images-temp/uploads/uuid/a%23b%3F.png");
  assert.doesNotThrow(() => new URL(url));
});

test("uploads API method mirrors toTempSourceUrl helper", () => {
  const arena = new Arena();
  const key = "uploads/uuid/image 41.png";

  assert.equal(arena.v3.uploads.toTempSourceUrl(key), toTempSourceUrl(key));
});
