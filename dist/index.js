"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const apollo_server_express_1 = require("apollo-server-express");
const graphql_1 = require("./graphql");
const database_1 = require("./config/database");
const auth_middleware_1 = require("./middlewares/auth.middleware");
const cors_1 = __importDefault(require("cors"));
async function bootstrap() {
    try {
        await (0, database_1.connectDB)();
        const app = (0, express_1.default)();
        // Health check para Render
        app.get('/health', (_req, res) => {
            res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
        });
        app.use((0, cors_1.default)({
            origin: process.env.FRONTEND_URL || '*',
            credentials: true
        }));
        const server = new apollo_server_express_1.ApolloServer({
            typeDefs: graphql_1.typeDefs,
            resolvers: graphql_1.resolvers,
            context: ({ req }) => (0, auth_middleware_1.authMiddleware)(req),
            formatError: (error) => {
                console.error('[GraphQL Error]', error.message);
                return {
                    message: error.message,
                    code: error.extensions?.code ?? 'INTERNAL_ERROR',
                };
            },
        });
        await server.start();
        server.applyMiddleware({
            app: app,
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
    }
    catch (error) {
        console.error('❌ Error fatal durante el inicio:', error);
        process.exit(1);
    }
}
bootstrap();
