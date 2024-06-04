import { Prisma } from '@prisma/client';
import { Request, Response } from 'express';
import { ZodError } from 'zod';
import { JsonWebTokenError } from 'jsonwebtoken';
import { ResponseHandler } from '@/utils/responseHandler';
import HttpStatusCode from '@/utils/HttpStatusCode';

function parseZodErrors(errors: ZodError) {
  return errors.errors.map((err) => `${err.path.join(', ')}: ${err.message}`);
}
export async function errorHandler(error: any, _: Request, response: Response) {
  // Handle Zod validation errors
  if (error instanceof ZodError) {
    return ResponseHandler.setResponse(response).InvalidBody({
      message: 'Validation Error',
      errors: parseZodErrors(error),
    });
  }

  // Handle known Prisma errors
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    const res =
      process.env.APP_ENV === 'development'
        ? { error: 'Prisma Error occurred', details: error }
        : { error: 'Error occurred' };

    return ResponseHandler.setResponse(response).BadRequest(response);
  }

  // Handle Json Web Token Error
  if (error instanceof JsonWebTokenError) {
    const res =
      process.env.APP_ENV == 'development'
        ? { error: 'Json Web Token Error occurred', message: error }
        : { error: 'Error occurred' };
    return ResponseHandler.setResponse(response).response(
      response,
      HttpStatusCode.INTERNAL_SERVER_ERROR
    );
  }

  // Handle other types of errors
  const res =
    process.env.APP_ENV === 'development'
      ? { message: error.message }
      : { message: 'Internal Server Error' };
  return ResponseHandler.setResponse(response).response(
    response,
    HttpStatusCode.INTERNAL_SERVER_ERROR
  );
}
