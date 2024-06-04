import { Prisma } from '@prisma/client';
import { Request, Response } from 'express';
import { ZodError } from 'zod';
import { JsonWebTokenError } from 'jsonwebtoken';
import {
  sendBadRequestResponse,
  sendErrorResponse,
  sendValidationError,
} from '@/utils/responseHandler';

function parseZodErrors(errors: ZodError) {
  return errors.errors.map((err) => `${err.path.join(', ')}: ${err.message}`);
}
export async function errorHandler(error: any, _: Request, response: Response) {
  // Handle Zod validation errors
  if (error instanceof ZodError) {
    return sendValidationError(response, 'Validation Error', parseZodErrors(error));
  }

  // Handle known Prisma errors
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    const res =
      process.env.APP_ENV === 'development'
        ? { error: 'Prisma Error occurred', details: error }
        : { error: 'Error occurred' };

    return sendBadRequestResponse(response, res);
  }

  // if (error instanceof TokenExpiredError) {
  //   const refreshToken: any = req.headers['x-refresh-token'];

  //   if (!refreshToken) {
  //     response.status(401).json({ message: 'Access token expired. No refresh token provided.' });
  //     return;
  //   }

  //   try {
  //     const { accessToken, refreshToken: newRefreshToken } = await refreshTokens(refreshToken);
  //     // response.set('x-access-token', accessToken);
  //     // response.set('x-refresh-token', newRefreshToken);
  //     response.status(200).json({
  //       message: 'Access token refreshed',
  //       accessToken,
  //       refreshToken: newRefreshToken,
  //     });
  //   } catch (refreshError) {
  //     console.error('Error refreshing token:', refreshError);
  //     response
  //       .status(401)
  //       .json({ message: 'Access token expired. Refresh token invalid or expired.' });
  //     sendUnauthorizedResponse(response, 'Access token expired. Refresh token invalid or expired.');
  //   }
  // }

  // Handle Json Web Token Error
  if (error instanceof JsonWebTokenError) {
    const res =
      process.env.APP_ENV == 'development'
        ? { error: 'Json Web Token Error occurred', message: error }
        : { error: 'Error occurred' };
    return sendBadRequestResponse(response, res);
  }

  // Handle other types of errors
  const res =
    process.env.APP_ENV === 'development'
      ? { message: error.message }
      : { message: 'Internal Server Error' };
  return sendErrorResponse(response, res);
}
