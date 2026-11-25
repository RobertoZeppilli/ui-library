import { createRoot } from "react-dom/client";
import { flushSync } from "react-dom";
import { page } from "vitest/browser";
import { expect, it } from "vitest";
import { Stack } from "./stack";

it("responsive direction and gap follow the viewport width", async () => {
  const host = document.createElement("div");
  document.body.append(host);
  const root = createRoot(host);
  flushSync(() =>
    root.render(
      <Stack data-testid="stack" direction={{ initial: "column", md: "row" }} gap={{ initial: "2", md: "4" }}>
        <span>a</span>
        <span>b</span>
      </Stack>,
    ),
  );
  const stack = host.firstElementChild!;
  try {
    await page.viewport(390, 900);
    expect(getComputedStyle(stack).flexDirection).toBe("column");
    const narrowGap = getComputedStyle(stack).rowGap;
    await page.viewport(1024, 900);
    expect(getComputedStyle(stack).flexDirection).toBe("row");
    expect(getComputedStyle(stack).columnGap).not.toBe(narrowGap);
  } finally {
    root.unmount();
    host.remove();
  }
});
