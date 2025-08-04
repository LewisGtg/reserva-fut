import { Request, Response, NextFunction } from 'express';

export interface AppError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
): Response | void => {
  const { statusCode = 500, message } = err;

  // Log error details
  console.error(`Error ${statusCode}: ${message}`);
  console.error(err.stack);

  // Don't leak error details in production
  const response = {
    error: {
      status: statusCode,
      message: process.env.NODE_ENV === 'production' 
        ? 'Something went wrong!' 
        : message,
    },
  };

  if (process.env.NODE_ENV === 'development') {
    response.error = { ...response.error, stack: err.stack } as any;
  }

  return res.status(statusCode).json(response);
};
