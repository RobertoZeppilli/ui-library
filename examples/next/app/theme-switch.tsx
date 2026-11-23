"use client";

import { useEffect, useState } from "react";
import { Button } from "trama";

const themes = ["brutalista", "neon"] as const;
const schemes = ["light", "dark"] as const;

/** Sets data-theme and data-scheme on <html>, the two attributes of the token contract. */
export function ThemeSwitch() {
  const [theme, setTheme] = useState<(typeof themes)[number]>("brutalista");
  const [scheme, setScheme] = useState<(typeof schemes)[number]>("light");

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.dataset.scheme = scheme;
  }, [theme, scheme]);

  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label="Theme and scheme">
      {themes.map((t) => (
        <Button key={t} variant={t === theme ? "default" : "outline"} onClick={() => setTheme(t)}>
          {t}
        </Button>
      ))}
      {schemes.map((s) => (
        <Button key={s} variant={s === scheme ? "default" : "outline"} onClick={() => setScheme(s)}>
          {s}
        </Button>
      ))}
    </div>
  );
}
