import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig, type Options } from "tsup";

const pkgDir = path.dirname(
  fileURLToPath(new URL("./package.json", import.meta.url)),
);
const aliasContracts = (options: {
  alias?: Record<string, string>;
  sourcesContent?: boolean;
}) => {
  options.alias = {
    ...(options.alias ?? {}),
    "@idapt/api-contracts": path.resolve(pkgDir, "../api-contracts/src"),
    "@shared": path.resolve(pkgDir, "../../shared"),
  };

  options.sourcesContent = false;
};

const pkg = JSON.parse(
  readFileSync(
    fileURLToPath(new URL("./package.json", import.meta.url)),
    "utf8",
  ),
) as { version: string };
const VERSION_LITERAL = JSON.stringify(pkg.version);

const libraryConfig: Options = {

  entry: { index: "src/index.ts", dynamic: "src/dynamic.ts" },
  format: ["esm", "cjs"],
  dts: true,
  sourcemap: true,
  clean: true,
  target: "es2020",
  treeshake: true,
  outDir: "dist",
  esbuildOptions: aliasContracts,
  define: {
    __SDK_VERSION__: VERSION_LITERAL,
  },
};

export default defineConfig([libraryConfig]);
