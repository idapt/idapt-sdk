import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig, type Options } from "tsup";

// The SDK sources its wire types from @idapt/api-contracts (type-only — erased,
// so no runtime zod ships). esbuild can't read the monorepo tsconfig paths, so
// map the alias explicitly. `@shared` is mapped too in case a type import
// reaches it transitively; nothing runtime resolves through it.
const pkgDir = path.dirname(
  fileURLToPath(new URL("./package.json", import.meta.url)),
);
const aliasContracts = (options: { alias?: Record<string, string> }) => {
  options.alias = {
    ...(options.alias ?? {}),
    "@idapt/api-contracts": path.resolve(pkgDir, "../api-contracts/src"),
    "@shared": path.resolve(pkgDir, "../../shared"),
  };
};

/**
 * Single library bundle — consumed via `npm install @idapt/sdk` and, in-repo,
 * via the `@idapt/sdk` alias (source) by `@idapt/browser-app-sdk`. Emits
 * ESM + CJS + .d.ts; not minified (bundler consumers minify). The browser-app
 * runtime (the `window.Idapt` IIFE, overlay, React) lives in
 * `@idapt/browser-app-sdk`, which has its own browser/react build.
 *
 * Version baking: `package.json#version` is substituted into the
 * `"__SDK_VERSION__"` literal in `src/version.ts`. The release pipeline
 * (`.gitlab/ci/sdk.yml`) rewrites `package.json#version` from `$CI_COMMIT_TAG`
 * (`sdk-vX.Y.Z` → `X.Y.Z`) before building.
 */
const pkg = JSON.parse(
  readFileSync(
    fileURLToPath(new URL("./package.json", import.meta.url)),
    "utf8",
  ),
) as { version: string };
const VERSION_LITERAL = JSON.stringify(pkg.version);

const libraryConfig: Options = {
  entry: { index: "src/index.ts" },
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
