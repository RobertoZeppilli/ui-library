import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, fn } from "storybook/test";
import { Button } from "./button";

const variants = ["default", "outline", "secondary", "ghost", "destructive", "link"] as const;
const sizes = ["default", "xs", "sm", "lg"] as const;

const meta = {
  title: "Button",
  component: Button,
  args: { children: "Button", onClick: fn() },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Variants: Story = {
  render: () => (
    <div className="flex flex-col gap-4 p-4">
      {variants.map((variant) => (
        <div key={variant} className="flex flex-wrap items-center gap-2">
          {sizes.map((size) => (
            <Button key={size} variant={variant} size={size}>
              {variant} {size}
            </Button>
          ))}
          <Button variant={variant} size="icon" aria-label={`${variant} icon`}>
            +
          </Button>
        </div>
      ))}
    </div>
  ),
};

export const Keyboard: Story = {
  play: async ({ canvas, args }) => {
    const button = canvas.getByRole("button");
    await userEvent.tab();
    await expect(button).toHaveFocus();
    // A focus indicator must actually paint, not just move focus (WCAG 2.4.7).
    await expect(getComputedStyle(button).outlineStyle).not.toBe("none");
    await userEvent.keyboard("{Enter}");
    await expect(args.onClick).toHaveBeenCalledTimes(1);
    await userEvent.keyboard(" ");
    await expect(args.onClick).toHaveBeenCalledTimes(2);
  },
};
