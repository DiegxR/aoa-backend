import 'dotenv/config';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { typeDefs, resolvers } from './graphql';
import { connectDB } from './config/database';
import { authMiddleware } from './middlewares/auth.middleware';
import { GraphQLFormattedError } from 'graphql';

async function bootstrap(): Promise<void> {
  await connectDB();

  const app = express();

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => authMiddleware(req),
    formatError: (error: GraphQLFormattedError) => {
      console.error('[GraphQL Error]', error.message);
      return {
        message: error.message,
        code: error.extensions?.code ?? 'INTERNAL_ERROR',
      };
    },
  });

  await server.start();
  server.applyMiddleware({ 
    app, 
    path: '/graphql',
    cors: {
      origin: process.env.FRONTEND_URL ?? '*',
      credentials: true
    }
  });

  const PORT = process.env.PORT ?? 4000;
  app.listen(PORT, () => {
    console.log(`🚀 Server: http://localhost:${PORT}/graphql`);
  });
}

bootstrap().catch(console.error);