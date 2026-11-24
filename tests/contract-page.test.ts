import { readdirSync, readFileSync } from "node:fs";
import { expect, it } from "vitest";
import contract from "../contract.json" with { type: "json" };
import { contractModel } from "../.storybook/contract.ts";

const themes = Object.fromEntries(
  readdirSync("themes")
    .filter((f) => f.endsWith(".css"))
    .map((f) => [f.replace(/\.css$/, ""), readFileSync(`themes/${f}`, "utf8")]),
);
const pairs = contract.pairs as [string, string, number][];

it("a token added to brutalista.css shows up in the contract page model", () => {
  const css = themes.brutalista!.replace("--ui-radius:", "--ui-brand-new: oklch(0.5 0.1 100);\n  --ui-radius:");
  const model = contractModel({ ...themes, brutalista: css }, pairs);
  const row = model.tokens.find((t) => t.name === "--ui-brand-new");
  expect(row?.values.brutalista).toBe("oklch(0.5 0.1 100)");
  expect(row?.values.neon).toBeUndefined();
});

it("lists every contrast pair with a ratio per theme and scheme", () => {
  const model = contractModel(themes, pairs);
  expect(model.pairs).toHaveLength(pairs.length);
  const first = model.pairs[0]!;
  expect(first.ratios.map((r) => `${r.theme} ${r.scheme}`)).toEqual(
    Object.keys(themes).flatMap((t) => [`${t} light`, `${t} dark`]),
  );
  expect(first.ratios.every((r) => r.ratio > 1)).toBe(true);
});
