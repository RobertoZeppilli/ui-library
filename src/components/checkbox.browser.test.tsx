import { composeStories } from "@storybook/react-vite";
import { userEvent } from "storybook/test";
import { expect, it } from "vitest";
import * as stories from "./checkbox.stories";

const { Default } = composeStories(stories);

it("Tab then Space calls onCheckedChange with true and the checkbox is checked", async () => {
  await Default.run();
  const checkbox = document.querySelector('[data-slot="checkbox"]')!;
  await userEvent.tab();
  expect(checkbox).toHaveFocus();
  await userEvent.keyboard(" ");
  expect(Default.args.onCheckedChange).toHaveBeenCalledWith(true, expect.anything());
  expect(checkbox.getAttribute("aria-checked")).toBe("true");
});
