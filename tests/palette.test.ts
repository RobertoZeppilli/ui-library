import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { expect, it } from "vitest";

// Tailwind palette colors (bg-red-500) and bare black/white: only contract tokens are allowed in src/.
const PALETTE = new RegExp(
  "(?<![\\w-])(?:[\\w-]+:)*(?:bg|text|border(?:-[xytrblse])?|ring(?:-offset)?|outline|fill|stroke|from|via|to|divide|decoration|accent|caret|(?:inset-|drop-|text-)?shadow|placeholder)-" +
    "(?:(?:red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose|slate|gray|zinc|neutral|stone|taupe|mauve|mist|olive)-\\d{2,3}|black|white)(?![\\w-])",
  "g",
);

function files(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true, recursive: true })
    .filter((e) => e.isFile() && /\.(tsx?|jsx?|css|mdx?)$/.test(e.name))
    .map((e) => join(e.parentPath, e.name));
}

it.each([
  "border-t-red-500",
  "border-x-blue-600",
  "ring-offset-white",
  "inset-shadow-green-500",
  "drop-shadow-black",
  "text-shadow-pink-400",
])("palette regex flags %s", (cls) => {
  expect(cls.match(PALETTE)).toEqual([cls]);
});

it("palette regex ignores contract tokens", () => {
  expect("border-t-border ring-offset-background shadow-sm bg-primary".match(PALETTE)).toBeNull();
});

it("src/ uses no Tailwind palette colors", () => {
  const hits = (existsSync("src") ? files("src") : []).flatMap((f) =>
    (readFileSync(f, "utf8").match(PALETTE) ?? []).map((m) => `${f}: ${m}`),
  );
  expect(hits).toEqual([]);
});
