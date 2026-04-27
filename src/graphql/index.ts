import { mergeTypeDefs, mergeResolvers } from '@graphql-tools/merge';
import { baseTypeDef }     from './typeDefs/base.typeDef';
import { userTypeDef }     from './typeDefs/user.typeDef';
import { productTypeDef }  from './typeDefs/product.typeDef';
import { movementTypeDef } from './typeDefs/movement.typeDef';
import { userResolver }     from './resolvers/user.resolver';
import { productResolver }  from './resolvers/product.resolver';
import { movementResolver } from './resolvers/movement.resolver';

export const typeDefs = mergeTypeDefs([
  baseTypeDef,       
  userTypeDef,
  productTypeDef,
  movementTypeDef,
]);

export const resolvers = mergeResolvers([
  userResolver,
  productResolver,
  movementResolver,
]);