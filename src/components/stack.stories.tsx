import type { Meta, StoryObj } from "@storybook/react-vite";
import { Stack } from "./stack";

const meta = { title: "Stack", component: Stack } satisfies Meta<typeof Stack>;

export default meta;
type Story = StoryObj<typeof meta>;

const box = "rounded-md border-ui border-border bg-muted px-3 py-2 text-foreground";

export const Responsive: Story = {
  render: () => (
    <Stack direction={{ initial: "column", md: "row" }} gap={{ initial: "2", md: "4" }} className="p-4">
      <div className={box}>One</div>
      <div className={box}>Two</div>
      <div className={box}>Three</div>
    </Stack>
  ),
};
