import { Request, Response, NextFunction } from 'express';
import {
  createRefreshToken,
  getUserRole,
  loginUser,
  refreshTokens,
} from '@/services/auth/auth.service';
import { sendSuccessResponse, sendUnauthorizedResponse } from '@/utils/responseHandler';
import { authSchema, refreshTokenSchema, TAuthSchema } from '@/validations/auth';
import { comparePasswords } from '@/utils/bcryptHandler';
import { generateAccessToken, generateRefreshToken } from '@/utils/jwtHandler';
import { _Controller, BaseController, Controller, Get, Post } from '..';
import { API_VERSION } from '@/config/version.config';
import { validate } from '@/middlewares/validateMiddleware';

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication endpoints
 */
@Controller(API_VERSION, '/auth')
export default class AuthController extends BaseController {
  /**
   * @swagger
   * /auth/login:
   *   post:
   *     summary: Login a user
   *     tags: [Auth]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - username
   *               - password
   *             properties:
   *               username:
   *                 type: string
   *               password:
   *                 type: string
   *     responses:
   *       200:
   *         description: User logged in successfully
   *       401:
   *         description: Invalid credentials
   */
  @Post('/login', [validate(authSchema)])
  public async login(request: Request<{}, TAuthSchema>, response: Response, next: NextFunction) {
    try {
      const authRequest = request.body;
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

  /**
   * @swagger
   * /auth/refresh:
   *   post:
   *     summary: Refresh the access token
   *     tags: [Auth]
   *     responses:
   *       200:
   *         description: Token refreshed successfully
   *       401:
   *         description: Invalid refresh token
   */
  @Post('/refresh', [validate(refreshTokenSchema)])
  public async refresh(request: Request, response: Response, next: NextFunction) {
    try {
      const { refreshToken } = request.body;
      const { accessToken, refreshToken: newRefreshToken } = await refreshTokens(refreshToken);
      response.json({ accessToken, refreshToken: newRefreshToken });
    } catch (err) {
      next(err);
    }
  }
}
