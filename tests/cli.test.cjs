const test = require("node:test");
const assert = require("node:assert/strict");
const { mkdtempSync, readFileSync } = require("node:fs");
const { join } = require("node:path");
const { tmpdir } = require("node:os");
const { execFileSync } = require("node:child_process");

const CLI_PATH = join(process.cwd(), "bin", "ts-arena.mjs");

test("init-agents creates TSARENA-AGENTS.md in current project", () => {
  const cwd = mkdtempSync(join(tmpdir(), "ts-arena-cli-"));

  execFileSync(process.execPath, [CLI_PATH, "init-agents"], {
    cwd,
    stdio: "pipe"
  });

  const generatedPath = join(cwd, "TSARENA-AGENTS.md");
  const contents = readFileSync(generatedPath, "utf8");
  assert.match(contents, /# TSARENA-AGENTS/);
  assert.match(contents, /## V3 method auth map \(34 methods\)/);
  assert.match(contents, /arena\.v3\.auth\.exchangeToken/);
});
