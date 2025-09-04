import pino, { type LoggerOptions } from "pino";

const isDev = process.env.NODE_ENV !== "production";

const base: LoggerOptions = {
  level: process.env.LOG_LEVEL ?? "info"
};

export const logger = isDev
  ? pino({
      ...base,
      transport: {
        target: "pino-pretty",
        options: { translateTime: "SYS:standard" }
      }
    })
  : pino(base);
