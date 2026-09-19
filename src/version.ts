
declare const __SDK_VERSION__: string;

export const VERSION: string =
  typeof __SDK_VERSION__ === "string" ? __SDK_VERSION__ : "dev";
