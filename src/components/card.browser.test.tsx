import { composeStories } from "@storybook/react-vite";
import { expect, it } from "vitest";
import * as stories from "./card.stories";

const { Default } = composeStories(stories);

it("Card with all parts: each part has its own data-slot", async () => {
  await Default.run();
  for (const slot of ["card", "card-header", "card-title", "card-description", "card-content", "card-footer"]) {
    expect(document.body.querySelector(`[data-slot="${slot}"]`), slot).not.toBeNull();
  }
});
