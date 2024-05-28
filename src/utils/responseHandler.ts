import { Response } from 'express';
import HttpStatusCode from './HttpStatusCode';

interface SuccessResponse<T> {
  success: true;
  data: T;
}

interface ErrorResponse<T> {
  success: false;
  error: {
    message: T;
  };
}

// Success response with data
export function sendSuccessResponse<T>(
  res: Response,
  data: T,
  status = HttpStatusCode.OK
): Response<SuccessResponse<T>> {
  return res.status(status).json({ success: true, data });
}

// Success response without data (e.g., for delete operations)
export function sendSuccessNoDataResponse(
  res: Response,
  message = 'Operation successful',
  status = HttpStatusCode.OK
): Response<SuccessResponse<null>> {
  return res.status(status).json({ success: true, message });
}

// Error response
export function sendErrorResponse<T>(
  res: Response,
  message: T,
  status = HttpStatusCode.INTERNAL_SERVER_ERROR
): Response<ErrorResponse<T>> {
  return res.status(status).json({ success: false, error: { message } });
}

// Not Found response
export function sendNotFoundResponse<T>(
  res: Response,
  message: T,
  status = HttpStatusCode.NOT_FOUND
): Response<ErrorResponse<T>> {
  return res.status(status).json({ success: false, error: { message } });
}

// Validation Error response
export function sendValidationError<T>(
  res: Response,
  message: T,
  errors: string[],
  status = HttpStatusCode.UNPROCESSABLE_ENTITY
): Response<ErrorResponse<T>> {
  return res.status(status).json({
    success: false,
    error: {
      message: message,
      errors: errors,
    },
  });
}

// Unauthorized response
export function sendUnauthorizedResponse<T>(
  res: Response,
  message = 'Unauthorized',
  status = HttpStatusCode.UNAUTHORIZED
): Response<ErrorResponse<T>> {
  return res.status(status).json({ success: false, error: { message } });
}

// Forbidden response
export function sendForbiddenResponse<T>(
  res: Response,
  message = 'Forbidden',
  status = HttpStatusCode.FORBIDDEN
): Response<ErrorResponse<T>> {
  return res.status(status).json({ success: false, error: { message } });
}

// Bad Request response
export function sendBadRequestResponse<T>(
  res: Response,
  message: T,
  status = HttpStatusCode.BAD_REQUEST
): Response<ErrorResponse<T>> {
  return res.status(status).json({ success: false, error: { message } });
}
