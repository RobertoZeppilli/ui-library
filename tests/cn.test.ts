import { expect, it } from "vitest";
import { cn } from "../src/lib/cn";

it("keeps border-ui (width) next to a border color", () => {
  expect(cn("border-ui border-border")).toBe("border-ui border-border");
});

it("lets the last class win on a real conflict", () => {
  expect(cn("px-2", "px-4")).toBe("px-4");
});
