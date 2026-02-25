<div align="center">
  <img src="./ts-arena.svg" alt="ts-arena logo" width="64" height="64" />
  <h3>TS ARENA</h3>
  <p>An unofficial TypeScript SDK for the Are.na API.</p>
  <a href="./docs/schema.md">Docs</a> | <a href="./templates/TSARENA-AGENTS.md">Agents</a>
  <br/><br/>
  <div>
    <a href="https://gitviews.com/">
      <img src="https://gitviews.com/repo/adnfng/ts-arena.svg" alt="Repo Views" />
    </a>
  </div>
</div>

---

### What Is TS-ARENA?

**TS-ARENA** is a V3 SDK for the Are.na REST API.

All you need is:

- (Optional) an API token for authenticated endpoints (`ARENA_TOKEN`)
- this package installed in your project

It gives you two explicit surfaces:

- `arena.v3.*` for current API work
- `arena.legacyV2.*` only for known V3 gaps

Because Are.na marks v3 as work in progress, endpoint behavior can change.

---

### How It Works

1. Install the package:

```bash
npm install ts-arena
```

2. Create a client:

```ts
import Arena from "ts-arena";

const arena = new Arena({
  token: process.env.ARENA_TOKEN
});
```

3. Make a request:

```ts
const channel = await arena.v3.channels.get({ id: "arena-influences" });
```

4. Optional: generate an agent guide in your project root:

```bash
npx ts-arena init-agents
```
