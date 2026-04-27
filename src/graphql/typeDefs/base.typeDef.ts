import { gql } from 'apollo-server-express';

export const baseTypeDef = gql`
  type Query {
    _empty: String
  }

  type Mutation {
    _empty: String
  }
`;