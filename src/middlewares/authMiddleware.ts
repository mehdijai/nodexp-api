import {  sendForbiddenResponse, sendUnauthorizedResponse } from '@/utils/responseHandler';
import { Request, Response, NextFunction } from 'express';
import jwt, { TokenExpiredError } from 'jsonwebtoken';
import { errorHandler } from './errorHandlerMiddleware';

const SECRET_KEY = process.env.JWT_SECRET_KEY || 'your_secret_key';

interface AuthenticatedRequest extends Request {
  user?: any;
}

export function authenticateJWT(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(' ')[1];

    jwt.verify(token, SECRET_KEY, (err, user) => {
      if (err) {
        if(err instanceof TokenExpiredError) {
          sendUnauthorizedResponse(res, 'Unauthenticated')
        } else {
          sendForbiddenResponse(res, 'Access forbidden: Invalid token');
        }
        return;
      }
      req.user = user;
      next();
    });
  } else {
    sendUnauthorizedResponse(res, 'Access denied: No token provided');
  }
}
