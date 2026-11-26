# trama

## 0.1.2

### Patch Changes

- 51eccb3: Agent docs: explain that `FieldError` needs `match={invalid}` to hide while the field is valid, document `toast()` in the index, make the Select example self-contained, and narrow the self-check so it no longer flags a `dark` key in an object.

## 0.1.1

### Patch Changes

- fca67aa: Stabilize Select and Menu keyboard tests by waiting for the highlighted item before each key.

## 0.1.0

### Minor Changes

- 34cdb6b: Ship docs for agents in the package: one Markdown page per component and an index under `dist/docs/`, plus `dist/AGENTS.md` with the rules for people using trama. `Button` now documents `disabled`.
- 1f521e5: Add `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent` and `CardFooter`. Surface, text, shadow and radius come from the theme tokens.
- e89aa05: Add `Checkbox`, built on Base UI. It works controlled (`checked`, `onCheckedChange`) and uncontrolled (`defaultChecked`), and supports `indeterminate`. Put it inside Base UI's `Field` to get a label.
- 86eb711: Add `Dialog`, `DialogTrigger`, `DialogContent`, `DialogHeader`, `DialogTitle`, `DialogDescription`, `DialogFooter` and `DialogClose`. Focus is trapped while open, Escape closes it and returns focus to the trigger, and the portaled popup takes the theme and scheme of the subtree it opens from.
- 4eacb43: Add `Field`, `FieldLabel`, `FieldDescription`, `FieldError` and `Input`, built on Base UI. Inside `Field`, the input is linked to its label, description and error (`aria-describedby`, `aria-invalid`).
- fb69436: Add `Menu`, `MenuTrigger`, `MenuContent`, `MenuItem`, `MenuGroup`, `MenuLabel` and `MenuSeparator`. Arrow keys move between items, Enter activates one, Escape closes the menu and returns focus to the trigger, and the portaled popup takes the theme and scheme of the subtree it opens from.
- a515dd8: Add `Select` with trigger, value, content, item, group, label and separator parts. The popup opens in a portal and takes the theme and scheme of the subtree it was opened from.
- 806c566: Add `Stack`, a flex layout component. `direction`, `gap`, `align`, `justify` and `wrap` take a single value or a mobile-first responsive object like `{ initial: "2", md: "4" }`.
- 4fa99e4: Add `Text`, a layout component for text. `size` follows the theme's type scale and takes a single value or a responsive object like `{ initial: "base", md: "xl" }`. `tone` is `normal`, `muted` or `destructive`. `render` changes the element, e.g. `render={<h1 />}`.
- 7eb9416: Add `ToastProvider` and `toast()`. Mount the provider once; call `toast({ title, description })` from anywhere in the app. Toasts are announced in a live region, can be closed from the keyboard, and their motion is disabled under `prefers-reduced-motion`.
