import { logger } from "./logger";

process.on("unhandledRejection", (reason: any, promise) => {
  logger.error(`Unhandled Rejection: ${reason}`);
});

process.on("uncaughtException", (err) => {
  logger.error(`Uncaught Exception: ${err}`);
});

process.on("uncaughtExceptionMonitor", (err) => {
  logger.error(`Uncaught Exception Monitor: ${err}`);
});