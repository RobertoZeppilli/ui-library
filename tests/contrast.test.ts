import { readdirSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import contract from "../contract.json" with { type: "json" };

type Scheme = "light" | "dark";

// Top-level comma split, so light-dark(oklch(a b c), oklch(d e f)) gives two parts.
function splitArgs(s: string): string[] {
  const out: string[] = [];
  let depth = 0;
  let start = 0;
  for (let i = 0; i < s.length; i++) {
    if (s[i] === "(") depth++;
    else if (s[i] === ")") depth--;
    else if (s[i] === "," && depth === 0) {
      out.push(s.slice(start, i).trim());
      start = i + 1;
    }
  }
  out.push(s.slice(start).trim());
  return out;
}

function inner(value: string, fn: string): string | null {
  if (!value.startsWith(`${fn}(`) || !value.endsWith(")")) return null;
  return value.slice(fn.length + 1, -1);
}

function resolve(value: string, vars: Map<string, string>, scheme: Scheme): string {
  value = value.trim();
  const v = inner(value, "var");
  if (v !== null) {
    const ref = vars.get(v.trim());
    if (ref === undefined) throw new Error(`undefined variable ${v}`);
    return resolve(ref, vars, scheme);
  }
  const ld = inner(value, "light-dark");
  if (ld !== null) return resolve(splitArgs(ld)[scheme === "light" ? 0 : 1], vars, scheme);
  return value;
}

// oklch -> linear sRGB (Ottosson), clamped to the gamut.
function relativeLuminance(color: string): number {
  const m = /^oklch\(\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)\s*\)$/.exec(color);
  if (!m) throw new Error(`unsupported color ${color}`);
  const [L, C, h] = [Number(m[1]), Number(m[2]), (Number(m[3]) * Math.PI) / 180];
  const a = C * Math.cos(h);
  const b = C * Math.sin(h);
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const mm = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
  const rgb = [
    4.0767416621 * l - 3.3077115913 * mm + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * mm - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * mm + 1.707614701 * s,
  ].map((c) => Math.min(1, Math.max(0, c)));
  return 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2];
}

function ratio(a: string, b: string): number {
  const [x, y] = [relativeLuminance(a), relativeLuminance(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
}

const themeFiles = readdirSync("themes").filter((f) => f.endsWith(".css"));

it("has at least one theme", () => {
  expect(themeFiles.length).toBeGreaterThan(0);
});

for (const file of themeFiles) {
  const theme = file.replace(/\.css$/, "");
  const vars = new Map(
    [...readFileSync(`themes/${file}`, "utf8").matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)].map((m) => [m[1], m[2]]),
  );
  describe(theme, () => {
    for (const scheme of ["light", "dark"] as const) {
      for (const [fg, bg, min] of contract.pairs as [string, string, number][]) {
        it(`${theme} ${scheme}: ${fg} / ${bg} >= ${min}:1`, () => {
          const r = ratio(
            resolve(`var(--ui-${fg})`, vars, scheme),
            resolve(`var(--ui-${bg})`, vars, scheme),
          );
          expect(r, `${theme} ${scheme}: ${fg} / ${bg} is ${r.toFixed(2)}:1, needs ${min}:1`).toBeGreaterThanOrEqual(min);
        });
      }
    }
  });
}

it("brutalista light: ring differs from destructive", () => {
  const vars = new Map(
    [...readFileSync("themes/brutalista.css", "utf8").matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)].map((m) => [m[1], m[2]]),
  );
  expect(resolve("var(--ui-ring)", vars, "light")).not.toBe(resolve("var(--ui-destructive)", vars, "light"));
});
