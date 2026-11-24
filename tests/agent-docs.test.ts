import { mkdtempSync, existsSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { beforeAll, describe, expect, it } from "vitest";
import { componentExports, generateAgentDocs, pageName } from "../scripts/agent-docs";

const root = process.cwd();
const outDir = mkdtempSync(join(tmpdir(), "trama-docs-"));

beforeAll(() => {
  generateAgentDocs({ root, outDir });
}, 60_000);

const read = (file: string) => readFileSync(join(outDir, file), "utf8");

describe("agent docs", () => {
  it("has a page for every component exported from src/index.ts, plus an index", () => {
    const components = componentExports(readFileSync(join(root, "src/index.ts"), "utf8"));
    expect(components.length).toBeGreaterThan(0);
    for (const { name } of components) {
      expect(existsSync(join(outDir, "docs", `${pageName(name)}.md`)), `${name} has no page`).toBe(true);
    }
    expect(existsSync(join(outDir, "docs", "index.md"))).toBe(true);
  });

  it("documents the Base UI and own props of Button with their TSDoc description", () => {
    const page = read("docs/button.md");
    for (const prop of ["render", "className", "disabled", "style", "variant", "size"]) {
      const section = page.split("\n### ").find((s) => s.startsWith(`\`${prop}\``));
      expect(section, `button.md has no section for ${prop}`).toBeDefined();
      // Section layout: heading, "Type:" line, blank line, then the description.
      const description = section!.split("\n\n").slice(1).join("\n\n").trim();
      // "No description." is the placeholder the generator writes when a prop has no TSDoc.
      expect(description, `${prop} has no TSDoc description`).not.toBe("No description.");
      expect(description.length, `${prop} has no description`).toBeGreaterThan(0);
    }
  });

  it("writes a consumer-only dist/AGENTS.md that points at the index and the changelog", () => {
    const agents = read("AGENTS.md");
    expect(agents).toContain("docs/index.md");
    expect(agents).toContain("CHANGELOG.md");
    expect(agents).not.toMatch(/changeset|\bissues?\b|\btai\b/i);
  });
});
