import { Request, Response, NextFunction } from 'express';

export const notFoundHandler = (_req: Request, res: Response, _next: NextFunction): void => {
  res.status(404).json({
    success: false,
    message: `Route not found`,
    error: 'Not Found'
  });
};
