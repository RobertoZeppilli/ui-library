import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Joins class names; on conflicts the last one wins, so a consumer's `className` beats the internal classes. */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
