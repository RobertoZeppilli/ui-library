import { Input as InputPrimitive } from "@base-ui/react/input";
import { cn } from "../lib/cn";

export interface InputProps extends InputPrimitive.Props {}

/** Text input with the shadcn/ui API on top of Base UI. Inside `Field` it is linked to the label, description and error. */
export function Input({ className, ...props }: InputProps) {
  return (
    <InputPrimitive
      data-slot="input"
      {...props}
      className={(state) =>
        cn(
          "w-full rounded-md border-ui border-input bg-background px-3 py-2 text-base text-foreground placeholder:text-muted-foreground",
          // outline-hidden sets outline-style: none, so focus-visible must set it back to solid
          "outline-hidden focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
          "aria-invalid:border-destructive data-invalid:border-destructive",
          "disabled:cursor-not-allowed disabled:opacity-50",
          typeof className === "function" ? className(state) : className,
        )
      }
    />
  );
}
