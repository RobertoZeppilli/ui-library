import { withThemeByDataAttribute } from "@storybook/addon-themes";
import type { Preview } from "@storybook/react-vite";
import "../styles.css";
import "../themes/brutalista.css";

const preview: Preview = {
  decorators: [
    withThemeByDataAttribute({
      themes: { light: "light", dark: "dark" },
      defaultTheme: "light",
      attributeName: "data-scheme",
    }),
  ],
  parameters: {
    a11y: {
      test: "error",
      options: { runOnly: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"] },
    },
  },
};

export default preview;
