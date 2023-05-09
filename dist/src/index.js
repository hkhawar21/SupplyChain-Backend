"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const apollo_server_express_1 = require("apollo-server-express");
const apollo_server_core_1 = require("apollo-server-core");
const type_graphql_1 = require("type-graphql");
const resolvers_1 = require("./resolvers");
const type_graphql_2 = require("@generated/type-graphql");
const http = __importStar(require("http"));
const client_1 = __importDefault(require("./prisma/client"));
require("dotenv/config");
const ws_1 = require("graphql-ws/lib/use/ws");
const ws_2 = require("ws");
const AuthChecker_1 = require("./auth/AuthChecker");
const path = __importStar(require("path"));
const cors = require("cors");
const express = require("express");
(async () => {
    const schema = await (0, type_graphql_1.buildSchema)({
        resolvers: [
            resolvers_1.UserResolver,
            resolvers_1.AgentsResolver,
            resolvers_1.CategoryResolver,
            resolvers_1.ProductResolver,
            resolvers_1.OrderResolver,
            resolvers_1.InventoryResolver,
            resolvers_1.RawMaterialResolver,
            resolvers_1.FinanceResolver,
            type_graphql_2.RawMaterialRelationsResolver,
            type_graphql_2.ProductOrderRelationsResolver,
            type_graphql_2.ProductRelationsResolver,
            type_graphql_2.OrderRelationsResolver,
            type_graphql_2.CategoryRelationsResolver,
            type_graphql_2.InventoryRelationsResolver,
            type_graphql_2.ProductRawMaterialsRelationsResolver,
        ],
        authChecker: AuthChecker_1.authChecker,
        validate: false,
        emitSchemaFile: path.resolve(__dirname, "snapshots/schema", "schema.gql"),
    });
    const app = express();
    app.use(cors({
        origin: [
            "https://studio.apollographql.com",
            "http://localhost:3000",
        ],
    }));
    const httpServer = http.createServer(app);
    const server = new apollo_server_express_1.ApolloServer({
        schema,
        context: ({ req, res }) => ({
            req,
            res,
            prisma: client_1.default,
            user: (0, AuthChecker_1.getUserFromToken)(req),
        }),
        persistedQueries: false,
        plugins: [
            (0, apollo_server_core_1.ApolloServerPluginDrainHttpServer)({ httpServer }),
            {
                async serverWillStart() {
                    return {
                        async drainServer() {
                            await serverCleanup.dispose();
                        },
                    };
                },
            },
        ],
    });
    const wsServer = new ws_2.WebSocketServer({
        server: httpServer,
        path: "/subscriptions",
    });
    const serverCleanup = (0, ws_1.useServer)({
        schema,
        context: (ctx) => {
            const req = {
                get: (key) => ctx.connectionParams[key],
            };
            return { ...ctx, prisma: client_1.default, req };
        },
    }, wsServer);
    await server.start();
    server.applyMiddleware({
        app,
        path: "/",
    });
    const PORT = process.env.LISTENING_PORT || 4000;
    console.log("GRAPHQL PATH:  ", server.graphqlPath);
    httpServer.listen(PORT, () => {
        console.log(`Server is now running on http://localhost:${PORT}${server.graphqlPath}`);
    });
})();
// export const server = new ApolloServer({
//     schema,
//     context,
//     introspection: true,
//     plugins: [ApolloServerPluginLandingPageLocalDefault()],
// });
// const port = process.env.PORT || 3000;
// server.listen({ port }).then(({ url }) => {
//     console.log(`🚀  Server  ready at ${url}`);
// });
//# sourceMappingURL=index.js.map