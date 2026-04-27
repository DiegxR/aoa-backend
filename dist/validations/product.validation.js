"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateProduct = void 0;
const joi_1 = __importDefault(require("joi"));
const schema = joi_1.default.object({
    name: joi_1.default.string().min(2).required(),
    code: joi_1.default.string().alphanum().uppercase().required(),
    unitPrice: joi_1.default.number().positive().required(),
    stock: joi_1.default.number().min(0).required(),
    minStock: joi_1.default.number().min(0).default(0),
    category: joi_1.default.string().required(),
    description: joi_1.default.string().optional().allow(''),
    image: joi_1.default.string().optional().allow(null, ''),
});
const validateProduct = (data) => {
    const { error } = schema.validate(data, { abortEarly: false });
    if (error) {
        const messages = error.details.map((d) => d.message).join(', ');
        throw new Error(`Validación fallida: ${messages}`);
    }
};
exports.validateProduct = validateProduct;
