import type { Meta, StoryObj } from "@storybook/react-vite";
import { Text } from "./text";

const meta = { title: "Text", component: Text } satisfies Meta<typeof Text>;

export default meta;
type Story = StoryObj<typeof meta>;

const sizes = ["xs", "sm", "base", "lg", "xl", "2xl", "3xl"] as const;
const tones = ["normal", "muted", "destructive"] as const;

export const All: Story = {
  render: () => (
    <div className="flex flex-col gap-4 p-4">
      {tones.map((tone) => (
        <div key={tone} className="flex flex-col gap-1">
          {sizes.map((size) => (
            <Text key={size} size={size} tone={tone}>
              {tone} {size}
            </Text>
          ))}
        </div>
      ))}
      <Text size={{ initial: "base", md: "2xl" }}>Responsive: base, 2xl from md</Text>
    </div>
  ),
};

export const AsHeading: Story = {
  render: () => (
    <Text render={<h2 />} size="xl" tone="muted">
      Heading
    </Text>
  ),
};
