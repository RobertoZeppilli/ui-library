"use client";

import { Toast as ToastPrimitive } from "@base-ui/react/toast";
import { cn } from "../lib/cn";

// Module-level so `toast()` works from anywhere, including outside React.
// shortcut: one manager per module instance, so two providers on a page share their toasts; upgrade if that matters.
const manager = ToastPrimitive.createToastManager();

/** Shows a toast from anywhere in the app. Needs a `ToastProvider` mounted. Returns the toast id. */
export function toast(options: Parameters<typeof manager.add>[0]) {
  return manager.add(options);
}

/** Closes the toast with the given id, or all toasts when called without one. */
toast.close = manager.close;

function ToastList() {
  const { toasts } = ToastPrimitive.useToastManager();
  return toasts.map((t) => (
    <ToastPrimitive.Root
      key={t.id}
      toast={t}
      data-slot="toast"
      className={cn(
        "absolute right-0 bottom-0 flex w-full items-start gap-2 rounded-lg border-ui border-border bg-popover p-4 text-popover-foreground shadow-md transition-[opacity,translate] duration-200 motion-reduce:transition-none",
        "data-starting-style:translate-y-2 data-starting-style:opacity-0 data-ending-style:opacity-0",
      )}
    >
      <ToastPrimitive.Content data-slot="toast-content" className="grid flex-1 gap-1">
        <ToastPrimitive.Title data-slot="toast-title" className="text-sm leading-none font-semibold" />
        <ToastPrimitive.Description data-slot="toast-description" className="text-sm text-muted-foreground" />
      </ToastPrimitive.Content>
      <ToastPrimitive.Close
        data-slot="toast-close"
        aria-label="Close"
        className="rounded-sm px-1 text-sm leading-none text-muted-foreground outline-offset-2 hover:text-foreground focus-visible:outline-2"
      >
        ×
      </ToastPrimitive.Close>
    </ToastPrimitive.Root>
  ));
}

export interface ToastProviderProps extends Omit<ToastPrimitive.Provider.Props, "toastManager"> {}

/** Mounts the toast region once, near the root of the app. Toasts are shown with `toast()`. */
export function ToastProvider({ children, ...props }: ToastProviderProps) {
  return (
    <ToastPrimitive.Provider toastManager={manager} {...props}>
      {children}
      <ToastPrimitive.Portal>
        <ToastPrimitive.Viewport
          data-slot="toast-viewport"
          className="fixed right-4 bottom-4 z-50 w-[calc(100%-var(--spacing)*8)] max-w-sm font-sans"
        >
          <ToastList />
        </ToastPrimitive.Viewport>
      </ToastPrimitive.Portal>
    </ToastPrimitive.Provider>
  );
}
