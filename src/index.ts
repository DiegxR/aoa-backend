import 'dotenv/config';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { typeDefs, resolvers } from './graphql';
import { connectDB } from './config/database';
import { authMiddleware } from './middlewares/auth.middleware';
import { GraphQLFormattedError } from 'graphql';
import cors from "cors"

async function bootstrap(): Promise<void> {
  try {
  await connectDB();

  const app = express();
  // Health check para Render
  app.get('/health', (_req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  app.use(cors({
    origin: process.env.FRONTEND_URL || '*',
    credentials: true
  }));
  
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }: {req: any}) => authMiddleware(req),
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
    app: app as any,
    path: '/graphql',
    cors: {
      origin: process.env.FRONTEND_URL ?? '*',
      credentials: true
    }
  });

    const PORT = process.env.PORT ? parseInt(process.env.PORT) : 4000;
    app.listen(PORT, '0.0.0.0', () => {
      const displayPort = PORT === 4000 ? 'localhost:4000' : `0.0.0.0:${PORT}`;
      console.log(`🚀 Servidor listo en: http://${displayPort}${server.graphqlPath}`);
    });
  } catch (error) {
    console.error('❌ Error fatal durante el inicio:', error);
    process.exit(1);
  }
}

bootstrap();