import { composeStories } from "@storybook/react-vite";
import { expect, it } from "vitest";
import * as fixtures from "./button.contrast.fixture";

const { LowContrast } = composeStories(fixtures);

it("fails the story when a Button has text below the contrast minimum", async () => {
  await expect(LowContrast.run()).rejects.toThrow(/color-contrast/);
});
