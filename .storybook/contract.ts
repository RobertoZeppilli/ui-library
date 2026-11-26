// Token contract model, built from themes/*.css and contract.json. Used by the Storybook contract page
// and by tests/contrast.test.ts, so the page and the CI check can never disagree.

export type Scheme = "light" | "dark";
export const schemes: Scheme[] = ["light", "dark"];

export function parseVars(css: string): Map<string, string> {
  return new Map([...css.matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)].map((m) => [m[1]!, m[2]!.trim()]));
}

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

export function resolve(value: string, vars: Map<string, string>, scheme: Scheme): string {
  value = value.trim();
  const v = inner(value, "var");
  if (v !== null) {
    const ref = vars.get(v.trim());
    if (ref === undefined) throw new Error(`undefined variable ${v}`);
    return resolve(ref, vars, scheme);
  }
  const ld = inner(value, "light-dark");
  if (ld !== null) return resolve(splitArgs(ld)[scheme === "light" ? 0 : 1]!, vars, scheme);
  return value;
}

// oklch -> linear sRGB (Ottosson), clamped to the gamut.
function relativeLuminance(color: string): number {
  const hex = /^#([\da-f]{6})$/i.exec(color);
  if (hex) {
    const [r, g, b] = [0, 2, 4].map((i) => {
      const c = parseInt(hex[1]!.slice(i, i + 2), 16) / 255;
      return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
    }) as [number, number, number];
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  }
  const m = /^oklch\(\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)\s*\)$/.exec(color);
  if (!m) throw new Error(`unsupported color ${color}`);
  const [L, C, h] = [Number(m[1]), Number(m[2]), (Number(m[3]) * Math.PI) / 180] as [number, number, number];
  const a = C * Math.cos(h);
  const b = C * Math.sin(h);
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const mm = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
  const [r, g, bl] = [
    4.0767416621 * l - 3.3077115913 * mm + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * mm - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * mm + 1.707614701 * s,
  ].map((c) => Math.min(1, Math.max(0, c))) as [number, number, number];
  return 0.2126 * r + 0.7152 * g + 0.0722 * bl;
}

export function ratio(a: string, b: string): number {
  const [x, y] = [relativeLuminance(a), relativeLuminance(b)].sort((p, q) => q - p) as [number, number];
  return (x + 0.05) / (y + 0.05);
}

export function pairRatio(
  vars: Map<string, string>,
  scheme: Scheme,
  fg: string,
  bg: string,
): number {
  return ratio(resolve(`var(--ui-${fg})`, vars, scheme), resolve(`var(--ui-${bg})`, vars, scheme));
}

export interface ContractModel {
  tokens: { name: string; values: Record<string, string> }[];
  pairs: {
    fg: string;
    bg: string;
    min: number;
    ratios: { theme: string; scheme: Scheme; ratio: number }[];
  }[];
}

/** themes: theme name -> CSS source. pairs: [foreground token, background token, minimum ratio]. */
export function contractModel(themes: Record<string, string>, pairs: [string, string, number][]): ContractModel {
  const vars = Object.entries(themes).map(([theme, css]) => [theme, parseVars(css)] as const);
  const names = [...new Set(vars.flatMap(([, v]) => [...v.keys()]))];
  return {
    tokens: names.map((name) => ({
      name,
      values: Object.fromEntries(vars.flatMap(([theme, v]) => (v.has(name) ? [[theme, v.get(name)!]] : []))),
    })),
    pairs: pairs.map(([fg, bg, min]) => ({
      fg,
      bg,
      min,
      ratios: vars.flatMap(([theme, v]) =>
        schemes.map((scheme) => ({ theme, scheme, ratio: pairRatio(v, scheme, fg, bg) })),
      ),
    })),
  };
}
