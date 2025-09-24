import { defineConfig } from "tsup";

export default defineConfig({
    entry: ["src/index.ts"],
    outDir: "dist",
    format: ["esm", "cjs"],
    splitting: true,
    sourcemap: true,
    dts: true,
    clean: true,
    external: ["inquirer", "commander"],
}); 