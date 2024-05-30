import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

const SECRET_KEY = process.env.JWT_SECRET_KEY || 'your_secret_key';
const REFRESH_SECRET_KEY = process.env.JWT_REFRESH_SECRET_KEY || 'your_refresh_secret_key';

export const generateAccessToken = (userId: string) => {
  return jwt.sign({ userId }, SECRET_KEY, { expiresIn: 60 });
};

export const generateRefreshToken = () => {
  return uuidv4();
};

export const verifyAccessToken = (token: string) => {
  return jwt.verify(token, SECRET_KEY);
};

export const verifyRefreshToken = (token: string) => {
  return jwt.verify(token, REFRESH_SECRET_KEY);
};
