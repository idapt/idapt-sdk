/**
 * The version of the `@idapt/sdk` package, baked in at build time.
 *
 * `__SDK_VERSION__` is a global identifier that `tsup`/`esbuild`
 * substitutes during the production build (`tsup.config.ts` reads
 * `package.json#version` and passes it through the `define` option). The
 * local `declare const` below keeps TypeScript happy by typing the symbol
 * without needing a separate ambient `.d.ts` file.
 *
 * The tag pipeline (`.gitlab/ci/sdk.yml`) rewrites `package.json#version`
 * from `$CI_COMMIT_TAG` (`sdk-vX.Y.Z` → `X.Y.Z`) before running `npm run
 * build`, so a released bundle always carries the published semver.
 *
 * The `typeof` guard exists for non-bundled dev consumers (vitest running
 * the raw `.ts`, or users importing source). In that mode the identifier
 * is undefined; we fall back to a `"dev"` marker rather than crashing.
 */
declare const __SDK_VERSION__: string;

export const VERSION: string =
  typeof __SDK_VERSION__ === "string" ? __SDK_VERSION__ : "dev";
