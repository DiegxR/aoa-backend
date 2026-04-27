"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authGuard = void 0;
// guards/auth.guard.ts
const graphql_1 = require("graphql");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_model_1 = __importDefault(require("../models/User.model"));
const JWT_SECRET = process.env.JWT_SECRET || 'secret123';
// Guard principal: verifica que el usuario esté autenticado
const authGuard = async (token) => {
    // 1. Verificar que existe el token
    if (!token) {
        throw new graphql_1.GraphQLError('No autenticado. Token requerido', {
            extensions: { code: 'UNAUTHENTICATED' }
        });
    }
    try {
        // 2. Verificar y decodificar el token
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        const userId = decoded.userId ?? decoded.id;
        if (!userId) {
            throw new graphql_1.GraphQLError('Token inválido: no contiene id de usuario', {
                extensions: { code: 'UNAUTHENTICATED' }
            });
        }
        // 3. Buscar el usuario en la base de datos
        const user = await User_model_1.default.findById(userId).select('-password');
        if (!user) {
            throw new graphql_1.GraphQLError('Usuario no encontrado', {
                extensions: { code: 'UNAUTHENTICATED' }
            });
        }
        // 4. Retornar el usuario
        return user;
    }
    catch (error) {
        throw new graphql_1.GraphQLError('Token inválido o expirado', {
            extensions: { code: 'UNAUTHENTICATED' }
        });
    }
};
exports.authGuard = authGuard;
