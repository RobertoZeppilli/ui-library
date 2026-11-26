import type { Meta, StoryObj } from "@storybook/react-vite";
import { useEffect } from "react";
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

// Shown on mount, so the screenshots and axe run see a visible toast.
export const Visible: Story = {
  render: (args) => (
    <ToastProvider {...args}>
      <ShowOnMount />
    </ToastProvider>
  ),
  args: { timeout: 0 },
};

function ShowOnMount() {
  useEffect(() => {
    toast({ title: "Changes saved", description: "Your profile is up to date.", timeout: 0 });
  }, []);
  return <div className="p-4 text-foreground">Page content</div>;
}
