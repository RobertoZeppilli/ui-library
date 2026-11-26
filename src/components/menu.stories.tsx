import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, screen, userEvent, waitFor } from "storybook/test";
import { Menu, MenuContent, MenuGroup, MenuItem, MenuLabel, MenuSeparator, MenuTrigger } from "./menu";

const onSelect = fn();

function Actions({ onSelect, ...props }: { onSelect?: () => void } & Omit<React.ComponentProps<typeof Menu>, "children">) {
  return (
    <Menu {...props}>
      <MenuTrigger>Actions</MenuTrigger>
      <MenuContent>
        <MenuGroup>
          <MenuLabel>Document</MenuLabel>
          <MenuItem onClick={onSelect}>Rename</MenuItem>
          <MenuItem onClick={onSelect}>Duplicate</MenuItem>
        </MenuGroup>
        <MenuSeparator />
        <MenuItem disabled>Archive</MenuItem>
      </MenuContent>
    </Menu>
  );
}

const meta = {
  title: "Menu",
  component: Menu,
  render: (args) => (
    <div className="p-4">
      <Actions {...args} onSelect={onSelect} />
    </div>
  ),
  // The popup lives in a portal outside the story root, so axe has to look at the whole body.
  parameters: { a11y: { context: "body" }, layout: "fullscreen" },
} satisfies Meta<typeof Menu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Open: Story = { args: { defaultOpen: true } };

export const InThemedSubtree: Story = {
  args: { defaultOpen: true },
  render: (args) => (
    <div className="p-4" data-theme="neon" data-scheme="dark">
      <div className="bg-background p-4 text-foreground">
        <Actions {...args} />
      </div>
    </div>
  ),
};

export const Keyboard: Story = {
  play: async ({ canvas }) => {
    onSelect.mockClear();
    const trigger = canvas.getByRole("button", { name: "Actions" });
    await userEvent.tab();
    await expect(trigger).toHaveFocus();
    // A focus indicator must actually paint, not just move focus (WCAG 2.4.7).
    await expect(getComputedStyle(trigger).outlineStyle).not.toBe("none");
    await userEvent.keyboard("{Enter}");
    await waitFor(() => expect(screen.getByRole("menu")).toBeVisible());
    await userEvent.keyboard("{ArrowDown}");
    await userEvent.keyboard("{Enter}");
    await expect(onSelect).toHaveBeenCalledTimes(1);
    await waitFor(() => expect(screen.queryByRole("menu")).toBeNull());
    await expect(trigger).toHaveFocus();
  },
};

export const Escape: Story = {
  play: async ({ canvas }) => {
    await userEvent.tab();
    await userEvent.keyboard("{Enter}");
    await waitFor(() => expect(screen.getByRole("menu")).toBeVisible());
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByRole("menu")).toBeNull());
    await expect(canvas.getByRole("button", { name: "Actions" })).toHaveFocus();
  },
};
