import Joi from 'joi';
import { CreateMovementInput } from '../types/movement.types';

const schema = Joi.object<CreateMovementInput>({
  productId: Joi.string().required().messages({
    'any.required': 'El producto es requerido',
  }),
  type: Joi.string().valid('entrada', 'salida').required().messages({
    'any.only': 'El tipo debe ser entrada o salida',
  }),
  quantity: Joi.number().positive().integer().required().messages({
    'number.positive': 'La cantidad debe ser mayor a 0',
    'number.integer': 'La cantidad debe ser un número entero',
  }),
  unitPrice: Joi.number().positive().required().messages({
    'number.positive': 'El precio debe ser mayor a 0',
  }),
  notes: Joi.string().optional().allow(''),
});

export const validateMovement = (data: unknown): void => {
  const { error } = schema.validate(data, { abortEarly: false });
  if (error) {
    const messages = error.details.map((d) => d.message).join(', ');
    throw new Error(`Validación fallida: ${messages}`);
  }
};