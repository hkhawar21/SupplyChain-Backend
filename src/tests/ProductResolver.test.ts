import { ApolloServer } from "apollo-server-express";
import {
    ProductInput,
    ProductUpdateInput,
    ProductRawMaterialsInput,
    ProductRawMaterialUpdate,
    ProductResolver,
} from "../resolvers";
import { ProductRelationsResolver } from "@generated/type-graphql";
import {
    RawMaterialStatus,
    Category,
    RawMaterial,
} from "@generated/type-graphql";
import prisma from "../prisma/client";
import { buildSchema } from "type-graphql";
import { authChecker } from "../auth/AuthChecker";

const extensions = {
    req: {
        headers: {
            Authorization:
                "Bearer eyJhbGciOiJIUzI1NiJ9.MQ.qE39ToFvx4LCHkn3tDVpMwdABQHu4woudGi6jfg3zxs",
        },
    },
};

describe("Product Resolver", () => {
    let server: ApolloServer;
    let categories;
    let rawMaterials;

    beforeAll(async () => {
        const schema = await buildSchema({
            resolvers: [ProductResolver, ProductRelationsResolver],
            validate: false,
            authChecker,
        });

        server = new ApolloServer({
            schema,
            context: { prisma },
        });

        categories = await prisma.category.createMany({
            data: [
                {
                    name: "Test Category 1",
                    status: true,
                    image: "",
                },
                {
                    name: "Test Category 2",
                    status: true,
                    image: "",
                },
                {
                    name: "Test Category 3",
                    status: true,
                    image: "",
                },
            ],
        });
        rawMaterials = await prisma.rawMaterial.createMany({
            data: [
                {
                    name: "Test Raw Material 1",
                    status: true,
                    price: 100,
                    presentInInventory: 100,
                    requested: 0,
                    requestedStatus: RawMaterialStatus.PENDING,
                    inventory_id: 1,
                },
                {
                    name: "Test Raw Material 2",
                    status: true,
                    price: 1000,
                    presentInInventory: 300,
                    requested: 0,
                    requestedStatus: RawMaterialStatus.PENDING,
                    inventory_id: 1,
                },
            ],
        });
    });

    afterAll(async () => {
        await prisma.$disconnect();
    });
});
