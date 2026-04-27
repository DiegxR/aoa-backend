"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkRole = exports.checkAuth = void 0;
const apollo_server_express_1 = require("apollo-server-express");
const checkAuth = (context) => {
    if (!context.user)
        throw new apollo_server_express_1.AuthenticationError('Debes iniciar sesión');
    return context.user;
};
exports.checkAuth = checkAuth;
const checkRole = (context, roles) => {
    const user = (0, exports.checkAuth)(context);
    if (!roles.includes(user.role))
        throw new apollo_server_express_1.ForbiddenError(`Rol requerido: ${roles.join(' o ')}`);
    return user;
};
exports.checkRole = checkRole;
