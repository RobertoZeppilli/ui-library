import { execFileSync } from "node:child_process";
import { pathToFileURL } from "node:url";

const isChangeset = (f: string) => /^\.changeset\/(?!README\.md$)[^/]+\.md$/.test(f);

export function missingChangeset(files: string[]): boolean {
  const touchesPackage = files.some((f) => f.startsWith("src/") || f.startsWith("themes/"));
  return touchesPackage && !files.some(isChangeset);
}

// CLI: node scripts/changeset-check.ts <base-ref>
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const base = process.argv[2] ?? "origin/main";
  const out = execFileSync("git", ["diff", "--name-only", `${base}...HEAD`], { encoding: "utf8" });
  if (missingChangeset(out.split("\n").filter(Boolean))) {
    console.error("This PR touches src/ or themes/ but has no changeset. Run `pnpm changeset` and commit the file.");
    process.exit(1);
  }
}
