import { NextFunction, Request, Response } from 'express';
import ApiError from './ApiError';

const asyncHandler =
  (fn: Function) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      return await fn(req, res, next);
    } catch (error: unknown) {
      if (error instanceof ApiError) {
        res.status(error.statusCode || 500).json({
          success: false,
          message: error.message,
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'An unexpected error occurred',
        });
      }
    }
  };

export default asyncHandler;
