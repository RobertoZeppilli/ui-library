import { defineConfig } from "tsdown";

// unbundle keeps one file per module, so "use client" stays only on the files that declare it.
export default defineConfig({
  entry: ["src/index.ts"],
  format: "esm",
  unbundle: true,
  dts: true,
  clean: true,
});
