import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

/**
 * Import-boundary guard for the generic SDK.
 *
 * `@idapt/sdk` is the polyglot-generatable v1 client core. It must import ONLY
 * `@idapt/api-contracts` (the type-only wire contract) — never the broader
 * `@shared` kernel / domain vocabulary, and never `@idapt/browser-app-sdk`
 * (which would be a reverse dependency). This keeps the published client lean
 * and generatable; the browser-app runtime lives in `@idapt/browser-app-sdk`,
 * which composes this package.
 *
 * Enforcing this as a colocated test (rather than a `scripts/check-tags.ts`
 * rule) keeps the boundary checker simple: `@shared` and `@idapt/sdk` are both
 * `runtime:neutral`, so the tag checker alone can't tell that the SDK should
 * not reach into the kernel.
 */
const SRC = fileURLToPath(new URL(".", import.meta.url));

function sourceFiles(dir: string): string[] {
  const out: string[] = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...sourceFiles(full));
    else if (/\.tsx?$/.test(entry.name) && !/\.test\.tsx?$/.test(entry.name)) {
      out.push(full);
    }
  }
  return out;
}

function importsModule(text: string, mod: string): boolean {
  return (
    text.includes(`from "${mod}`) ||
    text.includes(`from '${mod}`) ||
    text.includes(`import("${mod}`) ||
    text.includes(`import('${mod}`)
  );
}

describe("@idapt/sdk import boundary", () => {
  const files = sourceFiles(SRC);

  it("imports nothing from @shared (the SDK is contract-only)", () => {
    const offenders = files.filter((f) =>
      importsModule(readFileSync(f, "utf8"), "@shared/"),
    );
    expect(offenders).toEqual([]);
  });

  it("does not import @idapt/browser-app-sdk (no reverse dependency)", () => {
    const offenders = files.filter((f) =>
      importsModule(readFileSync(f, "utf8"), "@idapt/browser-app-sdk"),
    );
    expect(offenders).toEqual([]);
  });
});
