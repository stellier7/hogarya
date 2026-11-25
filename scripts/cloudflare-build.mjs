import { spawnSync } from "node:child_process";
import path from "node:path";

// Workers Builds runs `npm run build` and then `npx wrangler deploy` or
// `npx wrangler preview`. The adapter has to finish inside the build step,
// because Wrangler only publishes `.open-next`. Local builds stay on Next.js.
if (process.env.WORKERS_CI !== "1") {
  process.exit(0);
}

const bin = path.join(process.cwd(), "node_modules", ".bin", "opennextjs-cloudflare");
const result = spawnSync(bin, ["build", "--skipNextBuild"], { stdio: "inherit" });

if (result.error) {
  console.error(result.error);
  process.exit(1);
}

process.exit(result.status ?? 1);
