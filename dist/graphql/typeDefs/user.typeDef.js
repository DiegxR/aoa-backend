"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userTypeDef = void 0;
const apollo_server_express_1 = require("apollo-server-express");
exports.userTypeDef = (0, apollo_server_express_1.gql) `
  type User {
    id: ID!
    name: String!
    email: String!
    role: String!
    createdBy: String
    createdAt: String!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  extend type Query {
    me: User!
    users: [User!]!
  }

  extend type Mutation {
    register(name: String!, email: String!, password: String!, role: String, createdBy: ID): AuthPayload!
    login(email: String!, password: String!): AuthPayload!
  }
`;
