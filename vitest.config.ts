import tailwindcss from "@tailwindcss/vite";
import { storybookTest } from "@storybook/addon-vitest/vitest-plugin";
import { playwright } from "@vitest/browser-playwright";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    projects: [
      { test: { name: "unit", include: ["tests/**/*.test.ts"] } },
      {
        // Tailwind must run so the utilities exist when computed styles are read.
        plugins: [tailwindcss()],
        test: {
          name: "browser",
          include: ["src/**/*.browser.test.tsx"],
          browser: { enabled: true, headless: true, provider: playwright(), instances: [{ browser: "chromium" }] },
          setupFiles: [".storybook/vitest.setup.ts"],
        },
      },
      {
        plugins: [storybookTest({ configDir: ".storybook" })],
        test: {
          name: "storybook",
          browser: { enabled: true, headless: true, provider: playwright(), instances: [{ browser: "chromium" }] },
          setupFiles: [".storybook/vitest.setup.ts"],
        },
      },
    ],
  },
});
