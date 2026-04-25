import type { Request, Response, NextFunction } from 'express';
import type { AppError } from '../types';

export function errorHandler(
  err: AppError | Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  const statusCode = 'statusCode' in err ? err.statusCode : 500;
  const message = err.message || 'An unexpected error occurred.';

  if (statusCode >= 500) {
    console.error('[ErrorHandler]', err);
  }

  res.status(statusCode).json({ error: message });
}

export function notFound(_req: Request, res: Response): void {
  res.status(404).json({ error: 'Route not found.' });
}

export function createError(message: string, statusCode = 500): AppError {
  const err = new Error(message) as AppError;
  err.statusCode = statusCode;
  return err;
}
