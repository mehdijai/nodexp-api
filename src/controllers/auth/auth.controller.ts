import { Request, Response, NextFunction } from 'express';
import { sendSuccessResponse, sendUnauthorizedResponse } from '@/utils/responseHandler';
import { authSchema, refreshTokenSchema, TAuthSchema } from '@/validations/auth';
import { comparePasswords } from '@/utils/bcryptHandler';
import { generateAccessToken, generateRefreshToken } from '@/utils/jwtHandler';
import { BaseController, Controller, Post } from '..';
import { API_VERSION } from '@/config/version.config';
import { validate } from '@/middlewares/validateMiddleware';
import AuthService from '@/services/auth/auth.service';

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication endpoints
 */
@Controller(API_VERSION, '/auth')
export default class AuthController extends BaseController {
  constructor(protected authService: AuthService) {
    super();
  }
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
      const user = await this.authService.loginUser(authRequest.email);

      if (!user) {
        sendUnauthorizedResponse(response, 'Credentials Error');
        return;
      }

      const isValidPassword = await comparePasswords(authRequest.password, user.password);

      if (isValidPassword) {
        const token = generateAccessToken(user.id);
        const refreshToken = generateRefreshToken();
        await this.authService.createRefreshToken(refreshToken, user.id);

        const accessToken = {
          token: token,
          refreshToken: refreshToken,
        };

        const responseData = {
          accessToken: accessToken,
          user: {
            id: user.id,
            firstname: user.firstname,
            lastname: user.lastname,
            gender: user.gender,
            email: user.email,
            phone: user.phone,
            modelType: user.modelType,
            hasMobileAccess: user.hasMobileAccess,
            profilePhotoPath: user.profilePhotoPath,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
          },
          role: user.role.name,
          permissions: user.role.permissions.map((rp: any) => rp.name),
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
      const { accessToken, refreshToken: newRefreshToken } =
        await this.authService.refreshTokens(refreshToken);
      response.json({ accessToken, refreshToken: newRefreshToken });
    } catch (err) {
      next(err);
    }
  }
}
