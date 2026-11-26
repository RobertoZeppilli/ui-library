import { readdirSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import contract from "../contract.json" with { type: "json" };
import { pairRatio, parseVars, resolve, schemes } from "../.storybook/contract.ts";

const themeFiles = readdirSync("themes").filter((f) => f.endsWith(".css"));

it("has at least one theme", () => {
  expect(themeFiles.length).toBeGreaterThan(0);
});

for (const file of themeFiles) {
  const theme = file.replace(/\.css$/, "");
  const vars = parseVars(readFileSync(`themes/${file}`, "utf8"));
  describe(theme, () => {
    for (const scheme of schemes) {
      for (const [fg, bg, min] of contract.pairs as [string, string, number][]) {
        it(`${theme} ${scheme}: ${fg} / ${bg} >= ${min}:1`, () => {
          const r = pairRatio(vars, scheme, fg, bg);
          expect(r, `${theme} ${scheme}: ${fg} / ${bg} is ${r.toFixed(2)}:1, needs ${min}:1`).toBeGreaterThanOrEqual(min);
        });
      }
    }
  });
}

it("brutalista light: ring differs from destructive", () => {
  const vars = parseVars(readFileSync("themes/brutalista.css", "utf8"));
  expect(resolve("var(--ui-ring)", vars, "light")).not.toBe(resolve("var(--ui-destructive)", vars, "light"));
});
