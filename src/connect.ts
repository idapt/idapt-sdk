/**
 * connect() — the generic library entry point.
 *
 * Builds an {@link IdaptClient} that talks to `apiUrl` with `key` as the bearer
 * token. This is the isomorphic, browser-app-free connect; the hosted
 * cookie-bootstrap flow (subdomain handoff, overlay, local mode) lives in
 * `@idapt/browser-app-sdk`.
 *
 *   import { connect } from "@idapt/sdk";
 *   const client = await connect({
 *     apiUrl: "https://idapt.ai",
 *     key: process.env.IDAPT_API_KEY!,
 *   });
 *   const me = await client.user.me();
 */

import { IdaptClient, type IdaptClientOptions } from "./client.js";

export async function connect(
  options: IdaptClientOptions,
): Promise<IdaptClient> {
  if (!options.apiUrl) {
    throw new Error("Idapt.connect({ apiUrl, key }) requires `apiUrl`");
  }
  if (!options.key) {
    throw new Error("Idapt.connect({ apiUrl, key }) requires `key`");
  }
  return new IdaptClient(options);
}

/** Namespace object for consumers that prefer `Idapt.connect()` style. */
export const Idapt = { connect };
