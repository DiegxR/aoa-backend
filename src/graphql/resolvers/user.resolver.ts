import { AuthenticationError, UserInputError } from 'apollo-server-express';
import User from '../../models/User.model';
import { generateToken } from '../../utils/jwt.utils';
import { checkAuth, checkRole } from '../../utils/permissions';
import { GraphQLContext } from '../../types/context.types';
const transformUser = (user: any) => {
  if (!user) return null;
  
  // Transformar _id a id y eliminar password
  return {
    id: user._id.toString(), // Convertir ObjectId a string
    name: user.name,
    email: user.email,
    role: user.role,
    createdBy: user.createdBy ? user.createdBy.toString() : null,
    createdAt: user.createdAt ? user.createdAt.toISOString() : new Date().toISOString(),
    updatedAt: user.updatedAt ? user.updatedAt.toISOString() : new Date().toISOString(),
  };
};

export const userResolver = {
  Query: {
    me: async (_: unknown, __: unknown, context: GraphQLContext) => {
      const userFromAuth = checkAuth(context);
      const user = await User.findById(userFromAuth.id).lean();
      
      if (!user) {
        throw new AuthenticationError('Usuario no encontrado');
      }
      
      // Transformar el usuario para GraphQL
      return transformUser(user);
    },
    
    users: async (_: unknown, __: unknown, context: GraphQLContext) => {
      const userFromAuth = checkRole(context, ['admin']);
      
      // Filtrar por createdBy igual al id del usuario autenticado
      const users = await User.find({ createdBy: userFromAuth.id }).select('-password').lean();
      
      // Transformar cada usuario
      return users.map(transformUser);
    },
  },

  Mutation: {
    register: async (
      _: unknown,
      args: { name: string; email: string; password: string; role?: string; createdBy?: string },
      context: GraphQLContext
    ) => {
      const existing = await User.findOne({ email: args.email });
      if (existing) throw new UserInputError('El email ya está registrado');

      const user = await User.create(args);
      const token = generateToken({ id: String(user._id), email: user.email, role: user.role });
      return { token, user: transformUser(user) };
    },

    login: async (
      _: unknown,
      args: { email: string; password: string }
    ) => {
      const user = await User.findOne({ email: args.email });
      if (!user) throw new AuthenticationError('Credenciales inválidas');

      const valid = await user.comparePassword(args.password);
      if (!valid) throw new AuthenticationError('Credenciales inválidas');

      const token = generateToken({ id: String(user._id), email: user.email, role: user.role });
      return { token, user: transformUser(user) };
    },
  },
};