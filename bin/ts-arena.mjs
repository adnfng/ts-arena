#!/usr/bin/env node

import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const usage = `ts-arena CLI

Usage:
  ts-arena init-agents [--force]

Commands:
  init-agents  Create TSARENA-AGENTS.md in the current project root.

Options:
  --force      Overwrite an existing TSARENA-AGENTS.md file.
`;

function getTemplatePath() {
  const binDir = dirname(fileURLToPath(import.meta.url));
  return join(binDir, "..", "templates", "TSARENA-AGENTS.md");
}

function initAgents(force = false) {
  const targetDir = process.cwd();
  const targetPath = join(targetDir, "TSARENA-AGENTS.md");

  if (existsSync(targetPath) && !force) {
    console.error(
      "TSARENA-AGENTS.md already exists. Re-run with --force to overwrite."
    );
    process.exit(1);
  }

  const template = readFileSync(getTemplatePath(), "utf8");
  writeFileSync(targetPath, template, "utf8");
  console.log(`Created ${targetPath}`);
}

const args = process.argv.slice(2);
const command = args[0];
const force = args.includes("--force");

switch (command) {
  case "init-agents":
    initAgents(force);
    break;
  case "-h":
  case "--help":
  case undefined:
    console.log(usage);
    break;
  default:
    console.error(`Unknown command: ${command}\n`);
    console.log(usage);
    process.exit(1);
}
