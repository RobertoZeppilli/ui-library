import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent } from "storybook/test";
import { Field, FieldDescription, FieldError, FieldLabel } from "./field";
import { Input } from "./input";

const meta = {
  title: "Field",
  component: Field,
} satisfies Meta<typeof Field>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Field className="w-72 p-4">
      <FieldLabel>Email</FieldLabel>
      <Input type="email" placeholder="you@example.com" />
      <FieldDescription>We only use it to send the receipt.</FieldDescription>
    </Field>
  ),
};

export const WithError: Story = {
  render: () => (
    <Field invalid className="w-72 p-4">
      <FieldLabel>Email</FieldLabel>
      <Input type="email" defaultValue="not-an-email" />
      <FieldDescription>We only use it to send the receipt.</FieldDescription>
      <FieldError match>Enter a valid email address.</FieldError>
    </Field>
  ),
};

export const Disabled: Story = {
  render: () => (
    <Field disabled className="w-72 p-4">
      <FieldLabel>Email</FieldLabel>
      <Input type="email" />
    </Field>
  ),
};

export const Keyboard: Story = {
  render: Default.render!,
  play: async ({ canvas }) => {
    const input = canvas.getByRole("textbox", { name: "Email" });
    await userEvent.tab();
    await expect(input).toHaveFocus();
    // A focus indicator must actually paint, not just move focus (WCAG 2.4.7).
    await expect(getComputedStyle(input).outlineStyle).not.toBe("none");
    await userEvent.keyboard("a@b.co");
    await expect(input).toHaveValue("a@b.co");
  },
};
