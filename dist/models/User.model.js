"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// models/User.model.ts
const mongoose_1 = require("mongoose");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const userSchema = new mongoose_1.Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, minlength: 6 },
    role: { type: String, enum: ['admin', 'bodeguero', 'consultor', 'user'], default: 'user' },
    createdBy: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', default: null },
}, {
    timestamps: true,
    // Importante: Para que los virtuals se incluyan en los resultados
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});
// ✅ Agregar virtual 'id' que devuelve _id como string
userSchema.virtual('id').get(function () {
    return this._id.toString();
});
// Middleware para hashear password
userSchema.pre('save', async function () {
    if (!this.isModified('password'))
        return;
    this.password = await bcryptjs_1.default.hash(this.password, 12);
});
// Método para comparar password
userSchema.methods.comparePassword = async function (candidate) {
    return bcryptjs_1.default.compare(candidate, this.password);
};
exports.default = (0, mongoose_1.model)('User', userSchema);
