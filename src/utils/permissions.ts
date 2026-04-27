import { AuthenticationError, ForbiddenError } from 'apollo-server-express';
import { GraphQLContext, UserRole } from '../types/context.types';

export const checkAuth = (context: GraphQLContext) => {
  if (!context.user)
    throw new AuthenticationError('Debes iniciar sesión');
  return context.user;
};

export const checkRole = (context: GraphQLContext, roles: UserRole[]) => {
  const user = checkAuth(context);
  if (!roles.includes(user.role))
    throw new ForbiddenError(`Rol requerido: ${roles.join(' o ')}`);
  return user;
};