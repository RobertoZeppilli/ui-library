import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { expect, it } from "vitest";

// Tailwind palette colors (bg-red-500) and bare black/white: only contract tokens are allowed in src/.
const PALETTE = new RegExp(
  "(?<![\\w-])(?:[\\w-]+:)*(?:bg|text|border|ring|outline|fill|stroke|from|via|to|divide|decoration|accent|caret|shadow|placeholder)-" +
    "(?:(?:red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose|slate|gray|zinc|neutral|stone|taupe|mauve|mist|olive)-\\d{2,3}|black|white)(?![\\w-])",
  "g",
);

function files(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true, recursive: true })
    .filter((e) => e.isFile() && /\.(tsx?|jsx?|css|mdx?)$/.test(e.name))
    .map((e) => join(e.parentPath, e.name));
}

it("src/ uses no Tailwind palette colors", () => {
  const hits = (existsSync("src") ? files("src") : []).flatMap((f) =>
    (readFileSync(f, "utf8").match(PALETTE) ?? []).map((m) => `${f}: ${m}`),
  );
  expect(hits).toEqual([]);
});
