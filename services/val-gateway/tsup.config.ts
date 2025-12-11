import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/**/*.ts"], 
  format: ["esm"],
  bundle: false,
  dts: true,
  target: "node20",
  platform: "node",
  sourcemap: true,
});
