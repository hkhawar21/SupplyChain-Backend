import "reflect-metadata";
import { ApolloServer } from "apollo-server-express";
import { ApolloServerPluginDrainHttpServer } from "apollo-server-core";
import { buildSchema } from "type-graphql";
import { UserResolver, AgentsResolver } from "./resolvers";
import {
    Raw_MaterialRelationsResolver,
    ProductOrderRelationsResolver,
    ProductRelationsResolver,
    InventoryRelationsResolver,
} from "@generated/type-graphql";
import * as http from "http";
import prisma from "./prisma/client";
import "dotenv/config";
import { useServer } from "graphql-ws/lib/use/ws";
import { WebSocketServer } from "ws";
import { authChecker } from "./auth/AuthChecker";
import * as path from "path";

const cors = require("cors");
const express = require("express");

(async () => {
    const schema = await buildSchema({
        resolvers: [
            UserResolver,
            AgentsResolver,
            Raw_MaterialRelationsResolver,
            ProductOrderRelationsResolver,
            ProductRelationsResolver,
            InventoryRelationsResolver,
        ],
        authChecker,
        emitSchemaFile: path.resolve(
            __dirname,
            "snapshots/schema",
            "schema.gql",
        ),
    });
    console.log(schema);

    const app = express();
    app.use(
        cors({
            origin: ["https://studio.apollographql.com"],
        }),
    );
    const httpServer = http.createServer(app);

    const server = new ApolloServer({
        schema,
        context: ({ req, res }) => ({ req, res, prisma }),
        persistedQueries: false,
        plugins: [
            ApolloServerPluginDrainHttpServer({ httpServer }),
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

    const wsServer = new WebSocketServer({
        server: httpServer,
        path: "/subscriptions",
    });

    const serverCleanup = useServer(
        {
            schema,
            context: (ctx: any) => {
                const req = {
                    get: (key: any) => ctx.connectionParams[key],
                };
                return { ...ctx, prisma, req };
            },
        },
        wsServer,
    );

    await server.start();
    server.applyMiddleware({
        app,
        path: "/",
    });

    const PORT = process.env.LISTENING_PORT || 4000;
    console.log("GRAPHQL PATH:  ", server.graphqlPath);
    httpServer.listen(PORT, () => {
        console.log(
            `Server is now running on http://localhost:${PORT}${server.graphqlPath}`,
        );
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
