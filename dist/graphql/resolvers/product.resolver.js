"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.productResolver = void 0;
const apollo_server_express_1 = require("apollo-server-express");
const Product_model_1 = __importDefault(require("../../models/Product.model"));
const product_validation_1 = require("../../validations/product.validation");
const permissions_1 = require("../../utils/permissions");
const logger_middleware_1 = require("../../middlewares/logger.middleware");
const movement_service_1 = require("../../services/movement.service");
const transformProduct = (product) => {
    if (!product)
        return null;
    return {
        ...product,
        id: product._id.toString(),
        createdAt: product.createdAt ? product.createdAt.toISOString() : new Date().toISOString(),
        updatedAt: product.updatedAt ? product.updatedAt.toISOString() : new Date().toISOString(),
    };
};
exports.productResolver = {
    Query: {
        products: async (_, { active }, context) => {
            (0, permissions_1.checkAuth)(context);
            const filter = active !== undefined ? { active } : {};
            const products = await Product_model_1.default.find(filter).lean();
            return products.map(transformProduct);
        },
        product: async (_, { id }, context) => {
            (0, permissions_1.checkAuth)(context);
            const product = await Product_model_1.default.findById(id).lean();
            if (!product)
                throw new apollo_server_express_1.UserInputError('Producto no encontrado');
            return transformProduct(product);
        },
    },
    Mutation: {
        createProduct: async (_, args, context) => {
            const user = (0, permissions_1.checkRole)(context, ['admin']);
            (0, product_validation_1.validateProduct)(args);
            (0, logger_middleware_1.logOperation)('createProduct', user, { args });
            const product = await Product_model_1.default.create(args);
            // Registrar el movimiento inicial de creación
            await (0, movement_service_1.registerMovement)({
                productId: product._id.toString(),
                type: 'entrada',
                quantity: args.stock,
                unitPrice: args.unitPrice,
                notes: 'Carga inicial por creación de producto'
            }, user.id);
            return transformProduct(product.toObject());
        },
        updateProduct: async (_, { id, ...data }, context) => {
            const user = (0, permissions_1.checkRole)(context, ['admin']);
            (0, logger_middleware_1.logOperation)('updateProduct', user, { id });
            const updated = await Product_model_1.default.findByIdAndUpdate(id, data, { new: true, runValidators: true }).lean();
            if (!updated)
                throw new apollo_server_express_1.UserInputError('Producto no encontrado');
            return transformProduct(updated);
        },
    },
};
