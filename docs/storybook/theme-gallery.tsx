import { Button } from "../../src/components/button";

const themes = ["brutalista", "neon"];
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
            className="border-ui border-border bg-background p-4 font-sans text-foreground"
          >
            <h3 className="mb-3 text-base font-bold">
              {theme} / {scheme}
            </h3>
            <div className="flex flex-wrap gap-2">
              {variants.map((variant) => (
                <Button key={variant} variant={variant}>
                  {variant}
                </Button>
              ))}
            </div>
            <p className="mt-3 rounded-md bg-muted p-2 text-sm text-muted-foreground">Muted text on a muted surface.</p>
          </section>
        )),
      )}
    </div>
  );
}
