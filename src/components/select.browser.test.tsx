import { composeStories } from "@storybook/react-vite";
import { userEvent, waitFor, within } from "storybook/test";
import { expect, it } from "vitest";
import * as stories from "./select.stories";

const { Default, InThemedSubtree } = composeStories(stories);

it("opened by keyboard, ArrowDown then Enter calls onValueChange with the second value and focus returns to the trigger", async () => {
  await Default.run();
  const trigger = within(document.body).getByRole("combobox");
  await userEvent.tab();
  await userEvent.keyboard("{Enter}");
  await waitFor(() => expect(within(document.body).getByRole("listbox")).toBeTruthy());
  await userEvent.keyboard("{ArrowDown}");
  await userEvent.keyboard("{Enter}");
  expect(Default.args.onValueChange).toHaveBeenCalledWith("banana", expect.anything());
  await waitFor(() => expect(trigger).toHaveFocus());
});

it("each opening takes the theme the trigger's subtree has at that moment", async () => {
  await Default.run();
  document.documentElement.dataset.theme = "neon";
  try {
    await userEvent.tab();
    await userEvent.keyboard("{Enter}");
    const popup = await waitFor(() => {
      const el = document.querySelector('[data-slot="select-content"]');
      if (!el) throw new Error("popup not mounted");
      return el;
    });
    expect(getComputedStyle(popup).getPropertyValue("--ui-radius").trim()).toBe("0.625rem");
  } finally {
    delete document.documentElement.dataset.theme;
  }
});

it("the trigger shows the label of the chosen item", async () => {
  await Default.run();
  await userEvent.tab();
  await userEvent.keyboard("{Enter}");
  await waitFor(() => expect(within(document.body).getByRole("listbox")).toBeTruthy());
  await userEvent.keyboard("{ArrowDown}");
  await userEvent.keyboard("{Enter}");
  await waitFor(() => expect(within(document.body).getByRole("combobox").textContent).toContain("Banana"));
});

it("the portaled popup takes the theme of the subtree it opens from", async () => {
  document.documentElement.dataset.theme = "brutalista";
  try {
    await InThemedSubtree.run();
    const popup = await waitFor(() => {
      const el = document.querySelector('[data-slot="select-content"]');
      if (!el) throw new Error("popup not mounted");
      return el;
    });
    // neon radius is 0.625rem, brutalista is 0rem
    expect(getComputedStyle(popup).getPropertyValue("--ui-radius").trim()).toBe("0.625rem");
  } finally {
    delete document.documentElement.dataset.theme;
  }
});
