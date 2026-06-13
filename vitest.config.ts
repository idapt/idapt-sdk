import { defineConfig } from "vitest/config";

// Package-local Vitest config for `@idapt/sdk`.
//
// Why this exists separately from the repo-root `vitest.config.ts`:
// the root config's custom reporter path (`./tests/reporters/...`) is
// resolved relative to the *root* cwd. Running `npm test` from inside
// `packages/sdk/` auto-discovers the root config and then fails to load
// that reporter. This config keeps the package self-contained so
// `cd packages/sdk && npm test` works on its own — the SDK's tests are
// pure unit tests (mocked `fetch`, no infra), so they need no extra setup.
//
// Running `npx vitest run packages/sdk` from the repo root still uses the
// root config; both paths cover the same colocated test files under `src/`.
export default defineConfig({
  test: {
    include: ["src/**/*.test.ts", "src/**/*.test.tsx"],
    environment: "node",
  },
});
