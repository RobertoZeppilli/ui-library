import type { ReactNode } from "react";
import "./globals.css";

export const metadata = { title: "trama example" };

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    // same initial values as ThemeSwitch, so the prerendered page matches its first state
    <html lang="en" data-theme="brutalista" data-scheme="light">
      <body className="bg-background font-sans text-foreground">{children}</body>
    </html>
  );
}
