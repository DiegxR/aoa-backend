import { gql } from 'apollo-server-express';

export const userTypeDef = gql`
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