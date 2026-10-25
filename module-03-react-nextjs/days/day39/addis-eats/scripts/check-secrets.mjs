// Proves no secret VALUE from .env.local ended up in JavaScript the browser downloads.
// Usage: npm run build && npm run check:secrets
// Variables starting with NEXT_PUBLIC_ are meant to be public, so they are skipped.
import fs from "node:fs";
import path from "node:path";

const staticDir = path.join(".next", "static");
if (!fs.existsSync(staticDir)) {
  console.error('No .next/static folder. Run "npm run build" first.');
  process.exit(1);
}

const secrets = [];
if (fs.existsSync(".env.local")) {
  for (const line of fs.readFileSync(".env.local", "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*?)\s*$/);
    if (!m || m[1].startsWith("NEXT_PUBLIC_")) continue;
    const value = m[2].replace(/^["']|["']$/g, "");
    if (value.length >= 8) secrets.push({ key: m[1], value });
  }
}
if (secrets.length === 0) {
  console.error("No secret values found in .env.local to look for.");
  process.exit(1);
}

function* walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else yield full;
  }
}

let scanned = 0;
const leaks = [];
for (const file of walk(staticDir)) {
  scanned++;
  const text = fs.readFileSync(file, "utf8");
  for (const { key, value } of secrets) if (text.includes(value)) leaks.push(`${key} found in ${file}`);
}

if (leaks.length > 0) {
  console.error("LEAK:\n" + leaks.join("\n"));
  process.exit(1);
}
console.log(`OK: ${secrets.length} secret value(s) checked across ${scanned} client files. None found.`);
