import { afterEach as runAxe } from "@storybook/addon-a11y/preview";
import { withThemeByDataAttribute } from "@storybook/addon-themes";
import type { Preview } from "@storybook/react-vite";
import "../styles.css";
import "../themes/brutalista.css";

// Every story is checked with axe in each of these combinations. Add a theme here when it ships.
const themes = ["brutalista"];
const schemes = ["light", "dark"];

const preview: Preview = {
  afterEach: async (context) => {
    const root = document.documentElement;
    const { theme, scheme } = root.dataset;
    const failures: string[] = [];
    try {
      for (const t of themes) {
        for (const s of schemes) {
          root.dataset.theme = t;
          root.dataset.scheme = s;
          const reports: { status: string; result: unknown }[] = [];
          // The addon only throws in its own Vitest mode, so read its reports instead of relying on that.
          await runAxe({
            ...context,
            globals: { ...context.globals, a11y: { manual: false } },
            reporting: { addReport: (report) => void reports.push(report) },
          });
          const failed = reports.filter((r) => r.status === "failed");
          console.info(`axe ${context.id} [${t} ${s}] ${failed.length > 0 ? "FAIL" : "ok"}`);
          for (const { result } of failed) {
            const text =
              typeof result === "object" && result !== null && "violations" in result && Array.isArray(result.violations)
                ? result.violations.map((v: { id: string; nodes: unknown[] }) => `${v.id} x${v.nodes.length}`).join(", ")
                : String(result);
            failures.push(`[${t} ${s}] ${text}`);
          }
        }
      }
    } finally {
      for (const [key, value] of [["theme", theme], ["scheme", scheme]] as const) {
        if (value === undefined) delete root.dataset[key];
        else root.dataset[key] = value;
      }
    }
    if (failures.length > 0) throw new Error(`axe violations in ${context.id}:\n${failures.join("\n")}`);
  },
  decorators: [
    withThemeByDataAttribute({
      themes: { light: "light", dark: "dark" },
      defaultTheme: "light",
      attributeName: "data-scheme",
    }),
    (Story) => (
      <div className="min-h-screen bg-background font-sans text-foreground">
        <Story />
      </div>
    ),
  ],
  parameters: {
    a11y: {
      test: "error",
      options: { runOnly: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"] },
    },
  },
};

export default preview;
