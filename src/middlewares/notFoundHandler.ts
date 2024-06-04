import { Request, Response } from 'express';
import { ResponseHandler } from '../utils/responseHandler';
import { join } from 'path';

export function notFoundHandler(request: Request, response: Response) {
  if (request.headers['content-type'] === 'application/json') {
    const notFoundMessage = {
      Requested_URL: request.originalUrl,
      success: false,
      error: 'Error 404 - Not Found',
    };
    ResponseHandler.setResponse(response).NotFound(notFoundMessage);
  } else {
    response.sendFile(join(__dirname, '../../public/index.html'));
  }
}
