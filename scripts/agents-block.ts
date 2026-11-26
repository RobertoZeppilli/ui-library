import { readFileSync, writeFileSync } from "node:fs";
import { pathToFileURL } from "node:url";

// The README block the consumer pastes into their AGENTS.md names the version twice: in the start marker and in the heading.
export function agentsBlockVersionErrors(readme: string, version: string): string[] {
  const found = [
    ["start marker", /<!-- trama:agents:start v(\S+) -->/.exec(readme)?.[1]],
    ["heading", /^## trama \(v([^)]+)\)$/m.exec(readme)?.[1]],
  ] as const;
  return found.flatMap(([where, v]) =>
    v === version ? [] : [`README agents block ${where} says ${v === undefined ? "nothing" : `v${v}`}, package.json says ${version}`],
  );
}

export function syncAgentsBlockVersion(readme: string, version: string): string {
  return readme
    .replace(/<!-- trama:agents:start v\S+ -->/, `<!-- trama:agents:start v${version} -->`)
    .replace(/^## trama \(v[^)]+\)$/m, `## trama (v${version})`);
}

// CLI, run after `changeset version`: node scripts/agents-block.ts writes the package.json version into README.md
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const { version } = JSON.parse(readFileSync("package.json", "utf8")) as { version: string };
  writeFileSync("README.md", syncAgentsBlockVersion(readFileSync("README.md", "utf8"), version));
}
