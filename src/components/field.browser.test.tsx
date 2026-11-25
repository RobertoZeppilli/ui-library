import { composeStories } from "@storybook/react-vite";
import { within } from "storybook/test";
import { expect, it } from "vitest";
import * as stories from "./field.stories";

const { WithError } = composeStories(stories);

it("Field with an error: the input is aria-invalid and described by the error message", async () => {
  await WithError.run();
  const input = within(document.body).getByRole("textbox", { name: "Email" });
  expect(input).toHaveAttribute("aria-invalid", "true");
  const error = within(document.body).getByText("Enter a valid email address.");
  expect(error.id).not.toBe("");
  expect(input.getAttribute("aria-describedby")).toContain(error.id);
});
