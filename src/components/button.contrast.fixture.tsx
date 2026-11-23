import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "./button";

// Not a *.stories.tsx file on purpose: this story must fail axe, so only button.browser.test.tsx runs it.
const meta = { title: "Button/Fixtures", component: Button } satisfies Meta<typeof Button>;
export default meta;

export const LowContrast: StoryObj<typeof meta> = {
  args: { children: "Low contrast", style: { color: "#bbbbbb", backgroundColor: "#ffffff" } },
};
