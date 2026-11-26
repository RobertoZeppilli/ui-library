"use client";

import { useRender } from "@base-ui/react/use-render";
import { cn } from "../lib/cn";

export interface CardProps extends useRender.ComponentProps<"div"> {}

/** Surface that groups related content. Colors, shadow and radius come from the theme. */
export function Card({ className, render, ...props }: CardProps) {
  return useRender({
    render,
    defaultTagName: "div",
    props: {
      "data-slot": "card",
      ...props,
      className: cn("flex flex-col gap-4 rounded-lg border-ui border-border bg-card py-4 text-card-foreground shadow-sm", className),
    },
  });
}

export interface CardHeaderProps extends useRender.ComponentProps<"div"> {}

/** Top of the card: holds `CardTitle` and `CardDescription`. */
export function CardHeader({ className, render, ...props }: CardHeaderProps) {
  return useRender({
    render,
    defaultTagName: "div",
    props: { "data-slot": "card-header", ...props, className: cn("flex flex-col gap-1 px-4", className) },
  });
}

export interface CardTitleProps extends useRender.ComponentProps<"h3"> {}

/** Title of the card. Change the heading level through `render`, e.g. `render={<h2 />}`. */
export function CardTitle({ className, render, ...props }: CardTitleProps) {
  return useRender({
    render,
    defaultTagName: "h3",
    props: { "data-slot": "card-title", ...props, className: cn("text-base font-semibold", className) },
  });
}

export interface CardDescriptionProps extends useRender.ComponentProps<"p"> {}

/** Supporting text under the title. */
export function CardDescription({ className, render, ...props }: CardDescriptionProps) {
  return useRender({
    render,
    defaultTagName: "p",
    props: { "data-slot": "card-description", ...props, className: cn("text-sm text-muted-foreground", className) },
  });
}

export interface CardContentProps extends useRender.ComponentProps<"div"> {}

/** Main body of the card. */
export function CardContent({ className, render, ...props }: CardContentProps) {
  return useRender({
    render,
    defaultTagName: "div",
    props: { "data-slot": "card-content", ...props, className: cn("px-4", className) },
  });
}

export interface CardFooterProps extends useRender.ComponentProps<"div"> {}

/** Bottom of the card, usually actions. */
export function CardFooter({ className, render, ...props }: CardFooterProps) {
  return useRender({
    render,
    defaultTagName: "div",
    props: { "data-slot": "card-footer", ...props, className: cn("flex items-center gap-2 px-4", className) },
  });
}
