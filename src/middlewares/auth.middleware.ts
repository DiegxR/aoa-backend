import { Request } from 'express';
import { verifyToken } from '../utils/jwt.utils';
import User from '../models/User.model';
import { GraphQLContext } from '../types/context.types';

export const authMiddleware = async (req: Request): Promise<GraphQLContext> => {
  const authHeader = req.headers.authorization ?? '';

  if (!authHeader.startsWith('Bearer ')) {
    if (authHeader) console.log('⚠️  Header de autorización no tiene formato Bearer');
    return { user: null };
  }

  try {
    const token = authHeader.split(' ')[1];
    if (!token) {
      console.log('⚠️  Header Bearer presente pero sin token');
      return { user: null };
    }

    const decoded = verifyToken(token);
    const user = await User.findById(decoded.id).select('-password').lean();

    if (!user) {
      console.log(`❌ Token válido pero usuario no encontrado en DB (ID: ${decoded.id})`);
      return { user: null };
    }

    return {
      user: {
        id: String(user._id),
        email: user.email,
        role: user.role as any,
      },
    };
  } catch (error: any) {
    console.error('❌ Error en authMiddleware:', error.message || error);
    return { user: null };
  }
};