import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { agentsBlockVersionErrors, syncAgentsBlockVersion } from "../scripts/agents-block";

const read = (file: string) => readFileSync(file, "utf8");
const readme = read("README.md");
const consumer = read("docs/agents/consumer.md");
const { version } = JSON.parse(read("package.json")) as { version: string };

const block = (v: string) => `<!-- trama:agents:start v${v} -->\n\n\`\`\`\`md\n## trama (v${v})\n\`\`\`\`\n`;

describe("agents block version in the README", () => {
  it("fails when the block says v0.0.0 and package.json says 0.1.0", () => {
    expect(agentsBlockVersionErrors(block("0.0.0"), "0.1.0")).not.toEqual([]);
  });

  it("fails when only the heading is stale", () => {
    expect(agentsBlockVersionErrors(block("0.1.0").replace("## trama (v0.1.0)", "## trama (v0.0.0)"), "0.1.0")).not.toEqual([]);
  });

  it("passes when markers and heading carry the package.json version", () => {
    expect(agentsBlockVersionErrors(block("0.1.0"), "0.1.0")).toEqual([]);
  });

  it("sync rewrites marker and heading so the check passes", () => {
    const synced = syncAgentsBlockVersion(block("0.1.0"), "0.2.0");
    expect(agentsBlockVersionErrors(synced, "0.2.0")).toEqual([]);
    expect(synced).toBe(block("0.2.0"));
  });

  it("matches the real package.json", () => {
    expect(agentsBlockVersionErrors(readme, version)).toEqual([]);
  });
});

describe("self-check command", () => {
  const pattern = (doc: string) => /grep -rE "([^"]+)" src/.exec(doc)?.[1];

  it("is the same in the README block and in docs/agents/consumer.md", () => {
    expect(pattern(readme)).toBeDefined();
    expect(pattern(consumer)).toBe(pattern(readme));
  });

  it("ignores a `dark` key in a JS object but finds dark: classes and asChild", () => {
    const re = new RegExp(pattern(consumer)!);
    expect(re.test('const schemes = { light: "Light", dark: "Dark" };')).toBe(false);
    expect(re.test('<div className="dark:bg-black" />')).toBe(true);
    expect(re.test('<div className="p-2 hover:dark:bg-black" />')).toBe(true);
    expect(re.test("<Button asChild>x</Button>")).toBe(true);
  });
});
