"use client";

import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { createContext, useContext, useState } from "react";
import { cn } from "../lib/cn";
import { Button } from "./button";

// Each part resolves className the same way: Base UI allows a string or a function of its state.
function merge<S>(base: string, className: string | ((state: S) => string | undefined) | undefined) {
  return (state: S) => cn(base, typeof className === "function" ? className(state) : className);
}

// The popup is portaled to <body>, away from the data-theme / data-scheme of the subtree it opens from.
// The trigger registers itself here so the popup can read them back.
// State rather than a ref: a dialog that starts open mounts its popup before the trigger's ref is attached.
const TriggerContext = createContext<[HTMLElement | null, (node: HTMLElement | null) => void]>([null, () => {}]);

export interface DialogProps extends DialogPrimitive.Root.Props {}

/** Groups all parts of the dialog. Doesn't render an element. */
export function Dialog(props: DialogProps) {
  const trigger = useState<HTMLElement | null>(null);
  return (
    <TriggerContext value={trigger}>
      <DialogPrimitive.Root {...props} />
    </TriggerContext>
  );
}

export interface DialogTriggerProps extends DialogPrimitive.Trigger.Props {}

/** Button that opens the dialog. */
export function DialogTrigger({ ref, ...props }: DialogTriggerProps) {
  const [, setTrigger] = useContext(TriggerContext);
  return (
    <DialogPrimitive.Trigger
      data-slot="dialog-trigger"
      render={<Button />}
      {...props}
      ref={(node: HTMLButtonElement | null) => {
        setTrigger(node);
        if (typeof ref === "function") ref(node);
        else if (ref) ref.current = node;
      }}
    />
  );
}

export interface DialogContentProps extends DialogPrimitive.Popup.Props {}

/** Popup with its backdrop, in a portal. It takes the theme and scheme of the subtree the trigger is in. */
export function DialogContent({ className, ...props }: DialogContentProps) {
  const [trigger] = useContext(TriggerContext);
  return (
    <DialogPrimitive.Portal
      // Read when the portal mounts, so each opening takes the current theme and scheme of the trigger's subtree.
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
    >
      <DialogPrimitive.Backdrop data-slot="dialog-backdrop" className="fixed inset-0 z-50 bg-foreground/50" />
      <DialogPrimitive.Popup
        data-slot="dialog-content"
        {...props}
        className={merge(
          "fixed top-1/2 left-1/2 z-50 grid w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 gap-4 rounded-lg border-ui border-border bg-popover p-6 font-sans text-popover-foreground shadow-lg outline-hidden",
          className,
        )}
      />
    </DialogPrimitive.Portal>
  );
}

export interface DialogHeaderProps extends React.ComponentProps<"div"> {}

/** Groups the title and description. */
export function DialogHeader({ className, ...props }: DialogHeaderProps) {
  return <div data-slot="dialog-header" {...props} className={cn("flex flex-col gap-1.5", className)} />;
}

export interface DialogFooterProps extends React.ComponentProps<"div"> {}

/** Holds the actions, usually `DialogClose` buttons. */
export function DialogFooter({ className, ...props }: DialogFooterProps) {
  return <div data-slot="dialog-footer" {...props} className={cn("flex flex-col-reverse gap-2 sm:flex-row sm:justify-end", className)} />;
}

export interface DialogTitleProps extends DialogPrimitive.Title.Props {}

/** Accessible name of the dialog. */
export function DialogTitle({ className, ...props }: DialogTitleProps) {
  return <DialogPrimitive.Title data-slot="dialog-title" {...props} className={merge("text-lg leading-none font-semibold", className)} />;
}

export interface DialogDescriptionProps extends DialogPrimitive.Description.Props {}

/** Accessible description of the dialog. */
export function DialogDescription({ className, ...props }: DialogDescriptionProps) {
  return <DialogPrimitive.Description data-slot="dialog-description" {...props} className={merge("text-sm text-muted-foreground", className)} />;
}

export interface DialogCloseProps extends DialogPrimitive.Close.Props {}

/** Button that closes the dialog. */
export function DialogClose(props: DialogCloseProps) {
  return <DialogPrimitive.Close data-slot="dialog-close" render={<Button variant="outline" />} {...props} />;
}
