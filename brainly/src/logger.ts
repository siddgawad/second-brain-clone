import pino, { LoggerOptions } from "pino";
import { ENV, IS_PROD } from "./env";

let options: LoggerOptions = { level: ENV.LOG_LEVEL as any };

// With exactOptionalPropertyTypes, don’t set transport: undefined.
// Only add it in development.
if (!IS_PROD) {
  (options as any).transport = { target: "pino-pretty" };
}

export const logger = pino(options);
