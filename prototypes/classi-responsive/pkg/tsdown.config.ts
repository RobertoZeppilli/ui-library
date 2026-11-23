import { defineConfig } from "tsdown";
export default defineConfig({ entry: ["src/index.ts", "src/stack-a.tsx", "src/stack-b.tsx"], unbundle: true, dts: false, format: "esm", external: ["react", "react/jsx-runtime"] });
