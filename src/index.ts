import 'dotenv/config';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { typeDefs, resolvers } from './graphql';
import { connectDB } from './config/database';
import { authMiddleware } from './middlewares/auth.middleware';
import { GraphQLFormattedError } from 'graphql';

async function bootstrap(): Promise<void> {
  console.log('🚀 Iniciando bootstrap...');
  try {
    await connectDB();
    console.log('✅ Base de datos conectada en bootstrap');

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

    console.log('⏳ Iniciando Apollo Server...');
    await server.start();
    console.log('✅ Apollo Server iniciado');

    server.applyMiddleware({ 
      app, 
      path: '/graphql',
      cors: {
        origin: process.env.FRONTEND_URL ?? '*',
        credentials: true
      }
    });

    const PORT = process.env.PORT ? parseInt(process.env.PORT) : 4000;
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Servidor listo en: http://0.0.0.0:${PORT}${server.graphqlPath}`);
    });
  } catch (error) {
    console.error('❌ Error fatal durante el inicio:', error);
    process.exit(1);
  }
}

bootstrap();