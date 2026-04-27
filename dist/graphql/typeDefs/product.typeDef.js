"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productTypeDef = void 0;
const apollo_server_express_1 = require("apollo-server-express");
exports.productTypeDef = (0, apollo_server_express_1.gql) `
  type Product {
    id: ID!
    name: String!
    code: String!
    description: String
    stock: Int!
    minStock: Int!
    unitPrice: Float!
    category: String!
    image: String
    active: Boolean!
    createdAt: String!
  }

  extend type Query {
    products(active: Boolean): [Product!]!
    product(id: ID!): Product
  }

  extend type Mutation {
    createProduct(
      name: String!
      code: String!
      description: String
      stock: Int!
      minStock: Int
      image: String
      unitPrice: Float!
      category: String!
    ): Product!

    updateProduct(
      id: ID!
      name: String
      description: String
      minStock: Int
      image: String
      unitPrice: Float
      category: String
      active: Boolean
    ): Product!
  }
`;
