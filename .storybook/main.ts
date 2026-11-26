import tailwindcss from "@tailwindcss/vite";
import type { StorybookConfig } from "@storybook/react-vite";

const config: StorybookConfig = {
  framework: "@storybook/react-vite",
  stories: ["../src/**/*.stories.tsx", "../docs/storybook/**/*.mdx"],
  addons: ["@storybook/addon-docs", "@storybook/addon-vitest", "@storybook/addon-a11y", "@storybook/addon-themes"],
  viteFinal: (config) => ({ ...config, plugins: [...(config.plugins ?? []), tailwindcss()] }),
};

export default config;
