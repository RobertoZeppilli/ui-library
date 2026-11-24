import { expect, it } from "vitest";
import { missingChangeset } from "../scripts/changeset-check";

it("fails when src/ changes without a changeset", () => {
  expect(missingChangeset(["src/components/Button.tsx"])).toBe(true);
});

it("fails when themes/ changes without a changeset", () => {
  expect(missingChangeset(["themes/dark.css", ".changeset/README.md", ".changeset/config.json"])).toBe(true);
});

it("passes when src/ changes together with a changeset", () => {
  expect(missingChangeset(["src/index.ts", ".changeset/brave-owls-sing.md"])).toBe(false);
});

it("passes on a docs/CI-only change", () => {
  expect(missingChangeset(["README.md", "docs/adr/0001.md", ".github/workflows/ci.yml"])).toBe(false);
});
