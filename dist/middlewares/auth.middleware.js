"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const jwt_utils_1 = require("../utils/jwt.utils");
const User_model_1 = __importDefault(require("../models/User.model"));
const authMiddleware = async (req) => {
    const authHeader = req.headers.authorization ?? '';
    if (!authHeader.startsWith('Bearer ')) {
        if (authHeader)
            console.log('⚠️  Header de autorización no tiene formato Bearer');
        return { user: null };
    }
    try {
        const token = authHeader.split(' ')[1];
        if (!token) {
            console.log('⚠️  Header Bearer presente pero sin token');
            return { user: null };
        }
        const decoded = (0, jwt_utils_1.verifyToken)(token);
        const user = await User_model_1.default.findById(decoded.id).select('-password').lean();
        if (!user) {
            console.log(`❌ Token válido pero usuario no encontrado en DB (ID: ${decoded.id})`);
            return { user: null };
        }
        return {
            user: {
                id: String(user._id),
                email: user.email,
                role: user.role,
            },
        };
    }
    catch (error) {
        console.error('❌ Error en authMiddleware:', error.message || error);
        return { user: null };
    }
};
exports.authMiddleware = authMiddleware;
