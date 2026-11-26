import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, screen, userEvent, waitFor } from "storybook/test";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectSeparator, SelectTrigger, SelectValue } from "./select";

function Fruits({ triggerLabel = "Fruit", ...props }: { triggerLabel?: string } & Omit<React.ComponentProps<typeof Select>, "children">) {
  return (
    <Select {...props} items={{ apple: "Apple", banana: "Banana", cherry: "Cherry" }}>
      <SelectTrigger aria-label={triggerLabel} className="w-48">
        <SelectValue placeholder="Pick a fruit" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Fruits</SelectLabel>
          <SelectItem value="apple">Apple</SelectItem>
          <SelectItem value="banana">Banana</SelectItem>
          <SelectItem value="cherry">Cherry</SelectItem>
        </SelectGroup>
        <SelectSeparator />
        <SelectItem value="none" disabled>
          None of these
        </SelectItem>
      </SelectContent>
    </Select>
  );
}

const meta = {
  title: "Select",
  component: Select,
  args: { onValueChange: fn() },
  render: (args) => (
    <div className="p-4">
      <Fruits {...args} />
    </div>
  ),
  // The popup lives in a portal outside the story root, so axe has to look at the whole body.
  parameters: { a11y: { context: "body" } },
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Open: Story = {
  args: { defaultOpen: true, defaultValue: "apple" },
  // A short canvas keeps the popup in the screenshot at 390px.
  parameters: { layout: "fullscreen" },
};

export const Disabled: Story = { args: { disabled: true } };

export const InThemedSubtree: Story = {
  args: { defaultOpen: true },
  render: (args) => (
    <div className="p-4" data-theme="neon" data-scheme="dark">
      <div className="bg-background p-4 text-foreground">
        <Fruits {...args} />
      </div>
    </div>
  ),
};

export const Keyboard: Story = {
  play: async ({ canvas, args }) => {
    const trigger = canvas.getByRole("combobox");
    await userEvent.tab();
    await expect(trigger).toHaveFocus();
    // A focus indicator must actually paint, not just move focus (WCAG 2.4.7).
    await expect(getComputedStyle(trigger).outlineStyle).not.toBe("none");
    await userEvent.keyboard("{Enter}");
    // Each key waits for the state it depends on: a key pressed before Base UI highlights an option is lost.
    await waitFor(() => expect(screen.getByRole("option", { name: "Apple" })).toHaveAttribute("data-highlighted"));
    await userEvent.keyboard("{ArrowDown}");
    await waitFor(() => expect(screen.getByRole("option", { name: "Banana" })).toHaveAttribute("data-highlighted"));
    await userEvent.keyboard("{Enter}");
    await expect(args.onValueChange).toHaveBeenCalledWith("banana", expect.anything());
    await waitFor(() => expect(screen.queryByRole("listbox")).toBeNull());
    await expect(trigger).toHaveFocus();
    await expect(trigger).toHaveTextContent("Banana");
  },
};

export const Typeahead: Story = {
  play: async ({ canvas, args }) => {
    await userEvent.tab();
    await userEvent.keyboard("{Enter}");
    await waitFor(() => expect(screen.getByRole("option", { name: "Apple" })).toHaveAttribute("data-highlighted"));
    await userEvent.keyboard("ch");
    await userEvent.keyboard("{Enter}");
    await expect(args.onValueChange).toHaveBeenCalledWith("cherry", expect.anything());
    await waitFor(() => expect(canvas.getByRole("combobox")).toHaveFocus());
  },
};

export const Escape: Story = {
  play: async ({ canvas, args }) => {
    await userEvent.tab();
    await userEvent.keyboard("{Enter}");
    await waitFor(() => expect(screen.getByRole("listbox")).toBeVisible());
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByRole("listbox")).toBeNull());
    await expect(args.onValueChange).not.toHaveBeenCalled();
    await expect(canvas.getByRole("combobox")).toHaveFocus();
  },
};
