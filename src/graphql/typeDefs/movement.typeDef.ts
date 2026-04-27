import { gql } from 'apollo-server-express';

export const movementTypeDef = gql`
  type Kardex {
    id: ID!
    product: Product!
    movement: Movement!
    type: String!
    quantity: Int!
    unitPrice: Float!
    totalValue: Float!
    stockBefore: Int!
    stockAfter: Int!
    date: String!
  }

  type Movement {
    id: ID!
    product: Product!
    type: String!
    quantity: Int!
    unitPrice: Float!
    totalValue: Float!
    stockBefore: Int!
    stockAfter: Int!
    notes: String
    registeredBy: User!
    createdAt: String!
  }

  type SalesStats {
    totalSales: Float!
    count: Int!
    averageTicket: Float!
    dailySales: Float!
    weeklySales: Float!
    monthlySales: Float!
  }

  type ChartData {
    labels: [String!]!
    values: [Float!]!
  }

  extend type Query {
    movements(productId: ID, type: String, userId: ID, startDate: String, endDate: String): [Movement!]!
    kardex(productId: ID): [Kardex!]!
    salesStats: SalesStats!
    salesByMonth: ChartData!
    salesByCategory: ChartData!
    inventoryTrends(productId: ID!): ChartData!
  }

  extend type Mutation {
    createMovement(
      productId: ID!
      type: String!
      quantity: Int!
      unitPrice: Float!
      notes: String
    ): Movement!
  }
`;