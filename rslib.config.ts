import { defineConfig } from "@rslib/core";

export default defineConfig({
  source: { entry: { index: "./src/index.ts" } },
  lib: (["esm", "cjs"] as const).map((format) => ({
    format,
    syntax: "es2021",
    dts: { autoExtension: true },
  })),
  output: {
    target: "node",
  },
});
