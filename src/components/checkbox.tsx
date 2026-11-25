"use client";

import { Checkbox as CheckboxPrimitive } from "@base-ui/react/checkbox";
import { cn } from "../lib/cn";

export interface CheckboxProps extends CheckboxPrimitive.Root.Props {
  // Redeclared: Base UI documents these only on its state types, so they would reach the agent docs without a description.
  /** Whether the checkbox is checked (controlled). */
  checked?: boolean | undefined;
  /** Whether the checkbox is initially checked (uncontrolled). */
  defaultChecked?: boolean | undefined;
  /** Whether the checkbox is in a mixed state, neither checked nor unchecked. */
  indeterminate?: boolean | undefined;
  /** Whether the checkbox should ignore user interaction. */
  disabled?: boolean | undefined;
}

/** Checkbox with the shadcn/ui API on top of Base UI. Use it inside `Field` from Base UI for a label. */
export function Checkbox({ className, ...props }: CheckboxProps) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      {...props}
      className={(state) =>
        cn(
          "inline-flex size-4 shrink-0 items-center justify-center rounded-sm border-ui border-border bg-background text-primary-foreground",
          // outline-hidden sets outline-style: none, so focus-visible must set it back to solid
          "outline-hidden focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
          "data-checked:border-primary data-checked:bg-primary data-indeterminate:border-primary data-indeterminate:bg-primary",
          "data-disabled:cursor-not-allowed data-disabled:opacity-50",
          typeof className === "function" ? className(state) : className,
        )
      }
    >
      <CheckboxPrimitive.Indicator data-slot="checkbox-indicator" className="group flex items-center justify-center">
        <svg viewBox="0 0 16 16" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path className="group-data-indeterminate:hidden" d="M3.5 8.5l3 3 6-7" />
          <path className="hidden group-data-indeterminate:block" d="M4 8h8" />
        </svg>
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}
