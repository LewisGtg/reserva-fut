import { Request, Response } from 'express';

export const notFound = (req: Request, res: Response): Response => {
  const message = `Route ${req.originalUrl} not found`;
  
  return res.status(404).json({
    error: {
      status: 404,
      message,
    },
  });
};
