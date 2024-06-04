import { generateAccessToken, generateRefreshToken } from '@/utils/jwtHandler';
import ApiService from '../index.service';

export default class AuthService extends ApiService {
  async loginUser(email: string) {
    return await this.prisma.user.findUnique({
      where: {
        email,
      },
      include: {
        role: {
          include: {
            permissions: true,
          },
        },
      },
    });
  }

  async createRefreshToken(refreshToken: string, userId: string) {
    return await this.prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: userId,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days expiration
      },
    });
  }

  async refreshTokens(refreshToken: string) {
    const storedToken = await this.prisma.refreshToken.findUnique({
      where: { token: refreshToken },
    });

    if (!storedToken || new Date() > storedToken.expiresAt) {
      throw new Error('Invalid or expired refresh token');
    }

    const newAccessToken = generateAccessToken(storedToken.userId);
    const newRefreshToken = generateRefreshToken();

    await this.prisma.refreshToken.update({
      where: { token: refreshToken },
      data: {
        token: newRefreshToken,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days expiration
      },
    });

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  }
}
