import prisma from '@/utils/client';
import { generateAccessToken, generateRefreshToken } from '@/utils/jwtHandler';

export const loginUser = async (email: string) => {
  return prisma.user.findUnique({
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
};

export const createRefreshToken = async (refreshToken: string, userId: string) => {
  return prisma.refreshToken.create({
    data: {
      token: refreshToken,
      userId: userId,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days expiration
    },
  });
};

export const refreshTokens = async (refreshToken: string) => {
  const storedToken = await prisma.refreshToken.findUnique({
    where: { token: refreshToken },
  });

  if (!storedToken || new Date() > storedToken.expiresAt) {
    throw new Error('Invalid or expired refresh token');
  }

  const newAccessToken = generateAccessToken(storedToken.userId);
  const newRefreshToken = generateRefreshToken();

  await prisma.refreshToken.update({
    where: { token: refreshToken },
    data: {
      token: newRefreshToken,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days expiration
    },
  });

  return { accessToken: newAccessToken, refreshToken: newRefreshToken };
};
