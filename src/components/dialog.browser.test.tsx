import { composeStories } from "@storybook/react-vite";
import { userEvent, waitFor, within } from "storybook/test";
import { expect, it } from "vitest";
import * as stories from "./dialog.stories";

const { Default, Open, InThemedSubtree } = composeStories(stories);

// Paints any CSS color on a canvas and returns its relative luminance, so oklch() and color-mix() both resolve.
function luminance(color: string) {
  const ctx = document.createElement("canvas").getContext("2d", { colorSpace: "srgb" })!;
  ctx.fillStyle = "#000";
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, 1, 1);
  const [r, g, b] = Array.from(ctx.getImageData(0, 0, 1, 1).data).map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r! + 0.7152 * g! + 0.0722 * b!;
}

it.each([
  ["brutalista", "light"],
  ["brutalista", "dark"],
  ["neon", "light"],
  ["neon", "dark"],
])("%s %s: the backdrop is darker than the page", async (theme, scheme) => {
  try {
    await Open.run();
    // Set after run(): the preview resets these attributes while it runs its axe loop.
    document.documentElement.dataset.theme = theme;
    document.documentElement.dataset.scheme = scheme;
    const backdrop = await waitFor(() => {
      const el = document.body.querySelector<HTMLElement>("[data-slot=dialog-backdrop]");
      expect(el).not.toBeNull();
      return el!;
    });
    // The custom property holds light-dark(): a probe element resolves it to a real color.
    const probe = backdrop.appendChild(document.createElement("div"));
    probe.style.backgroundColor = "var(--ui-background)";
    const page = getComputedStyle(probe).backgroundColor;
    probe.remove();
    const color = getComputedStyle(backdrop).backgroundColor;
    expect(luminance(color), `${color} vs ${page}`).toBeLessThan(luminance(page));
  } finally {
    delete document.documentElement.dataset.theme;
    delete document.documentElement.dataset.scheme;
  }
});

it("open dialog: repeated Tab keeps focus inside it, Escape closes it and focus returns to the trigger", async () => {
  await Default.run();
  const trigger = within(document.body).getByRole("button", { name: "Open dialog" });
  await userEvent.tab();
  await userEvent.keyboard("{Enter}");
  const dialog = await waitFor(() => within(document.body).getByRole("dialog"));
  for (let i = 0; i < 6; i++) {
    await userEvent.tab();
    await waitFor(() => expect(dialog.contains(document.activeElement), String(document.activeElement?.outerHTML.slice(0, 200))).toBe(true));
  }
  await userEvent.keyboard("{Escape}");
  await waitFor(() => expect(within(document.body).queryByRole("dialog")).toBeNull());
  await waitFor(() => expect(trigger).toHaveFocus());
});

it("the portaled popup takes the theme of the subtree it opens from", async () => {
  document.documentElement.dataset.theme = "brutalista";
  try {
    await InThemedSubtree.run();
    const popup = await waitFor(() => within(document.body).getByRole("dialog"));
    // neon radius is 0.625rem, brutalista is 0rem
    expect(getComputedStyle(popup).getPropertyValue("--ui-radius").trim()).toBe("0.625rem");
  } finally {
    delete document.documentElement.dataset.theme;
  }
});
