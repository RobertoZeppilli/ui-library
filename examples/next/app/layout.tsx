import type { ReactNode } from "react";
import "./globals.css";

export const metadata = { title: "trama example" };

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-background font-sans text-foreground">{children}</body>
    </html>
  );
}
