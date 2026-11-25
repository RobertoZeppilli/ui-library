"use client";

import { Field as FieldPrimitive } from "@base-ui/react/field";
import { cn } from "../lib/cn";

// Each part resolves className the same way: Base UI allows a string or a function of its state.
function merge<S>(base: string, className: string | ((state: S) => string | undefined) | undefined) {
  return (state: S) => cn(base, typeof className === "function" ? className(state) : className);
}

export interface FieldProps extends FieldPrimitive.Root.Props {
  // Redeclared: Base UI documents these only on its state types, so they would reach the agent docs without a description.
  /** Whether the field is invalid. Marks the input `aria-invalid` and lets `FieldError` render. */
  invalid?: boolean | undefined;
  /** Whether the field and its input should ignore user interaction. */
  disabled?: boolean | undefined;
}

/** Groups a label, an input, a description and an error, and links them for assistive technology. */
export function Field({ className, ...props }: FieldProps) {
  return <FieldPrimitive.Root data-slot="field" {...props} className={merge("flex flex-col gap-2", className)} />;
}

export interface FieldLabelProps extends FieldPrimitive.Label.Props {}

/** Accessible name of the input in the same `Field`. */
export function FieldLabel({ className, ...props }: FieldLabelProps) {
  return (
    <FieldPrimitive.Label
      data-slot="field-label"
      {...props}
      className={merge("text-sm font-semibold text-foreground data-disabled:opacity-50", className)}
    />
  );
}

export interface FieldDescriptionProps extends FieldPrimitive.Description.Props {}

/** Helper text, announced through `aria-describedby` on the input. */
export function FieldDescription({ className, ...props }: FieldDescriptionProps) {
  return (
    <FieldPrimitive.Description
      data-slot="field-description"
      {...props}
      className={merge("text-sm text-muted-foreground", className)}
    />
  );
}

export interface FieldErrorProps extends FieldPrimitive.Error.Props {}

/** Error message, announced through `aria-describedby` on the input. Set `match` to show it regardless of the validity state. */
export function FieldError({ className, ...props }: FieldErrorProps) {
  return <FieldPrimitive.Error data-slot="field-error" {...props} className={merge("text-sm font-semibold text-destructive", className)} />;
}
