import test from "node:test";
import assert from "node:assert/strict";
import type { V3PresignedFile, V3PresignResponse } from "../src/v3/types.js";

const presignedFile: V3PresignedFile = {
  upload_url: "https://example.com/upload",
  key: "uploads/example/file.png",
  content_type: "image/png"
};

const presignResponse: V3PresignResponse = {
  files: [presignedFile],
  expires_in: 900
};

const typedUploadUrl: string = presignResponse.files[0].upload_url;
const typedExpiresIn: number = presignResponse.expires_in;
void typedUploadUrl;
void typedExpiresIn;

// @ts-expect-error upload_url is required
const invalidPresignedFile: V3PresignedFile = {
  key: "uploads/example/file.png",
  content_type: "image/png"
};
void invalidPresignedFile;

// @ts-expect-error expires_in is required
const invalidPresignResponse: V3PresignResponse = {
  files: [presignedFile]
};
void invalidPresignResponse;

test("presign response has the expected typed shape", () => {
  assert.equal(typeof presignResponse.expires_in, "number");
  assert.equal(typeof presignResponse.files[0].upload_url, "string");
});
