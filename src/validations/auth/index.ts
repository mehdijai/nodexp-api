import { z } from 'zod';

export const authSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string(),
});

export type TAuthSchema = z.infer<typeof authSchema>;
export type TRefreshTokenSchema = z.infer<typeof refreshTokenSchema>;
