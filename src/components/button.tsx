import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cn } from "../lib/cn";

const variants = {
  default: "bg-primary text-primary-foreground hover:bg-primary/90",
  outline: "border-ui border-border bg-background text-foreground hover:bg-muted",
  secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
  ghost: "text-foreground hover:bg-muted",
  destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
  link: "text-primary underline-offset-4 hover:underline",
} as const;

const sizes = {
  default: "h-8 gap-1.5 px-2.5",
  xs: "h-6 gap-1 px-2 text-xs",
  sm: "h-7 gap-1 px-2.5 text-[0.8rem]",
  lg: "h-9 gap-1.5 px-3",
  icon: "size-8",
  "icon-xs": "size-6",
  "icon-sm": "size-7",
  "icon-lg": "size-9",
} as const;

export interface ButtonProps extends ButtonPrimitive.Props {
  /** Visual emphasis. Same values as shadcn/ui. @default "default" */
  variant?: keyof typeof variants;
  /** Height and padding. Same values as shadcn/ui. @default "default" */
  size?: keyof typeof sizes;
}

/** Button with the shadcn/ui API on top of Base UI. Polymorphism goes through `render`, not `asChild` or `as`. */
export function Button({ className, variant = "default", size = "default", ...props }: ButtonProps) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-md text-sm font-medium whitespace-nowrap select-none",
        "outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
        "disabled:pointer-events-none disabled:opacity-50",
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    />
  );
}
