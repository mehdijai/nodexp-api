import { Request, Response, NextFunction } from 'express';
import {
  createRefreshToken,
  getUserRole,
  loginUser,
  refreshTokens,
} from '@/services/auth/auth.service';
import { sendSuccessResponse, sendUnauthorizedResponse } from '@/utils/responseHandler';
import { TAuthSchema } from '@/validations/auth';
import { comparePasswords } from '@/utils/bcryptHandler';
import { generateAccessToken, generateRefreshToken } from '@/utils/jwtHandler';

export async function login(request: Request, response: Response, next: NextFunction) {
  try {
    const authRequest: TAuthSchema = request.body;
    const user = await loginUser(authRequest.email);

    if (!user) {
      sendUnauthorizedResponse(response, 'Credentials Error');
      return;
    }

    const isValidPassword = await comparePasswords(authRequest.password, user.password);

    if (isValidPassword) {
      const token = generateAccessToken(user.id);
      const refreshToken = generateRefreshToken();
      await createRefreshToken(refreshToken, user.id);

      const userRole: any = await getUserRole(user.id);

      const accessToken = {
        token: token,
        refreshToken: refreshToken,
      };
      const permissions = userRole.role.RoleHasPermission.map((rp: any) => rp.permission.name);

      const responseData = {
        accessToken: accessToken,
        user: user,
        role: userRole.role.name,
        permissions: permissions,
      };
      sendSuccessResponse(response, responseData);
      return;
    } else {
      sendUnauthorizedResponse(response, 'Password not match');
      return;
    }
  } catch (err) {
    next(err);
  }
}

export async function refresh(request: Request, response: Response, next: NextFunction) {
  try {
    const { refreshToken } = request.body;
    const { accessToken, refreshToken: newRefreshToken } = await refreshTokens(refreshToken);
    response.json({ accessToken, refreshToken: newRefreshToken });
  } catch (err) {
    next(err);
  }
}
