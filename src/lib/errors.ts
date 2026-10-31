export type ErrorCode =
  | "AUTHENTICATION_REQUIRED"
  | "VERIFIED_EMAIL_REQUIRED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "VALIDATION_ERROR"
  | "INVALID_ORIGIN"
  | "VERSION_CONFLICT"
  | "CONFIGURATION_ERROR"
  | "INTERNAL_ERROR";

export class AppError extends Error {
  constructor(
    public readonly code: ErrorCode,
    message: string,
    public readonly status: number,
    public readonly details?: Record<string, string[]>,
    options?: ErrorOptions,
  ) {
    super(message, options);
    this.name = "AppError";
  }
}

export function authenticationRequired(): AppError {
  return new AppError("AUTHENTICATION_REQUIRED", "Sign in is required.", 401);
}

export function notFound(): AppError {
  return new AppError("NOT_FOUND", "The requested resource is unavailable.", 404);
}

export function forbidden(message = "You do not have permission to perform this action."): AppError {
  return new AppError("FORBIDDEN", message, 403);
}

export function validationError(details: Record<string, string[]>): AppError {
  return new AppError("VALIDATION_ERROR", "Check the highlighted fields and try again.", 400, details);
}

export function versionConflict(): AppError {
  return new AppError(
    "VERSION_CONFLICT",
    "This record changed after you opened it. Refresh and review the latest version.",
    409,
  );
}

export function normalizeError(error: unknown): AppError {
  if (error instanceof AppError) {
    return error;
  }

  return new AppError("INTERNAL_ERROR", "Something went wrong. Try again.", 500, undefined, {
    cause: error,
  });
}

export type ErrorEnvelope = {
  error: {
    code: ErrorCode;
    message: string;
    requestId: string;
    details?: Record<string, string[]>;
  };
};

export function toErrorEnvelope(error: AppError, requestId: string): ErrorEnvelope {
  return {
    error: {
      code: error.code,
      message: error.message,
      requestId,
      ...(error.details ? { details: error.details } : {}),
    },
  };
}
