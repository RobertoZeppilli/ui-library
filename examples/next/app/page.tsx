import { Button, Checkbox, Stack } from "trama";
import { ThemeSwitch } from "./theme-switch";

const variants = ["default", "outline", "secondary", "ghost", "destructive", "link"] as const;
const sizes = ["default", "xs", "sm", "lg", "icon", "icon-xs", "icon-sm", "icon-lg"] as const;

export default function Page() {
  return (
    <main className="flex flex-col gap-6 p-6">
      <ThemeSwitch />
      <Stack direction={{ initial: "column", md: "row" }} gap={{ initial: "2", md: "4" }}>
        <Button>One</Button>
        <Button>Two</Button>
        <Button>Three</Button>
      </Stack>
      <div className="flex items-center gap-4">
        <Checkbox aria-label="Unchecked" />
        <Checkbox aria-label="Checked" defaultChecked />
        <Checkbox aria-label="Indeterminate" indeterminate />
      </div>
      <div className="flex flex-col gap-4">
        {variants.map((variant) => (
          <div key={variant} className="flex flex-wrap items-center gap-2">
            {sizes.map((size) => (
              <Button key={size} variant={variant} size={size} aria-label={`${variant} ${size}`}>
                {size.startsWith("icon") ? "+" : `${variant} ${size}`}
              </Button>
            ))}
          </div>
        ))}
      </div>
    </main>
  );
}
