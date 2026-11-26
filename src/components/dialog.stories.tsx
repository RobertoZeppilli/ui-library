import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, screen, userEvent, waitFor } from "storybook/test";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./dialog";

function Example(props: Omit<React.ComponentProps<typeof Dialog>, "children">) {
  return (
    <Dialog {...props}>
      <DialogTrigger>Open dialog</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>Change how your name appears to others.</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose>Cancel</DialogClose>
          <DialogClose>Save</DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

const meta = {
  title: "Dialog",
  component: Dialog,
  render: (args) => (
    <div className="p-4">
      <Example {...args} />
    </div>
  ),
  // The popup lives in a portal outside the story root, so axe has to look at the whole body.
  parameters: { a11y: { context: "body" }, layout: "fullscreen" },
} satisfies Meta<typeof Dialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Open: Story = { args: { defaultOpen: true } };

export const InThemedSubtree: Story = {
  args: { defaultOpen: true },
  render: (args) => (
    <div className="p-4" data-theme="neon" data-scheme="dark">
      <div className="bg-background p-4 text-foreground">
        <Example {...args} />
      </div>
    </div>
  ),
};

export const Keyboard: Story = {
  play: async ({ canvas }) => {
    const trigger = canvas.getByRole("button", { name: "Open dialog" });
    await userEvent.tab();
    await expect(trigger).toHaveFocus();
    // A focus indicator must actually paint, not just move focus (WCAG 2.4.7).
    await expect(getComputedStyle(trigger).outlineStyle).not.toBe("none");
    await userEvent.keyboard("{Enter}");
    const dialog = await waitFor(() => {
      const el = screen.getByRole("dialog");
      expect(el).toBeVisible();
      return el;
    });
    for (let i = 0; i < 5; i++) {
      await userEvent.tab();
      await expect(dialog).toContainElement(document.activeElement as HTMLElement);
    }
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
    await expect(trigger).toHaveFocus();
  },
};
