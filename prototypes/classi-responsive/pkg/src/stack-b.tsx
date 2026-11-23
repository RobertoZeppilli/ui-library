type Bp = "initial" | "sm" | "md" | "lg" | "xl" | "2xl";
type R<T extends string> = T | Partial<Record<Bp, T>>;
type Gap = "0"|"1"|"2"|"3"|"4"|"5"|"6"|"8"|"10"|"12"|"16";
type Dir = "row" | "column" | "row-reverse" | "column-reverse";
// letterali fissi: Tailwind li vede tutti, sono 6 per prop indipendentemente dai valori
const gapCls = { initial: "gap-(--st-gap)", sm: "sm:gap-(--st-gap-sm)", md: "md:gap-(--st-gap-md)", lg: "lg:gap-(--st-gap-lg)", xl: "xl:gap-(--st-gap-xl)", "2xl": "2xl:gap-(--st-gap-2xl)" };
const dirCls = { initial: "[flex-direction:var(--st-dir)]", sm: "sm:[flex-direction:var(--st-dir-sm)]", md: "md:[flex-direction:var(--st-dir-md)]", lg: "lg:[flex-direction:var(--st-dir-lg)]", xl: "xl:[flex-direction:var(--st-dir-xl)]", "2xl": "2xl:[flex-direction:var(--st-dir-2xl)]" };
function apply<T extends string>(v: R<T> | undefined, cls: Record<Bp, string>, name: string, toCss: (v: T) => string, out: { c: string[]; s: Record<string, string> }) {
  if (v === undefined) return;
  const obj = (typeof v === "string" ? { initial: v } : v) as Partial<Record<Bp, T>>;
  for (const [bp, val] of Object.entries(obj) as [Bp, T][]) {
    out.c.push(cls[bp]);
    out.s[bp === "initial" ? `--st-${name}` : `--st-${name}-${bp}`] = toCss(val);
  }
}
export function StackB(props: { gap?: R<Gap>; direction?: R<Dir>; children?: React.ReactNode }) {
  const out = { c: ["flex"], s: {} as Record<string, string> };
  apply(props.gap, gapCls, "gap", v => `calc(var(--spacing) * ${v})`, out);
  apply(props.direction, dirCls, "dir", v => v, out);
  return <div data-slot="stack" data-testid="stack-b" className={out.c.join(" ")} style={out.s as React.CSSProperties}>{props.children}</div>;
}
