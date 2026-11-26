import { expect, it } from "vitest";

it("data-theme on a subtree changes the theme only there", () => {
  const root = document.documentElement;
  root.dataset.theme = "brutalista";
  const box = document.createElement("div");
  box.dataset.theme = "neon";
  const sibling = document.createElement("div");
  document.body.append(box, sibling);
  try {
    const radius = (el: Element) => getComputedStyle(el).getPropertyValue("--ui-radius").trim();
    expect(radius(box)).toBe("0.625rem");
    expect(radius(sibling)).toBe("0rem");
  } finally {
    box.remove();
    sibling.remove();
    delete root.dataset.theme;
  }
});
