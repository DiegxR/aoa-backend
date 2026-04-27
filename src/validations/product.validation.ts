import Joi from 'joi';

const schema = Joi.object({
  name:      Joi.string().min(2).required(),
  code:      Joi.string().alphanum().uppercase().required(),
  unitPrice: Joi.number().positive().required(),
  stock:     Joi.number().min(0).required(),
  minStock:  Joi.number().min(0).default(0),
  category:  Joi.string().required(),
  description: Joi.string().optional().allow(''),
  image: Joi.string().optional().allow(null, ''),
});

export const validateProduct = (data: unknown): void => {
  const { error } = schema.validate(data, { abortEarly: false });
  if (error) {
    const messages = error.details.map((d) => d.message).join(', ');
    throw new Error(`Validación fallida: ${messages}`);
  }
};