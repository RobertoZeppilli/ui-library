// Responsive props of layout components. Every class in a table is a literal string, never built by
// concatenation: Tailwind in the consumer finds them in dist through `@source "./dist"` (ADR 0002).
// Each row is [initial, sm, md, lg, xl, 2xl].
export const breakpoints = ["initial", "sm", "md", "lg", "xl", "2xl"] as const;
export type Breakpoint = (typeof breakpoints)[number];

/** A value for every breakpoint that needs one, mobile-first: `initial` has no media query. */
export type Responsive<V extends string> = V | { [B in Breakpoint]?: V };

export function classes<V extends string>(
  table: Record<V, readonly string[]>,
  value: Responsive<V> | undefined,
  fallback?: V,
): (string | undefined)[] {
  const byBreakpoint: { [B in Breakpoint]?: V } = typeof value === "object" ? value : value === undefined ? {} : { initial: value };
  return breakpoints.map((bp) => {
    const v = byBreakpoint[bp] ?? (bp === "initial" ? fallback : undefined);
    return v === undefined ? undefined : table[v][breakpoints.indexOf(bp)];
  });
}
