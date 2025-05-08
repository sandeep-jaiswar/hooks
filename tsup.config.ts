import { defineConfig } from "tsup";

export default defineConfig({
  entry: ['src/**/*.ts'],
  outDir: "dist",
  format: ["esm", "cjs"],
  target: "es2020",
  dts: true,
  clean: true,
  sourcemap: true,
  splitting: false,
  minify: false,
});
