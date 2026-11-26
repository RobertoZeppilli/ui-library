import { composeStories } from "@storybook/react-vite";
import { expect, it } from "vitest";
import * as stories from "./text.stories";

const { AsHeading } = composeStories(stories);

it("render={<h2 />} gives an h2 that keeps the Text classes", async () => {
  await AsHeading.run();
  const text = document.querySelector('[data-slot="text"]')!;
  expect(text.tagName).toBe("H2");
  expect(text.classList.contains("text-xl")).toBe(true);
  expect(text.classList.contains("text-muted-foreground")).toBe(true);
});
