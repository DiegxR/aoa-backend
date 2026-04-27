"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const process_1 = __importDefault(require("process"));
const generateToken = (user) => jsonwebtoken_1.default.sign({ id: user.id, role: user.role, email: user.email }, process_1.default.env.JWT_SECRET, { expiresIn: (process_1.default.env.JWT_EXPIRES_IN ?? '7d') });
exports.generateToken = generateToken;
const verifyToken = (token) => jsonwebtoken_1.default.verify(token, process_1.default.env.JWT_SECRET);
exports.verifyToken = verifyToken;
