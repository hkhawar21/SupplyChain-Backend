import { ApolloServer } from "apollo-server-express";
import {
    RawMaterialInput,
    RawMaterialRequestInput,
    RawMaterialUpdateInput,
    RawMaterialResolver,
} from "../resolvers";
import { RawMaterialRelationsResolver } from "@generated/type-graphql";
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
            resolvers: [RawMaterialResolver, RawMaterialRelationsResolver],
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
                inventory_id
                name
                presentInInventory
                price
                quantity
                requested
                requestedStatus
                status
            }
        }
        `;

        // Run the mutation
        const result = await server.executeOperation({
            query: mutation,
            variables: { rawMaterialInput: input },
            extensions,
        });

        console.log(result);

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

        const createdRawMaterial = await prisma.rawMaterial.create({
            data: {
                ...input,
                requested: 0,
                requestedStatus: RawMaterialStatus.PENDING,
                inventory_id: 1,
                presentInInventory: input.presentInInventory,
            },
        });

        // Define the mutation
        const mutation = `
        mutation CreateRawMaterial($rawMaterialInput: RawMaterialInput!) {
            createRawMaterial(rawMaterialInput: $rawMaterialInput) {
                id
                inventory_id
                name
                presentInInventory
                price
                quantity
                requested
                requestedStatus
                status
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
        expect(result.errors).toBeDefined();
        expect(result.errors?.[0].message).toEqual(
            "Raw Material already exists",
        );

        // Cleaning up
        await prisma.rawMaterial.delete({
            where: {
                id: createdRawMaterial.id,
            },
        });
    });

    it("should update a raw material", async () => {
        // Define the input
        const input: RawMaterialInput = {
            name: "Test Raw Material",
            status: true,
            quantity: 10,
            price: 100,
            presentInInventory: 10,
        };

        const createdRawMaterial = await prisma.rawMaterial.create({
            data: {
                ...input,
                requested: 0,
                requestedStatus: RawMaterialStatus.PENDING,
                inventory_id: 1,
                presentInInventory: input.presentInInventory,
            },
        });

        // Defining update input
        const updateInput: RawMaterialUpdateInput = {
            ...input,
            id: createdRawMaterial.id,
            name: "Updated Raw Material",
            status: false,
            presentInInventory: 0,
        };

        // Define the mutation
        const mutation = `
        mutation UpdateRawMaterial($rawMaterialInput: RawMaterialUpdateInput!) {
  updateRawMaterial(rawMaterialInput: $rawMaterialInput) {
    id
    inventory_id
    name
    presentInInventory
    price
    quantity
    requested
    requestedStatus
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
        expect(result.errors).toBeUndefined();
        expect(result.data).toBeDefined();
        expect(result.data?.updateRawMaterial).toBeDefined();
        expect(result.data?.updateRawMaterial).toMatchObject(updateInput);

        // Cleaning up
        await prisma.rawMaterial.delete({
            where: {
                id: createdRawMaterial.id,
            },
        });
    });

    it("should create a request for raw materials", async () => {
        // Create a raw material
        const rawMaterial = await prisma.rawMaterial.create({
            data: {
                name: "Test Raw Material",
                status: true,
                quantity: 10,
                price: 100,
                presentInInventory: 10,
                requested: 0,
                requestedStatus: RawMaterialStatus.PENDING,
                inventory_id: 1,
            },
        });

        // Define the input
        const input: RawMaterialRequestInput = {
            id: rawMaterial.id,
            quantity: 10,
        };

        // Define the mutation
        const mutation = `
        mutation CreateRawMaterialRequest($rawMaterialRequestInput: RawMaterialRequestInput!) {
            createRawMaterialRequest(rawMaterialRequestInput: $rawMaterialRequestInput) {
                id
                requested
            }
        }
        `;

        // Run the mutation
        const result = await server.executeOperation({
            query: mutation,
            variables: { rawMaterialRequestInput: input },
            extensions,
        });

        // Check the result
        expect(result.errors).toBeUndefined();
        expect(result.data).toBeDefined();
        expect(result.data?.createRawMaterialRequest).toBeDefined();
        expect(result.data?.createRawMaterialRequest).toMatchObject({
            id: rawMaterial.id,
            requested: input.quantity,
        });

        // Cleaning up
        await prisma.rawMaterial.delete({
            where: { id: result.data?.createRawMaterialRequest.id },
        });
    });

    it("should update status of raw material request to approved", async () => {
        // Creating a raw material
        const rawMaterial = await prisma.rawMaterial.create({
            data: {
                name: "Test Raw Material",
                status: true,
                quantity: 10,
                price: 100,
                presentInInventory: 10,
                requested: 10,
                requestedStatus: RawMaterialStatus.PENDING,
                inventory_id: 1,
            },
        });

        // Define the input
        const input = {
            id: rawMaterial.id,
            status: RawMaterialStatus.APPROVED,
        };

        // Define the mutation
        const mutation = `
            mutation ChangeStatusRawMaterial($changeStatusRawMaterialId: Int!, $status: RawMaterialStatus!) {
                changeStatusRawMaterial(id: $changeStatusRawMaterialId, status: $status) {
                    id
                    quantity
                    requested
                    requestedStatus
                }
            }
        `;

        // Run the mutation
        const result = await server.executeOperation({
            query: mutation,
            variables: {
                changeStatusRawMaterialId: input.id,
                status: input.status,
            },
            extensions,
        });

        // Check the result
        expect(result.errors).toBeUndefined();
        expect(result.data).toBeDefined();
        expect(result.data?.changeStatusRawMaterial?.requestedStatus).toEqual(
            RawMaterialStatus.APPROVED,
        );
        expect(result.data?.changeStatusRawMaterial?.requested).toEqual(0);
        expect(result.data?.changeStatusRawMaterial?.quantity).toEqual(
            rawMaterial.quantity + rawMaterial.requested,
        );

        // Cleaning up
        await prisma.rawMaterial.delete({
            where: { id: result.data?.changeStatusRawMaterial.id },
        });
    });

    it("should update status of raw material request to rejected", async () => {
        // Creating a raw material
        const rawMaterial = await prisma.rawMaterial.create({
            data: {
                name: "Test Raw Material",
                status: true,
                quantity: 10,
                price: 100,
                presentInInventory: 10,
                requested: 10,
                requestedStatus: RawMaterialStatus.PENDING,
                inventory_id: 1,
            },
        });

        // Define the input
        const input = {
            id: rawMaterial.id,
            status: RawMaterialStatus.REJECTED,
        };

        // Define the mutation
        const mutation = `
            mutation ChangeStatusRawMaterial($changeStatusRawMaterialId: Int!, $status: RawMaterialStatus!) {
                changeStatusRawMaterial(id: $changeStatusRawMaterialId, status: $status) {
                    id
                    quantity
                    requested
                    requestedStatus
                }
            }
        `;

        // Run the mutation
        const result = await server.executeOperation({
            query: mutation,
            variables: {
                changeStatusRawMaterialId: input.id,
                status: input.status,
            },
            extensions,
        });

        // Check the result
        expect(result.errors).toBeUndefined();
        expect(result.data).toBeDefined();
        expect(result.data?.changeStatusRawMaterial?.requestedStatus).toEqual(
            RawMaterialStatus.REJECTED,
        );
        expect(result.data?.changeStatusRawMaterial?.requested).toEqual(0);
        expect(result.data?.changeStatusRawMaterial?.quantity).toEqual(
            rawMaterial.quantity,
        );

        // Cleaning up
        await prisma.rawMaterial.delete({
            where: { id: result.data?.changeStatusRawMaterial.id },
        });
    });

    it("should return all the raw materials requested", async () => {
        // Creating multile raw materials with request
        const rawMaterial1 = await prisma.rawMaterial.createMany({
            data: [
                {
                    name: "Test Raw Material 1",
                    status: true,
                    quantity: 10,
                    price: 100,
                    presentInInventory: 10,
                    requested: 10,
                    requestedStatus: RawMaterialStatus.PENDING,
                    inventory_id: 1,
                },
                {
                    name: "Test Raw Material 2",
                    status: true,
                    quantity: 10,
                    price: 100,
                    presentInInventory: 10,
                    requested: 30,
                    requestedStatus: RawMaterialStatus.PENDING,
                    inventory_id: 1,
                },
                {
                    name: "Test Raw Material 3",
                    status: true,
                    quantity: 10,
                    price: 100,
                    presentInInventory: 10,
                    requested: 100,
                    requestedStatus: RawMaterialStatus.PENDING,
                    inventory_id: 1,
                },
                {
                    name: "Test Raw Material 4",
                    status: true,
                    quantity: 10,
                    price: 100,
                    presentInInventory: 10,
                    requested: 500,
                    requestedStatus: RawMaterialStatus.PENDING,
                    inventory_id: 1,
                },
                {
                    name: "Test Raw Material 5",
                    status: true,
                    quantity: 100,
                    price: 100,
                    presentInInventory: 10,
                    requested: 0,
                    requestedStatus: RawMaterialStatus.APPROVED,
                    inventory_id: 1,
                },
            ],
        });

        // Define the query
        const query = `
            query RawMaterialRequested {
                rawMaterialRequested {
                    id
                    inventory_id
                    name
                    presentInInventory
                    quantity
                    requested
                    requestedStatus
                    status
                }
            }
        `;

        // Run the query
        const result = await server.executeOperation({
            query,
            extensions,
        });

        // Check the result
        expect(result.errors).toBeUndefined();
        expect(result.data).toBeDefined();
        expect(result.data?.rawMaterialRequested).toBeDefined();
        expect(result.data?.rawMaterialRequested).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    requestedStatus: RawMaterialStatus.PENDING,
                }),
            ]),
        );
        expect(result.data?.rawMaterialRequested).not.toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    requestedStatus: RawMaterialStatus.APPROVED,
                }),
            ]),
        );
    });
});
