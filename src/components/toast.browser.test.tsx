import { composeStories } from "@storybook/react-vite";
import { userEvent, waitFor, within } from "storybook/test";
import { expect, it } from "vitest";
import * as stories from "./toast.stories";

const { Default } = composeStories(stories);

it("a shown toast appears in a live region with its text, and closing it from the keyboard removes it", async () => {
  await Default.run();
  const body = within(document.body);
  await userEvent.click(body.getByRole("button", { name: "Show toast" }));

  const region = await waitFor(() => body.getByRole("region", { name: /notifications/i }));
  expect(region.getAttribute("aria-live")).toBeTruthy();
  await waitFor(() => expect(within(region).getByText("Changes saved")).toBeVisible());

  const close = within(region).getByRole("button", { name: /close/i });
  close.focus();
  await userEvent.keyboard("{Enter}");
  await waitFor(() => expect(within(region).queryByText("Changes saved")).toBeNull());
});
