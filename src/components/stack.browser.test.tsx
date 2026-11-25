import { composeStories } from "@storybook/react-vite";
import { page } from "vitest/browser";
import { expect, it } from "vitest";
import * as stories from "./stack.stories";

const { Responsive } = composeStories(stories);

it("responsive direction and gap follow the viewport width", async () => {
  await Responsive.run();
  const stack = document.querySelector('[data-slot="stack"]')!;
  await page.viewport(390, 900);
  expect(getComputedStyle(stack).flexDirection).toBe("column");
  const narrowGap = getComputedStyle(stack).rowGap;
  await page.viewport(1024, 900);
  expect(getComputedStyle(stack).flexDirection).toBe("row");
  expect(getComputedStyle(stack).columnGap).not.toBe(narrowGap);
});
