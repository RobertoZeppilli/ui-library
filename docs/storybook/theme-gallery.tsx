import { Button } from "../../src/components/button";

const themes = ["brutalista", "neon", "carta"];
const schemes = ["light", "dark"];
const variants = ["default", "outline", "secondary", "ghost", "destructive", "link"] as const;

/** Each theme in each scheme, side by side, rendered with the real components. */
export function ThemeGallery() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {themes.flatMap((theme) =>
        schemes.map((scheme) => (
          <section
            key={`${theme}-${scheme}`}
            data-theme={theme}
            data-scheme={scheme}
            className="flex flex-col gap-3 border-ui border-border bg-background p-4 font-sans text-foreground"
          >
            {/* div, not h3/p: the docs stylesheet sets its own color on those and hides the theme tokens. */}
            <div className="text-base font-bold">
              {theme} / {scheme}
            </div>
            <div className="flex flex-wrap gap-2">
              {variants.map((variant) => (
                <Button key={variant} variant={variant}>
                  {variant}
                </Button>
              ))}
            </div>
            <div className="rounded-md bg-muted p-2 text-sm text-muted-foreground">Muted text on a muted surface.</div>
          </section>
        )),
      )}
    </div>
  );
}
