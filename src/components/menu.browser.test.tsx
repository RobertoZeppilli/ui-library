import { composeStories } from "@storybook/react-vite";
import { userEvent, waitFor, within } from "storybook/test";
import { expect, it } from "vitest";
import * as stories from "./menu.stories";

const { Default, InThemedSubtree } = composeStories(stories);

it("menu opened from the keyboard: ArrowDown then Enter activates the item and closes the menu, focus returns to the trigger", async () => {
  await Default.run();
  const trigger = within(document.body).getByRole("button", { name: "Actions" });
  await userEvent.tab();
  await userEvent.keyboard("{Enter}");
  await waitFor(() => expect(within(document.body).getByRole("menu")).toBeVisible());
  await userEvent.keyboard("{ArrowDown}");
  await waitFor(() => expect(within(document.body).getByRole("menuitem", { name: "Duplicate" })).toHaveFocus());
  await userEvent.keyboard("{Enter}");
  await waitFor(() => expect(within(document.body).queryByRole("menu")).toBeNull());
  await waitFor(() => expect(trigger).toHaveFocus());
});

it("the portaled popup takes the theme of the subtree it opens from", async () => {
  document.documentElement.dataset.theme = "brutalista";
  try {
    await InThemedSubtree.run();
    const popup = await waitFor(() => within(document.body).getByRole("menu"));
    // neon radius is 0.625rem, brutalista is 0rem
    expect(getComputedStyle(popup).getPropertyValue("--ui-radius").trim()).toBe("0.625rem");
  } finally {
    delete document.documentElement.dataset.theme;
  }
});
