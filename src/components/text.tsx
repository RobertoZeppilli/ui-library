"use client";

import { useRender } from "@base-ui/react/use-render";
import { cn } from "../lib/cn";
import { classes, type Responsive } from "../lib/responsive";

// Class tables follow the rules in lib/responsive.ts: literal strings, rows of [initial, sm, md, lg, xl, 2xl].
const size = {
  xs: ["text-xs", "sm:text-xs", "md:text-xs", "lg:text-xs", "xl:text-xs", "2xl:text-xs"],
  sm: ["text-sm", "sm:text-sm", "md:text-sm", "lg:text-sm", "xl:text-sm", "2xl:text-sm"],
  base: ["text-base", "sm:text-base", "md:text-base", "lg:text-base", "xl:text-base", "2xl:text-base"],
  lg: ["text-lg", "sm:text-lg", "md:text-lg", "lg:text-lg", "xl:text-lg", "2xl:text-lg"],
  xl: ["text-xl", "sm:text-xl", "md:text-xl", "lg:text-xl", "xl:text-xl", "2xl:text-xl"],
  "2xl": ["text-2xl", "sm:text-2xl", "md:text-2xl", "lg:text-2xl", "xl:text-2xl", "2xl:text-2xl"],
  "3xl": ["text-3xl", "sm:text-3xl", "md:text-3xl", "lg:text-3xl", "xl:text-3xl", "2xl:text-3xl"],
} as const;

const tone = {
  normal: "text-foreground",
  muted: "text-muted-foreground",
  destructive: "text-destructive",
} as const;

export interface TextProps extends useRender.ComponentProps<"p"> {
  /** Size on the theme's type scale. Accepts a responsive object. @default "base" */
  size?: Responsive<keyof typeof size>;
  /** Semantic text color. @default "normal" */
  tone?: keyof typeof tone;
}

/** Text layout component. `size` takes a single value or a mobile-first object like `{ initial: "base", md: "xl" }`. Change the element through `render`, e.g. `render={<h1 />}`. */
export function Text({ size: s, tone: t = "normal", className, render, ...props }: TextProps) {
  return useRender({
    render,
    defaultTagName: "p",
    props: {
      "data-slot": "text",
      ...props,
      className: cn(classes(size, s, "base"), tone[t], className),
    },
  });
}
