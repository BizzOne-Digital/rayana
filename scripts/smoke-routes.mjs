/**
 * After `npm run build`, checks built HTML does not contain the global error page copy.
 * Usage: node scripts/smoke-routes.mjs
 */
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const ERROR_SNIPPET = "A moment of interruption";
const root = process.cwd();

const manifestPath = join(root, ".next", "routes-manifest.json");
if (!existsSync(manifestPath)) {
  console.error("Missing .next/routes-manifest.json — run npm run build first.");
  process.exit(1);
}

const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
const pagePaths = new Set();

for (const route of manifest.staticRoutes ?? []) {
  if (route.page && route.page.startsWith("/")) pagePaths.add(route.page);
}
for (const route of manifest.dynamicRoutes ?? []) {
  if (route.page && !route.page.includes("[")) pagePaths.add(route.page);
}

const checks = [
  "/",
  "/contact",
  "/faqs",
  "/testimonials",
  "/write-a-review",
  "/shop",
  "/admin/login",
];

let failed = 0;
for (const route of checks) {
  const htmlPath = join(root, ".next", "server", "app", route === "/" ? "index.html" : `${route.slice(1)}.html`);
  const altPath = join(root, ".next", "server", "pages", `${route === "/" ? "index" : route.slice(1)}.html`);
  const file = existsSync(htmlPath) ? htmlPath : existsSync(altPath) ? altPath : null;
  if (!file) {
    console.log(`skip ${route} (dynamic / no static html)`);
    continue;
  }
  const html = readFileSync(file, "utf8");
  if (html.includes(ERROR_SNIPPET)) {
    console.error(`FAIL ${route}: error page text found`);
    failed += 1;
  } else {
    console.log(`ok ${route}`);
  }
}

if (failed > 0) {
  process.exit(1);
}
console.log("Smoke check finished.");
