import { authenticateJWT } from '@/middlewares/authMiddleware';
import { ApiRouter } from '@/utils/route';

export default class GuardRouter extends ApiRouter {
  protected setupRoutes() {
    /**
     * @swagger
     * tags:
     *   name: Guard
     *   description: Guarded endpoints
     */

    /**
     * @swagger
     * /protected:
     *   get:
     *     summary: Test Guarded
     *     tags: [Guarded]
     *     responses:
     *       200:
     *         description: User is logged
     *       401:
     *         description: Unauthorized
     */
    this.router.get('/protected', authenticateJWT, (req, res) => {
      res.json({ message: 'You have accessed a protected route', user: (req as any).user });
    });
  }
}
