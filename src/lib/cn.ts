import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

// border-ui is the width utility from styles.css; without this tailwind-merge reads it as a border color.
const twMerge = extendTailwindMerge({ extend: { classGroups: { "border-w": ["border-ui"] } } });

/** Joins class names; on conflicts the last one wins, so a consumer's `className` beats the internal classes. */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
