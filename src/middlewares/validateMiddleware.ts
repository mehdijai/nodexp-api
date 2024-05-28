import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';
import { errorHandler } from './errorHandlerMiddleware';

export function validate(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error: any) {
      errorHandler(error, req, res);
    }
  };
}
