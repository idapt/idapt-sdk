

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

export const Idapt = { connect };
