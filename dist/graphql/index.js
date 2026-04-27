"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolvers = exports.typeDefs = void 0;
const merge_1 = require("@graphql-tools/merge");
const base_typeDef_1 = require("./typeDefs/base.typeDef");
const user_typeDef_1 = require("./typeDefs/user.typeDef");
const product_typeDef_1 = require("./typeDefs/product.typeDef");
const movement_typeDef_1 = require("./typeDefs/movement.typeDef");
const user_resolver_1 = require("./resolvers/user.resolver");
const product_resolver_1 = require("./resolvers/product.resolver");
const movement_resolver_1 = require("./resolvers/movement.resolver");
exports.typeDefs = (0, merge_1.mergeTypeDefs)([
    base_typeDef_1.baseTypeDef,
    user_typeDef_1.userTypeDef,
    product_typeDef_1.productTypeDef,
    movement_typeDef_1.movementTypeDef,
]);
exports.resolvers = (0, merge_1.mergeResolvers)([
    user_resolver_1.userResolver,
    product_resolver_1.productResolver,
    movement_resolver_1.movementResolver,
]);
