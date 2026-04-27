import { UserInputError } from 'apollo-server-express';
import Product from '../../models/Product.model';
import { validateProduct } from '../../validations/product.validation';
import { checkAuth, checkRole } from '../../utils/permissions';
import { logOperation } from '../../middlewares/logger.middleware';
import { GraphQLContext } from '../../types/context.types';
import { registerMovement } from '../../services/movement.service';

const transformProduct = (product: any) => {
  if (!product) return null;
  return {
    ...product,
    id: product._id.toString(),
    createdAt: product.createdAt ? product.createdAt.toISOString() : new Date().toISOString(),
    updatedAt: product.updatedAt ? product.updatedAt.toISOString() : new Date().toISOString(),
  };
};

export const productResolver = {
  Query: {
    products: async (
      _: unknown,
      { active }: { active?: boolean },
      context: GraphQLContext
    ) => {
      checkAuth(context);
      const filter = active !== undefined ? { active } : {};
      const products = await Product.find(filter).lean();
      return products.map(transformProduct);
    },

    product: async (_: unknown, { id }: { id: string }, context: GraphQLContext) => {
      checkAuth(context);
      const product = await Product.findById(id).lean();
      if (!product) throw new UserInputError('Producto no encontrado');
      return transformProduct(product);
    },
  },

  Mutation: {
    createProduct: async (_: unknown, args: any, context: GraphQLContext) => {
      const user = checkRole(context, ['admin']);
      validateProduct(args); 
      logOperation('createProduct', user, { args });
      
      const product = await Product.create(args);

      // Registrar el movimiento inicial de creación
      await registerMovement({
        productId: product._id.toString(),
        type: 'entrada',
        quantity: args.stock,
        unitPrice: args.unitPrice,
        notes: 'Carga inicial por creación de producto'
      }, user.id);

      return transformProduct(product.toObject());
    },

    updateProduct: async (
      _: unknown,
      { id, ...data }: { id: string; [key: string]: unknown },
      context: GraphQLContext
    ) => {
      const user = checkRole(context, ['admin']);
      logOperation('updateProduct', user, { id });
      const updated = await Product.findByIdAndUpdate(id, data, { new: true, runValidators: true }).lean();
      if (!updated) throw new UserInputError('Producto no encontrado');
      return transformProduct(updated);
    },
  },
};