import { Request, Response, NextFunction } from 'express';
import { authSchema, refreshTokenSchema, TAuthSchema } from '@/validations/auth';
import { generateAccessToken, generateRefreshToken } from '@/utils/jwtHandler';
import { BaseController, Controller, Post, RequestBody, Responses } from '..';
import { API_VERSION } from '@/config/version.config';
import { validate } from '@/middlewares/validateMiddleware';
import AuthService from '@/services/auth/auth.service';
import bcrypt from 'bcryptjs';
import { apiResponse, ResponseHandler } from '@/utils/responseHandler';

@Controller('Auth', API_VERSION, '/auth')
export default class AuthController extends BaseController {
  constructor(protected authService: AuthService) {
    super();
  }

  @Responses({ '200': 'User logged in successfully' })
  @RequestBody(authSchema)
  @Post('/login', [validate(authSchema)], 'Login a user')
  public async login(request: Request<{}, TAuthSchema>, response: Response, next: NextFunction) {
    try {
      const authRequest = request.body;
      const user = await this.authService.loginUser(authRequest.email);

      if (!user) {
        ResponseHandler.setResponse(response).Unauthorized('Credentials Error');
        return;
      }

      const isValidPassword = await bcrypt.compare(authRequest.password, user.password);

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
        apiResponse(response, responseData);
        return;
      } else {
        ResponseHandler.setResponse(response).Unauthorized('Password not match');

        return;
      }
    } catch (err) {
      next(err);
    }
  }

  @Responses({ '201': 'Token refreshed successfully' })
  @RequestBody(authSchema)
  @Post('/refresh', [validate(refreshTokenSchema)], 'Refresh the access token')
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
