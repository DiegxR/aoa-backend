"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userResolver = void 0;
const apollo_server_express_1 = require("apollo-server-express");
const User_model_1 = __importDefault(require("../../models/User.model"));
const jwt_utils_1 = require("../../utils/jwt.utils");
const permissions_1 = require("../../utils/permissions");
const transformUser = (user) => {
    if (!user)
        return null;
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
exports.userResolver = {
    Query: {
        me: async (_, __, context) => {
            const userFromAuth = (0, permissions_1.checkAuth)(context);
            const user = await User_model_1.default.findById(userFromAuth.id).lean();
            if (!user) {
                throw new apollo_server_express_1.AuthenticationError('Usuario no encontrado');
            }
            // Transformar el usuario para GraphQL
            return transformUser(user);
        },
        users: async (_, __, context) => {
            const userFromAuth = (0, permissions_1.checkRole)(context, ['admin']);
            // Filtrar por createdBy igual al id del usuario autenticado
            const users = await User_model_1.default.find({ createdBy: userFromAuth.id }).select('-password').lean();
            // Transformar cada usuario
            return users.map(transformUser);
        },
    },
    Mutation: {
        register: async (_, args, context) => {
            const existing = await User_model_1.default.findOne({ email: args.email });
            if (existing)
                throw new apollo_server_express_1.UserInputError('El email ya está registrado');
            const user = await User_model_1.default.create({
                ...args,
                role: args.role,
                createdBy: args.createdBy
            });
            const token = (0, jwt_utils_1.generateToken)({ id: String(user._id), email: user.email, role: user.role });
            return { token, user: transformUser(user) };
        },
        login: async (_, args) => {
            const user = await User_model_1.default.findOne({ email: args.email });
            if (!user)
                throw new apollo_server_express_1.AuthenticationError('Credenciales inválidas');
            const valid = await user.comparePassword(args.password);
            if (!valid)
                throw new apollo_server_express_1.AuthenticationError('Credenciales inválidas');
            const token = (0, jwt_utils_1.generateToken)({ id: String(user._id), email: user.email, role: user.role });
            return { token, user: transformUser(user) };
        },
    },
};
