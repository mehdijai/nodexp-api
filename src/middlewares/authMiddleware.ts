import { Response, NextFunction } from 'express';
import jwt, { TokenExpiredError } from 'jsonwebtoken';
import { AuthenticatedRequest } from '@/types/auth.types';
import { ResponseHandler } from '@/utils/responseHandler';

const SECRET_KEY = process.env.JWT_SECRET_KEY || 'your_secret_key';

export function authenticateJWT(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;  
  
  if (authHeader) {
    const token = authHeader.split(' ')[1];

    jwt.verify(token, SECRET_KEY, (err, user) => {
      if (err || !user) {
        if (err instanceof TokenExpiredError) {
          ResponseHandler.setResponse(res).Unauthorized('Unauthenticated');
        } else {
          ResponseHandler.setResponse(res).Forbidden('Access forbidden: Invalid token');
        }
        return;
      }
      req.user = user;
      next();
    });
  } else {
    ResponseHandler.setResponse(res).Unauthorized('Access denied: No token provided');
  }
}
