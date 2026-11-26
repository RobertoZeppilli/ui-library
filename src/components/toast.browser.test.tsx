import { composeStories } from "@storybook/react-vite";
import { userEvent, waitFor, within } from "storybook/test";
import { expect, it } from "vitest";
import * as stories from "./toast.stories";
import { toast } from "./toast";

const { Default } = composeStories(stories);

it("two toasts shown together are both visible and do not overlap", async () => {
  await Default.run();
  const body = within(document.body);
  toast({ title: "First toast", timeout: 0 });
  toast({ title: "Second toast", timeout: 0 });

  const first = await waitFor(() => body.getByRole("dialog", { name: "First toast" }));
  const second = await waitFor(() => body.getByRole("dialog", { name: "Second toast" }));
  await waitFor(() => expect(first).toBeVisible());
  await waitFor(() => expect(second).toBeVisible());
  const a = first.getBoundingClientRect();
  const b = second.getBoundingClientRect();
  expect(a.bottom <= b.top + 0.5 || b.bottom <= a.top + 0.5).toBe(true);
});

it("a shown toast appears in a live region with its text, and closing it from the keyboard removes it", async () => {
  await Default.run();
  const body = within(document.body);
  await userEvent.click(body.getByRole("button", { name: "Show toast" }));

  const region = await waitFor(() => body.getByRole("region", { name: /notifications/i }));
  expect(region.getAttribute("aria-live")).toBeTruthy();
  await waitFor(() => expect(within(region).getByText("Changes saved")).toBeVisible());

  // Base UI keeps Close aria-hidden until the toast is expanded or focused, so reach it by focus, as a keyboard user does.
  const close = within(region).getByRole("button", { hidden: true });
  close.focus();
  await userEvent.keyboard("{Enter}");
  await waitFor(() => expect(within(region).queryByText("Changes saved")).toBeNull());
});
