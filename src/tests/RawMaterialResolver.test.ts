import { ApolloServer } from "apollo-server-express";
import { CategoryResolver } from "../resolvers";
import {
    RawMaterialInput,
    RawMaterialRequestInput,
    RawMaterialUpdateInput,
    RawMaterialResolver,
} from "../resolvers";
import { RawMaterial, RawMaterialStatus } from "@generated/type-graphql";
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

describe("Raw Material Resolver", () => {
    let server: ApolloServer;

    beforeAll(async () => {
        const schema = await buildSchema({
            resolvers: [RawMaterialResolver],
            validate: false,
            authChecker,
        });

        server = new ApolloServer({
            schema,
            context: { prisma },
        });
    });

    afterAll(async () => {
        await prisma.$disconnect();
    });

    it("should create a new raw material", async () => {
        // Define the input
        const input: RawMaterialInput = {
            name: "Test Raw Material",
            status: true,
            quantity: 10,
            price: 100,
            presentInInventory: 10,
        };

        // Define the mutation
        const mutation = `
        mutation CreateRawMaterial($rawMaterialInput: RawMaterialInput!) {
            createRawMaterial(rawMaterialInput: $rawMaterialInput) {
                id
                name
                status
                quantity
                price
                presentInInventory
            }
        }
        `;

        // Run the mutation
        const result = await server.executeOperation({
            query: mutation,
            variables: { rawMaterialInput: input },
            extensions,
        });

        // Check the result
        expect(result.errors).toBeUndefined();
        expect(result.data).toBeDefined();
        expect(result.data?.createRawMaterial).toBeDefined();
        expect(result.data?.createRawMaterial).toMatchObject(input);

        // Cleaning up
        await prisma.rawMaterial.delete({
            where: { id: result.data?.createRawMaterial.id },
        });
    });

    it("should return error if raw material already exists", async () => {
        // Define the input
        const input: RawMaterialInput = {
            name: "Test Raw Material",
            status: true,
            quantity: 10,
            price: 100,
            presentInInventory: 10,
        };

        const createdCategory = await prisma.rawMaterial.create({
            data: {
                ...input,
                requested: 0,
                requestedStatus: RawMaterialStatus.PENDING,
                inventory_id: 0,
                presentInInventory: input.presentInInventory,
            },
        });

        // Defining update input
        const updateInput = {
            ...input,
            id: createdCategory.id,
            name: "Updated Raw Material",
            status: false,
            presentInInventory: 0,
        };

        // Define the mutation
        const mutation = `
        mutation UpdateCategory($categoryUpdateInput: CategoryUpdateInput!) {
            updateCategory(categoryUpdateInput: $categoryUpdateInput) {
                id
                image
                name
                status
            }
        }
        `;

        // Run the mutation
        const result = await server.executeOperation({
            query: mutation,
            variables: { rawMaterialInput: updateInput },
            extensions,
        });

        // Check the result
        expect(result.errors).toBeDefined();
        expect(result.errors?.[0].message).toEqual(
            "Raw Material already exists",
        );

        // Cleaning up
        await prisma.rawMaterial.delete({
            where: {
                id: createdCategory.id,
            },
        });
    });
});
