"use client";

import { useRender } from "@base-ui/react/use-render";
import { cn } from "../lib/cn";

// Every class is a literal string, never built by concatenation: Tailwind in the consumer finds them
// in dist through `@source "./dist"` (ADR 0002). Each row is [initial, sm, md, lg, xl, 2xl].
const breakpoints = ["initial", "sm", "md", "lg", "xl", "2xl"] as const;
type Breakpoint = (typeof breakpoints)[number];

const direction = {
  row: ["flex-row", "sm:flex-row", "md:flex-row", "lg:flex-row", "xl:flex-row", "2xl:flex-row"],
  column: ["flex-col", "sm:flex-col", "md:flex-col", "lg:flex-col", "xl:flex-col", "2xl:flex-col"],
} as const;

const gap = {
  "0": ["gap-0", "sm:gap-0", "md:gap-0", "lg:gap-0", "xl:gap-0", "2xl:gap-0"],
  "1": ["gap-1", "sm:gap-1", "md:gap-1", "lg:gap-1", "xl:gap-1", "2xl:gap-1"],
  "2": ["gap-2", "sm:gap-2", "md:gap-2", "lg:gap-2", "xl:gap-2", "2xl:gap-2"],
  "3": ["gap-3", "sm:gap-3", "md:gap-3", "lg:gap-3", "xl:gap-3", "2xl:gap-3"],
  "4": ["gap-4", "sm:gap-4", "md:gap-4", "lg:gap-4", "xl:gap-4", "2xl:gap-4"],
  "5": ["gap-5", "sm:gap-5", "md:gap-5", "lg:gap-5", "xl:gap-5", "2xl:gap-5"],
  "6": ["gap-6", "sm:gap-6", "md:gap-6", "lg:gap-6", "xl:gap-6", "2xl:gap-6"],
  "8": ["gap-8", "sm:gap-8", "md:gap-8", "lg:gap-8", "xl:gap-8", "2xl:gap-8"],
} as const;

const align = {
  start: ["items-start", "sm:items-start", "md:items-start", "lg:items-start", "xl:items-start", "2xl:items-start"],
  center: ["items-center", "sm:items-center", "md:items-center", "lg:items-center", "xl:items-center", "2xl:items-center"],
  end: ["items-end", "sm:items-end", "md:items-end", "lg:items-end", "xl:items-end", "2xl:items-end"],
  stretch: ["items-stretch", "sm:items-stretch", "md:items-stretch", "lg:items-stretch", "xl:items-stretch", "2xl:items-stretch"],
  baseline: ["items-baseline", "sm:items-baseline", "md:items-baseline", "lg:items-baseline", "xl:items-baseline", "2xl:items-baseline"],
} as const;

const justify = {
  start: ["justify-start", "sm:justify-start", "md:justify-start", "lg:justify-start", "xl:justify-start", "2xl:justify-start"],
  center: ["justify-center", "sm:justify-center", "md:justify-center", "lg:justify-center", "xl:justify-center", "2xl:justify-center"],
  end: ["justify-end", "sm:justify-end", "md:justify-end", "lg:justify-end", "xl:justify-end", "2xl:justify-end"],
  between: ["justify-between", "sm:justify-between", "md:justify-between", "lg:justify-between", "xl:justify-between", "2xl:justify-between"],
} as const;

const wrap = {
  nowrap: ["flex-nowrap", "sm:flex-nowrap", "md:flex-nowrap", "lg:flex-nowrap", "xl:flex-nowrap", "2xl:flex-nowrap"],
  wrap: ["flex-wrap", "sm:flex-wrap", "md:flex-wrap", "lg:flex-wrap", "xl:flex-wrap", "2xl:flex-wrap"],
} as const;

/** A value for every breakpoint that needs one, mobile-first: `initial` has no media query. */
type Responsive<V extends string> = V | { [B in Breakpoint]?: V };

function classes<V extends string>(
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

export interface StackProps extends useRender.ComponentProps<"div"> {
  /** Main axis. Accepts a responsive object. @default "column" */
  direction?: Responsive<keyof typeof direction>;
  /** Space between children, on the `--spacing` scale (`"2"` is `gap-2`). Accepts a responsive object. */
  gap?: Responsive<keyof typeof gap>;
  /** Cross-axis alignment of children. Accepts a responsive object. */
  align?: Responsive<keyof typeof align>;
  /** Main-axis distribution of children. Accepts a responsive object. */
  justify?: Responsive<keyof typeof justify>;
  /** Whether children wrap onto several lines. Accepts a responsive object. */
  wrap?: Responsive<keyof typeof wrap>;
}

/** Flex layout component. Layout props take a single value or a mobile-first object with `initial` and Tailwind breakpoints, like `{ initial: "2", md: "4" }`. Polymorphism goes through `render`. */
export function Stack({ direction: dir, gap: g, align: a, justify: j, wrap: w, className, render, ...props }: StackProps) {
  return useRender({
    render,
    defaultTagName: "div",
    props: {
      "data-slot": "stack",
      ...props,
      className: cn(
        "flex",
        classes(direction, dir, "column"),
        classes(gap, g),
        classes(align, a),
        classes(justify, j),
        classes(wrap, w),
        className,
      ),
    },
  });
}
