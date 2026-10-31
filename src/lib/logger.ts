import "server-only";

type SafeLogContext = {
  requestId?: string;
  route?: string;
  method?: string;
  status?: number;
  code?: string;
  entityType?: string;
  entityId?: string;
};

function write(level: "info" | "warn" | "error", message: string, context: SafeLogContext) {
  const entry = JSON.stringify({
    timestamp: new Date().toISOString(),
    level,
    message,
    ...context,
  });

  if (level === "error") {
    console.error(entry);
  } else if (level === "warn") {
    console.warn(entry);
  } else {
    console.info(entry);
  }
}

export const logger = {
  info(message: string, context: SafeLogContext = {}) {
    write("info", message, context);
  },
  warn(message: string, context: SafeLogContext = {}) {
    write("warn", message, context);
  },
  error(message: string, context: SafeLogContext = {}) {
    write("error", message, context);
  },
};
