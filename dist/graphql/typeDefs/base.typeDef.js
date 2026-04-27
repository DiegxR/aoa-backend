"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.baseTypeDef = void 0;
const apollo_server_express_1 = require("apollo-server-express");
exports.baseTypeDef = (0, apollo_server_express_1.gql) `
  type Query {
    _empty: String
  }

  type Mutation {
    _empty: String
  }
`;
