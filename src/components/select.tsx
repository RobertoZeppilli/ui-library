"use client";

import { Select as SelectPrimitive } from "@base-ui/react/select";
import { createContext, useContext, useState } from "react";
import { cn } from "../lib/cn";

// Each part resolves className the same way: Base UI allows a string or a function of its state.
function merge<S>(base: string, className: string | ((state: S) => string | undefined) | undefined) {
  return (state: S) => cn(base, typeof className === "function" ? className(state) : className);
}

// The popup is portaled to <body>, away from the data-theme / data-scheme of the subtree it opens from.
// The trigger registers itself here so the popup can read them back.
// State rather than a ref: a select that starts open mounts its popup before the trigger's ref is attached.
const TriggerContext = createContext<[HTMLButtonElement | null, (node: HTMLButtonElement | null) => void]>([null, () => {}]);

export interface SelectProps<Value, Multiple extends boolean | undefined = false> extends SelectPrimitive.Root.Props<Value, Multiple> {}

/** Groups all parts of the select. Doesn't render an element. */
export function Select<Value, Multiple extends boolean | undefined = false>(props: SelectProps<Value, Multiple>) {
  const trigger = useState<HTMLButtonElement | null>(null);
  return (
    <TriggerContext value={trigger}>
      <SelectPrimitive.Root {...props} />
    </TriggerContext>
  );
}

export interface SelectTriggerProps extends SelectPrimitive.Trigger.Props {}

/** Button that opens the popup. Put `SelectValue` inside it. */
export function SelectTrigger({ className, children, ref, ...props }: SelectTriggerProps) {
  const [, setTrigger] = useContext(TriggerContext);
  return (
    <SelectPrimitive.Trigger
      data-slot="select-trigger"
      {...props}
      ref={(node) => {
        setTrigger(node);
        if (typeof ref === "function") ref(node);
        else if (ref) ref.current = node;
      }}
      className={merge(
        cn(
          "inline-flex h-9 items-center justify-between gap-2 rounded-md border-ui border-input bg-background px-3 text-sm text-foreground whitespace-nowrap",
          // outline-hidden sets outline-style: none, so focus-visible must set it back to solid
          "outline-hidden focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
          "data-popup-open:border-ring data-disabled:cursor-not-allowed data-disabled:opacity-50 data-placeholder:text-muted-foreground",
        ),
        className,
      )}
    >
      {children}
      <SelectPrimitive.Icon data-slot="select-icon" className="text-muted-foreground">
        <svg viewBox="0 0 16 16" className="size-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="M4 6l4 4 4-4" />
        </svg>
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  );
}

export interface SelectValueProps extends SelectPrimitive.Value.Props {}

/** Shows the label of the selected item, or `placeholder` when nothing is selected. */
export function SelectValue({ className, ...props }: SelectValueProps) {
  return <SelectPrimitive.Value data-slot="select-value" {...props} className={merge("truncate", className)} />;
}

export interface SelectContentProps
  extends SelectPrimitive.Popup.Props,
    Pick<SelectPrimitive.Positioner.Props, "side" | "align" | "sideOffset" | "alignItemWithTrigger"> {}

/** Popup with the list of items, in a portal. It takes the theme and scheme of the subtree the trigger is in. */
export function SelectContent({
  className,
  children,
  side,
  align,
  sideOffset = 4,
  alignItemWithTrigger,
  ...props
}: SelectContentProps) {
  const [trigger] = useContext(TriggerContext);
  const theme = trigger?.closest<HTMLElement>("[data-theme]")?.dataset.theme;
  const scheme = trigger?.closest<HTMLElement>("[data-scheme]")?.dataset.scheme;
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Positioner
        data-theme={theme}
        data-scheme={scheme}
        side={side}
        align={align}
        sideOffset={sideOffset}
        alignItemWithTrigger={alignItemWithTrigger}
        className="z-50"
      >
        <SelectPrimitive.Popup
          data-slot="select-content"
          {...props}
          className={merge(
            "max-h-(--available-height) min-w-(--anchor-width) overflow-y-auto rounded-md border-ui border-border bg-popover p-1 text-popover-foreground shadow-md outline-hidden",
            className,
          )}        >
          <SelectPrimitive.List>{children}</SelectPrimitive.List>
        </SelectPrimitive.Popup>
      </SelectPrimitive.Positioner>
    </SelectPrimitive.Portal>
  );
}

export interface SelectItemProps extends SelectPrimitive.Item.Props {}

/** One choice. `value` is what `onValueChange` receives. */
export function SelectItem({ className, children, ...props }: SelectItemProps) {
  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      {...props}
      className={merge(
        cn(
          "grid cursor-default grid-cols-[1rem_1fr] items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none",
          "data-highlighted:bg-accent data-highlighted:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50",
        ),
        className,
      )}
    >
      <SelectPrimitive.ItemIndicator data-slot="select-item-indicator" className="col-start-1">
        <svg viewBox="0 0 16 16" className="size-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="M3.5 8.5l3 3 6-7" />
        </svg>
      </SelectPrimitive.ItemIndicator>
      <SelectPrimitive.ItemText className="col-start-2">{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  );
}

export interface SelectGroupProps extends SelectPrimitive.Group.Props {}

/** Groups items under a `SelectLabel`. */
export function SelectGroup(props: SelectGroupProps) {
  return <SelectPrimitive.Group data-slot="select-group" {...props} />;
}

export interface SelectLabelProps extends SelectPrimitive.GroupLabel.Props {}

/** Label of a `SelectGroup`. */
export function SelectLabel({ className, ...props }: SelectLabelProps) {
  return <SelectPrimitive.GroupLabel data-slot="select-label" {...props} className={merge("px-2 py-1.5 text-xs text-muted-foreground", className)} />;
}

export interface SelectSeparatorProps extends SelectPrimitive.Separator.Props {}

/** Line between items or groups. */
export function SelectSeparator({ className, ...props }: SelectSeparatorProps) {
  return <SelectPrimitive.Separator data-slot="select-separator" {...props} className={merge("-mx-1 my-1 h-px bg-border", className)} />;
}
