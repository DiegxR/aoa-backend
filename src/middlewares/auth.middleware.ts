import { Request } from 'express';
import { verifyToken } from '../utils/jwt.utils';
import User from '../models/User.model';
import { GraphQLContext } from '../types/context.types';

export const authMiddleware = async (req: Request): Promise<GraphQLContext> => {
  const authHeader = req.headers.authorization ?? '';

  if (!authHeader.startsWith('Bearer '))
    return { user: null };

  try {
    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);
    const user = await User.findById(decoded.id).select('-password').lean();

    if (!user) return { user: null };

    return {
      user: {
        id: String(user._id),
        email: user.email,
        role: user.role,
      },
    };
  } catch {
    return { user: null };
  }
};