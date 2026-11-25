import { Field } from "@base-ui/react/field";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent } from "storybook/test";
import { Checkbox } from "./checkbox";

const meta = {
  title: "Checkbox",
  component: Checkbox,
  args: { "aria-label": "Accept terms", onCheckedChange: fn() },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const States: Story = {
  render: () => (
    <div className="flex items-center gap-4 p-4">
      <Checkbox aria-label="Unchecked" />
      <Checkbox aria-label="Checked" defaultChecked />
      <Checkbox aria-label="Indeterminate" indeterminate />
      <Checkbox aria-label="Disabled" disabled />
    </div>
  ),
};

export const WithLabel: Story = {
  render: () => (
    <div className="p-4">
      <Field.Root>
        <Field.Label className="flex items-center gap-2 text-sm">
          <Checkbox aria-label={undefined} /> Accept terms
        </Field.Label>
      </Field.Root>
    </div>
  ),
};

export const Keyboard: Story = {
  play: async ({ canvas, args }) => {
    const checkbox = canvas.getByRole("checkbox");
    await userEvent.tab();
    await expect(checkbox).toHaveFocus();
    // A focus indicator must actually paint, not just move focus (WCAG 2.4.7).
    await expect(getComputedStyle(checkbox).outlineStyle).not.toBe("none");
    await userEvent.keyboard(" ");
    await expect(args.onCheckedChange).toHaveBeenCalledWith(true, expect.anything());
    await expect(checkbox).toBeChecked();
  },
};
