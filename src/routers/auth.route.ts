import { login, refresh } from '@/controllers/auth/auth.controller';
import { validate } from '@/middlewares/validateMiddleware';
import { ApiRouter } from '@/utils/route';
import { authSchema, refreshTokenSchema } from '@/validations/auth';

export default class AuthRouter extends ApiRouter {
  protected setupRoutes() {
    /**
     * @swagger
     * tags:
     *   name: Auth
     *   description: Authentication endpoints
     */

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
    this.router.post('/login', validate(authSchema), login);

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
    this.router.post('/refresh', validate(refreshTokenSchema), refresh);
  }
}
