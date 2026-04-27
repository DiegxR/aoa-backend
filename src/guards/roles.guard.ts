// guards/roles.guard.ts
import { GraphQLError } from 'graphql';
import { IUser } from '../models/User.model';

// Guard de roles: verifica que el usuario tenga el rol permitido
export const rolesGuard = (user: IUser, allowedRoles: string[]) => {
  // 1. Verificar que el usuario existe
  if (!user) {
    throw new GraphQLError('Usuario no autenticado', {
      extensions: { code: 'UNAUTHENTICATED' }
    });
  }

  // 2. Verificar si el rol del usuario está permitido
  if (!allowedRoles.includes(user.role)) {
    throw new GraphQLError(
      `Acceso denegado. Rol "${user.role}" no autorizado. Roles permitidos: ${allowedRoles.join(', ')}`,
      {
        extensions: { code: 'FORBIDDEN' }
      }
    );
  }

  // 3. Si pasa, retornar true
  return true;
};