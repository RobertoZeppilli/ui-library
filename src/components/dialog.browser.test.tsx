import { composeStories } from "@storybook/react-vite";
import { userEvent, waitFor, within } from "storybook/test";
import { expect, it } from "vitest";
import * as stories from "./dialog.stories";

const { Default, InThemedSubtree } = composeStories(stories);

it("open dialog: repeated Tab keeps focus inside it, Escape closes it and focus returns to the trigger", async () => {
  await Default.run();
  const trigger = within(document.body).getByRole("button", { name: "Open dialog" });
  await userEvent.tab();
  await userEvent.keyboard("{Enter}");
  const dialog = await waitFor(() => within(document.body).getByRole("dialog"));
  for (let i = 0; i < 6; i++) {
    await userEvent.tab();
    expect(dialog.contains(document.activeElement)).toBe(true);
  }
  await userEvent.keyboard("{Escape}");
  await waitFor(() => expect(within(document.body).queryByRole("dialog")).toBeNull());
  await waitFor(() => expect(trigger).toHaveFocus());
});

it("the portaled popup takes the theme of the subtree it opens from", async () => {
  document.documentElement.dataset.theme = "brutalista";
  try {
    await InThemedSubtree.run();
    const popup = await waitFor(() => within(document.body).getByRole("dialog"));
    // neon radius is 0.625rem, brutalista is 0rem
    expect(getComputedStyle(popup).getPropertyValue("--ui-radius").trim()).toBe("0.625rem");
  } finally {
    delete document.documentElement.dataset.theme;
  }
});
