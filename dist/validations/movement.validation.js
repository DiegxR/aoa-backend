"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateMovement = void 0;
const joi_1 = __importDefault(require("joi"));
const schema = joi_1.default.object({
    productId: joi_1.default.string().required().messages({
        'any.required': 'El producto es requerido',
    }),
    type: joi_1.default.string().valid('entrada', 'salida').required().messages({
        'any.only': 'El tipo debe ser entrada o salida',
    }),
    quantity: joi_1.default.number().positive().integer().required().messages({
        'number.positive': 'La cantidad debe ser mayor a 0',
        'number.integer': 'La cantidad debe ser un número entero',
    }),
    unitPrice: joi_1.default.number().positive().required().messages({
        'number.positive': 'El precio debe ser mayor a 0',
    }),
    notes: joi_1.default.string().optional().allow(''),
});
const validateMovement = (data) => {
    const { error } = schema.validate(data, { abortEarly: false });
    if (error) {
        const messages = error.details.map((d) => d.message).join(', ');
        throw new Error(`Validación fallida: ${messages}`);
    }
};
exports.validateMovement = validateMovement;
