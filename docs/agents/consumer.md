# trama

React components on Base UI with the shadcn/ui API, styled with Tailwind v4 through theme tokens.

## Docs

One page per component (props, `variant`/`size` values, examples): [docs/index.md](./docs/index.md). Read the page before you use a component. Breaking changes: [CHANGELOG.md](../CHANGELOG.md).

## Rules

- Polymorphism goes through `render`, never `asChild` or `as`: `<Button render={<a href="/x" />}>Go</Button>`.
- No `dark:` classes. Colors come from tokens (`bg-primary`, `text-foreground`, `border-border`); the theme and the scheme switch them with `data-theme` and `data-scheme` on `<html>`.
- Import the CSS once, after Tailwind: `@import "@robzepdev/trama/styles.css";` and one `@import "@robzepdev/trama/themes/<name>.css";` per theme (`brutalista`, `neon`).
- `className` is merged with the internal classes and wins on conflicts. Do not restyle a component with a global stylesheet.
- Use only the documented `variant` and `size` values. Do not invent new ones.

## Self-check

Before you finish: no `asChild`, no `dark:`, and every `variant`/`size` you wrote appears on the component's page.
