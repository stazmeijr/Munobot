import { Signale } from "signale";

export const logger = new Signale({
  types: {
    success: {
      badge: "✅",
      color: "green",
      label: "success",
    },
    error: {
      badge: "❌",
      color: "red",
      label: "error",
    },
    warn: {
      badge: "⚠️",
      color: "yellow",
      label: "warn",
    },
    info: {
      badge: "ℹ️",
      color: "blue",
      label: "info",
    },
  },
});
