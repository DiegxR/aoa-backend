"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rolesGuard = void 0;
// guards/roles.guard.ts
const graphql_1 = require("graphql");
// Guard de roles: verifica que el usuario tenga el rol permitido
const rolesGuard = (user, allowedRoles) => {
    // 1. Verificar que el usuario existe
    if (!user) {
        throw new graphql_1.GraphQLError('Usuario no autenticado', {
            extensions: { code: 'UNAUTHENTICATED' }
        });
    }
    // 2. Verificar si el rol del usuario está permitido
    if (!allowedRoles.includes(user.role)) {
        throw new graphql_1.GraphQLError(`Acceso denegado. Rol "${user.role}" no autorizado. Roles permitidos: ${allowedRoles.join(', ')}`, {
            extensions: { code: 'FORBIDDEN' }
        });
    }
    // 3. Si pasa, retornar true
    return true;
};
exports.rolesGuard = rolesGuard;
