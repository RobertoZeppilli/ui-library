"use client";

import { Menu as MenuPrimitive } from "@base-ui/react/menu";
import { createContext, useContext, useState } from "react";
import { cn } from "../lib/cn";
import { Button } from "./button";

// Each part resolves className the same way: Base UI allows a string or a function of its state.
function merge<S>(base: string, className: string | ((state: S) => string | undefined) | undefined) {
  return (state: S) => cn(base, typeof className === "function" ? className(state) : className);
}

// The popup is portaled to <body>, away from the data-theme / data-scheme of the subtree it opens from.
// The trigger registers itself here so the popup can read them back.
// State rather than a ref: a menu that starts open mounts its popup before the trigger's ref is attached.
const TriggerContext = createContext<[HTMLElement | null, (node: HTMLElement | null) => void]>([null, () => {}]);

export interface MenuProps extends MenuPrimitive.Root.Props {}

/** Groups all parts of the menu. Doesn't render an element. */
export function Menu(props: MenuProps) {
  const trigger = useState<HTMLElement | null>(null);
  return (
    <TriggerContext value={trigger}>
      <MenuPrimitive.Root {...props} />
    </TriggerContext>
  );
}

export interface MenuTriggerProps extends MenuPrimitive.Trigger.Props {}

/** Button that opens the menu. */
export function MenuTrigger({ ref, ...props }: MenuTriggerProps) {
  const [, setTrigger] = useContext(TriggerContext);
  return (
    <MenuPrimitive.Trigger
      data-slot="menu-trigger"
      render={<Button variant="outline" />}
      {...props}
      ref={(node: HTMLButtonElement | null) => {
        setTrigger(node);
        if (typeof ref === "function") ref(node);
        else if (ref) ref.current = node;
      }}
    />
  );
}

export interface MenuContentProps
  extends MenuPrimitive.Popup.Props,
    Pick<MenuPrimitive.Positioner.Props, "side" | "align" | "sideOffset"> {}

/** Popup with the list of items, in a portal. It takes the theme and scheme of the subtree the trigger is in. */
export function MenuContent({ className, side, align, sideOffset = 4, ...props }: MenuContentProps) {
  const [trigger] = useContext(TriggerContext);
  return (
    <MenuPrimitive.Portal>
      <MenuPrimitive.Positioner
        // Read when the popup mounts, so each opening takes the current theme and scheme of the trigger's subtree.
        ref={(node) => {
          if (!node || !trigger) return;
          for (const key of ["theme", "scheme"] as const) {
            const owner = trigger.closest<HTMLElement>(`[data-${key}]`);
            const value = owner?.dataset[key];
            // <html> is an ancestor of the portal too: inheriting keeps the popup following later changes on it.
            if (value === undefined || owner === document.documentElement) delete node.dataset[key];
            else node.dataset[key] = value;
          }
        }}
        side={side}
        align={align}
        sideOffset={sideOffset}
        className="z-50"
      >
        <MenuPrimitive.Popup
          data-slot="menu-content"
          {...props}
          className={merge(
            "min-w-40 overflow-y-auto rounded-lg border-ui border-border bg-popover p-1 font-sans text-popover-foreground shadow-md outline-hidden",
            className,
          )}
        />
      </MenuPrimitive.Positioner>
    </MenuPrimitive.Portal>
  );
}

export interface MenuItemProps extends MenuPrimitive.Item.Props {}

/** One action. `onClick` runs when it is activated; the menu then closes. */
export function MenuItem({ className, ...props }: MenuItemProps) {
  return (
    <MenuPrimitive.Item
      data-slot="menu-item"
      {...props}
      className={merge(
        "flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-highlighted:bg-accent data-highlighted:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50",
        className,
      )}
    />
  );
}

export interface MenuGroupProps extends MenuPrimitive.Group.Props {}

/** Groups items under a `MenuLabel`. */
export function MenuGroup(props: MenuGroupProps) {
  return <MenuPrimitive.Group data-slot="menu-group" {...props} />;
}

export interface MenuLabelProps extends MenuPrimitive.GroupLabel.Props {}

/** Label of a `MenuGroup`. */
export function MenuLabel({ className, ...props }: MenuLabelProps) {
  return <MenuPrimitive.GroupLabel data-slot="menu-label" {...props} className={merge("px-2 py-1.5 text-xs text-muted-foreground", className)} />;
}

export interface MenuSeparatorProps extends MenuPrimitive.Separator.Props {}

/** Line between items or groups. */
export function MenuSeparator({ className, ...props }: MenuSeparatorProps) {
  return <MenuPrimitive.Separator data-slot="menu-separator" {...props} className={merge("-mx-1 my-1 h-(--ui-border-width) bg-border", className)} />;
}
