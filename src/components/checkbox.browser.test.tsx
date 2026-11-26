import { composeStories } from "@storybook/react-vite";
import { expect as storyExpect, userEvent, within } from "storybook/test";
import { expect, it } from "vitest";
import * as stories from "./checkbox.stories";

const { Default } = composeStories(stories);

it("Tab then Space calls onCheckedChange with true and the checkbox is checked", async () => {
  await Default.run();
  const checkbox = within(document.body).getByRole("checkbox");
  await userEvent.tab();
  expect(checkbox).toHaveFocus();
  await userEvent.keyboard(" ");
  expect(Default.args.onCheckedChange).toHaveBeenCalledWith(true, expect.anything());
  await storyExpect(checkbox).toBeChecked();
});
