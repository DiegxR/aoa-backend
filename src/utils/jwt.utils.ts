import jwt from 'jsonwebtoken';
import { AuthUser } from '../types/context.types';
import process from 'process';

export const generateToken = (user: AuthUser): string =>
  jwt.sign(
    { id: user.id, role: user.role, email: user.email },
    process.env.JWT_SECRET as string,
    { expiresIn: process.env.JWT_EXPIRES_IN ?? '7d' }
  );

export const verifyToken = (token: string): AuthUser =>
  jwt.verify(token, process.env.JWT_SECRET as string) as AuthUser;