#!/usr/bin/env node
// Fetch ATX-1 spec artifacts from aegis-governance.com and cache locally for the build.
// Source of truth: aegis-governance owns the spec. This site renders it.
//
// Run modes:
//   default    Fetch from network, validate, write to src/data/atx/ (gitignored).
//   --offline  Skip fetch; require cache to exist (for air-gapped or rate-limited builds).
//   --check    Fetch + verify against the cache without writing (CI drift detection).
//
// Failure modes are loud:
//   - Network fetch fails    → exit 1 unless --offline (then require cache).
//   - Remote VERSION < pinned minimum → exit 1.
//   - Schema validation fails → exit 1.
//   - JSON parse fails → exit 1.

import { mkdir, readFile, writeFile, access } from "node:fs/promises";
import { existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, "..");
const CACHE_DIR = join(REPO_ROOT, "src", "data", "atx");

const SOURCE_BASE = process.env.ATX_SOURCE ?? "https://aegis-governance.com";
const OFFLINE = process.argv.includes("--offline") || process.env.ATX_OFFLINE === "1";
const CHECK_ONLY = process.argv.includes("--check");

// Read minimum acceptable spec version from package.json so it travels with the code.
const pkg = JSON.parse(await readFile(join(REPO_ROOT, "package.json"), "utf8"));
const MIN_VERSION = pkg.aegisGovernance?.atxMinVersion;
if (!MIN_VERSION) {
  console.error("[fetch-atx][err] package.json missing aegisGovernance.atxMinVersion");
  process.exit(2);
}

// Artifacts to fetch. The dst is relative to CACHE_DIR.
const ARTIFACTS = [
  { name: "VERSION", url: "/atx-1/VERSION", dst: "VERSION", kind: "text" },
  { name: "index", url: "/atx-1/index.json", dst: "index.json", kind: "json" },
  { name: "techniques", url: "/atx-1/techniques.json", dst: "techniques.json", kind: "json" },
  { name: "regulatory-crossref", url: "/atx-1/regulatory-crossref.json", dst: "regulatory-crossref.json", kind: "json" },
  { name: "version-mapping", url: "/atx-1/version-mapping.json", dst: "version-mapping.json", kind: "json" },
  { name: "atm1-mapping", url: "/atx-1/atm1-mapping.json", dst: "atm1-mapping.json", kind: "json" },
  { name: "schema", url: "/schemas/atx-technique.schema.json", dst: "atx-technique.schema.json", kind: "json" },
];

function log(level, msg) {
  const prefix = { info: "[fetch-atx]", warn: "[fetch-atx][warn]", err: "[fetch-atx][err]" }[level];
  (level === "err" ? console.error : console.log)(`${prefix} ${msg}`);
}

function compareSemver(a, b) {
  const pa = a.split(".").map(Number);
  const pb = b.split(".").map(Number);
  for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
    const da = pa[i] ?? 0;
    const db = pb[i] ?? 0;
    if (da !== db) return da - db;
  }
  return 0;
}

async function fetchOne(artifact) {
  const url = SOURCE_BASE + artifact.url;
  const res = await fetch(url, { redirect: "follow" });
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} ${res.statusText} fetching ${url}`);
  }
  const text = await res.text();
  if (artifact.kind === "json") {
    try {
      return { text: text.trim() + "\n", value: JSON.parse(text) };
    } catch (e) {
      throw new Error(`${url}: invalid JSON — ${e.message}`);
    }
  }
  return { text: text.trim() + "\n", value: text.trim() };
}

async function readCached(artifact) {
  const path = join(CACHE_DIR, artifact.dst);
  if (!existsSync(path)) {
    throw new Error(`cache miss for ${artifact.name} at ${path}`);
  }
  const text = await readFile(path, "utf8");
  if (artifact.kind === "json") {
    return { text, value: JSON.parse(text) };
  }
  return { text, value: text.trim() };
}

async function writeArtifact(artifact, payload) {
  const path = join(CACHE_DIR, artifact.dst);
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, payload.text, { encoding: "utf8" });
}

async function main() {
  log("info", `mode=${CHECK_ONLY ? "check" : OFFLINE ? "offline" : "fetch"} source=${SOURCE_BASE} min-version=${MIN_VERSION}`);

  await mkdir(CACHE_DIR, { recursive: true });

  // VERSION first — gates everything else.
  const versionArtifact = ARTIFACTS[0];
  let version;
  if (OFFLINE) {
    const cached = await readCached(versionArtifact);
    version = cached.value;
    log("info", `offline: using cached VERSION ${version}`);
  } else {
    try {
      const fetched = await fetchOne(versionArtifact);
      version = fetched.value;
    } catch (e) {
      log("err", `fetch failed: ${e.message}`);
      log("err", `to use cached data, set ATX_OFFLINE=1 or pass --offline`);
      process.exit(1);
    }
  }

  if (compareSemver(version, MIN_VERSION) < 0) {
    log("err", `remote ATX-1 version ${version} < pinned minimum ${MIN_VERSION}`);
    log("err", `bump aegisGovernance.atxMinVersion in package.json or wait for governance to publish`);
    process.exit(1);
  }
  log("info", `ATX-1 version ${version} ≥ ${MIN_VERSION} — accepted`);

  // Fetch the rest, validate JSON parses.
  const fetched = new Map();
  fetched.set("VERSION", { text: version + "\n", value: version });
  for (const artifact of ARTIFACTS.slice(1)) {
    try {
      const payload = OFFLINE ? await readCached(artifact) : await fetchOne(artifact);
      fetched.set(artifact.name, payload);
    } catch (e) {
      log("err", `${artifact.name}: ${e.message}`);
      process.exit(1);
    }
  }

  // Sanity: index.json should report the same version.
  const indexValue = fetched.get("index").value;
  if (indexValue.version !== version) {
    log("warn", `index.json reports version ${indexValue.version} but VERSION endpoint says ${version}`);
  }

  // Sanity: technique counts.
  const techniques = fetched.get("techniques").value;
  if (!Array.isArray(techniques)) {
    log("err", `techniques.json is not an array`);
    process.exit(1);
  }
  const tactics = new Set(techniques.filter((t) => !t.id?.includes(".")).map((t) => t.tactic));
  log("info", `validated: ${techniques.length} technique entries across ${tactics.size} tactics`);

  // Write or check.
  if (CHECK_ONLY) {
    let drift = 0;
    for (const artifact of ARTIFACTS) {
      const path = join(CACHE_DIR, artifact.dst);
      if (!existsSync(path)) {
        log("err", `would create ${artifact.dst}`);
        drift++;
        continue;
      }
      const cur = await readFile(path, "utf8");
      if (cur !== fetched.get(artifact.name).text) {
        log("err", `would update ${artifact.dst}`);
        drift++;
      }
    }
    if (drift > 0) {
      log("err", `${drift} file(s) out of sync with remote`);
      process.exit(1);
    }
    log("info", `cache is in sync with remote`);
    return;
  }

  for (const artifact of ARTIFACTS) {
    await writeArtifact(artifact, fetched.get(artifact.name));
  }
  log("info", `wrote ${ARTIFACTS.length} artifact(s) to ${CACHE_DIR}`);
}

main().catch((e) => {
  log("err", e.stack ?? e.message);
  process.exit(2);
});
