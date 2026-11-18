import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const clientDir = path.join(root, "node_modules", ".prisma", "client");

if (!fs.existsSync(clientDir)) {
  console.error("Missing .prisma/client — run prisma generate first");
  process.exit(1);
}

for (const name of fs.readdirSync(clientDir)) {
  const full = path.join(clientDir, name);
  const drop =
    name.includes("windows") ||
    name.endsWith(".tmp") ||
    name.includes(".tmp") ||
    name.endsWith(".wasm") ||
    name.includes("query_engine_bg");
  if (drop) {
    fs.rmSync(full, { force: true, recursive: true });
    console.log("removed", name);
  }
}

const engine = path.join(clientDir, "libquery_engine-rhel-openssl-3.0.x.so.node");
if (!fs.existsSync(engine)) {
  console.error("Missing rhel Prisma engine — check binaryTargets in schema.prisma");
  process.exit(1);
}

console.log("Prisma client trimmed for Netlify");
