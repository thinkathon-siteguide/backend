import { Request, Response, NextFunction } from 'express';
import { ApiError, InternalError } from '../core/error.response';
import { logger } from '../core/logger';
import { config } from '../config/config';

// Removed broken errorHandler


// Extend ApiError to have a static handle method for cleaner usage
// We need to modify the class in error.response.ts or just handle it here.
// Let's just handle it here for now to avoid circular deps or complex class logic if not needed.
// Actually, let's rewrite the handler logic to be simpler.

const sendError = (res: Response, error: ApiError) => {
  res.status(error.statusCode).json({
    status: 'error',
    code: error.statusCode,
    type: error.type,
    message: error.message,
    errors: error.rawErrors,
  });
};

export const globalErrorHandler = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (err instanceof ApiError) {
    sendError(res, err);
    return;
  }

  logger.error(`Unexpected Error: ${err.message}`, { stack: err.stack });

  if (config.env === 'development') {
    return res.status(500).json({
      message: err.message,
      stack: err.stack,
    });
  }

  sendError(res, new InternalError());
};
