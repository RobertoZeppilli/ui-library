import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, screen, waitFor } from "storybook/test";
import { Button } from "./button";
import { ToastProvider, toast } from "./toast";

const meta = {
  title: "Toast",
  component: ToastProvider,
  render: (args) => (
    <ToastProvider {...args}>
      <div className="p-4">
        <Button onClick={() => toast({ title: "Changes saved", description: "Your profile is up to date." })}>Show toast</Button>
      </div>
    </ToastProvider>
  ),
  // The viewport lives in a portal outside the story root, so axe has to look at the whole body.
  parameters: { a11y: { context: "body" }, layout: "fullscreen" },
} satisfies Meta<typeof ToastProvider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

// A toast that stays up, so the screenshots and the axe run see it. Shown in `play`: the provider subscribes after mount.
export const Visible: Story = {
  args: { timeout: 0 },
  play: async () => {
    toast({ title: "Changes saved", description: "Your profile is up to date." });
    await waitFor(() => expect(screen.getByText("Changes saved")).toBeVisible());
  },
};
