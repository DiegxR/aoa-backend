// guards/auth.guard.ts
import { GraphQLError } from 'graphql';
import jwt from 'jsonwebtoken';
import User from '../models/User.model';

const JWT_SECRET = process.env.JWT_SECRET || 'secret123';

// Guard principal: verifica que el usuario esté autenticado
export const authGuard = async (token?: string) => {
  // 1. Verificar que existe el token
  if (!token) {
    throw new GraphQLError('No autenticado. Token requerido', {
      extensions: { code: 'UNAUTHENTICATED' }
    });
  }

  try {
    // 2. Verificar y decodificar el token
    const decoded = jwt.verify(token, JWT_SECRET) as { userId?: string; id?: string };
    const userId = decoded.userId ?? decoded.id;
    if (!userId) {
      throw new GraphQLError('Token inválido: no contiene id de usuario', {
        extensions: { code: 'UNAUTHENTICATED' }
      });
    }
    
    // 3. Buscar el usuario en la base de datos
    const user = await User.findById(userId).select('-password');
    
    if (!user) {
      throw new GraphQLError('Usuario no encontrado', {
        extensions: { code: 'UNAUTHENTICATED' }
      });
    }

    // 4. Retornar el usuario
    return user;
    
  } catch (error) {
    throw new GraphQLError('Token inválido o expirado', {
      extensions: { code: 'UNAUTHENTICATED' }
    });
  }
};