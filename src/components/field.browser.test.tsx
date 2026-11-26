import { composeStories } from "@storybook/react-vite";
import { userEvent, within } from "storybook/test";
import { expect, it } from "vitest";
import * as stories from "./field.stories";

const { WithError, ControlledError } = composeStories(stories);

it("Field with a controlled invalid: the error shows only while the field is invalid", async () => {
  await ControlledError.run();
  const screen = within(document.body);
  const input = screen.getByRole("textbox", { name: "Email" });
  expect(screen.queryByText("Enter a valid email address.")).toBeNull();
  await userEvent.clear(input);
  await userEvent.type(input, "nope");
  expect(screen.getByText("Enter a valid email address.")).toBeVisible();
  await userEvent.type(input, "@b.co");
  await expect.poll(() => screen.queryByText("Enter a valid email address.")).toBeNull();
});

it("Field with an error: the input is aria-invalid and described by the error message", async () => {
  await WithError.run();
  const input = within(document.body).getByRole("textbox", { name: "Email" });
  expect(input).toHaveAttribute("aria-invalid", "true");
  const error = within(document.body).getByText("Enter a valid email address.");
  expect(error.id).not.toBe("");
  expect(input.getAttribute("aria-describedby")).toContain(error.id);
});
