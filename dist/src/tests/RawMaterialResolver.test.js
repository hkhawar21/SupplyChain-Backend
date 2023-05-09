"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_server_express_1 = require("apollo-server-express");
const resolvers_1 = require("../resolvers");
const type_graphql_1 = require("@generated/type-graphql");
const type_graphql_2 = require("@generated/type-graphql");
const client_1 = __importDefault(require("../prisma/client"));
const type_graphql_3 = require("type-graphql");
const AuthChecker_1 = require("../auth/AuthChecker");
const extensions = {
    req: {
        headers: {
            Authorization: "Bearer eyJhbGciOiJIUzI1NiJ9.MQ.qE39ToFvx4LCHkn3tDVpMwdABQHu4woudGi6jfg3zxs",
        },
    },
};
describe("Raw Material Resolver", () => {
    let server;
    beforeAll(async () => {
        const schema = await (0, type_graphql_3.buildSchema)({
            resolvers: [resolvers_1.RawMaterialResolver, type_graphql_1.RawMaterialRelationsResolver],
            validate: false,
            authChecker: AuthChecker_1.authChecker,
        });
        server = new apollo_server_express_1.ApolloServer({
            schema,
            context: { prisma: client_1.default },
        });
    });
    afterAll(async () => {
        await client_1.default.$disconnect();
    });
    it("should create a new raw material", async () => {
        // Define the input
        const input = {
            name: "Test Raw Material",
            status: true,
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
        expect(result.errors).toBeUndefined();
        expect(result.data).toBeDefined();
        expect(result.data?.createRawMaterial).toBeDefined();
        expect(result.data?.createRawMaterial).toMatchObject(input);
        // Cleaning up
        await client_1.default.rawMaterial.delete({
            where: { id: result.data?.createRawMaterial.id },
        });
    });
    it("should return error if raw material already exists", async () => {
        // Define the input
        const input = {
            name: "Test Raw Material",
            status: true,
            price: 100,
            presentInInventory: 10,
        };
        const createdRawMaterial = await client_1.default.rawMaterial.create({
            data: {
                ...input,
                requested: 0,
                requestedStatus: type_graphql_2.RawMaterialStatus.PENDING,
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
        expect(result.errors?.[0].message).toEqual("Raw Material already exists");
        // Cleaning up
        await client_1.default.rawMaterial.delete({
            where: {
                id: createdRawMaterial.id,
            },
        });
    });
    it("should update a raw material", async () => {
        // Define the input
        const input = {
            name: "Test Raw Material",
            status: true,
            price: 100,
            presentInInventory: 10,
        };
        const createdRawMaterial = await client_1.default.rawMaterial.create({
            data: {
                ...input,
                requested: 0,
                requestedStatus: type_graphql_2.RawMaterialStatus.PENDING,
                inventory_id: 1,
                presentInInventory: input.presentInInventory,
            },
        });
        // Defining update input
        const updateInput = {
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
        await client_1.default.rawMaterial.delete({
            where: {
                id: createdRawMaterial.id,
            },
        });
    });
    it("should create a request for raw materials", async () => {
        // Create a raw material
        const rawMaterial = await client_1.default.rawMaterial.create({
            data: {
                name: "Test Raw Material",
                status: true,
                price: 100,
                presentInInventory: 10,
                requested: 0,
                requestedStatus: type_graphql_2.RawMaterialStatus.PENDING,
                inventory_id: 1,
            },
        });
        // Define the input
        const input = {
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
        await client_1.default.rawMaterial.delete({
            where: { id: result.data?.createRawMaterialRequest.id },
        });
    });
    it("should update status of raw material request to approved", async () => {
        // Creating a raw material
        const rawMaterial = await client_1.default.rawMaterial.create({
            data: {
                name: "Test Raw Material",
                status: true,
                price: 100,
                presentInInventory: 10,
                requested: 10,
                requestedStatus: type_graphql_2.RawMaterialStatus.PENDING,
                inventory_id: 1,
            },
        });
        // Define the input
        const input = {
            id: rawMaterial.id,
            status: type_graphql_2.RawMaterialStatus.APPROVED,
        };
        // Define the mutation
        const mutation = `
            mutation ChangeStatusRawMaterial($changeStatusRawMaterialId: Int!, $status: RawMaterialStatus!) {
                changeStatusRawMaterial(id: $changeStatusRawMaterialId, status: $status) {
                    id
                    requested
                    requestedStatus
                    presentInInventory
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
        expect(result.data?.changeStatusRawMaterial?.requestedStatus).toEqual(type_graphql_2.RawMaterialStatus.APPROVED);
        expect(result.data?.changeStatusRawMaterial?.requested).toEqual(0);
        expect(result.data?.changeStatusRawMaterial?.presentInInventory).toEqual(rawMaterial.presentInInventory + rawMaterial.requested);
        // Cleaning up
        await client_1.default.rawMaterial.delete({
            where: { id: result.data?.changeStatusRawMaterial.id },
        });
    });
    it("should update status of raw material request to rejected", async () => {
        // Creating a raw material
        const rawMaterial = await client_1.default.rawMaterial.create({
            data: {
                name: "Test Raw Material",
                status: true,
                price: 100,
                presentInInventory: 10,
                requested: 10,
                requestedStatus: type_graphql_2.RawMaterialStatus.PENDING,
                inventory_id: 1,
            },
        });
        // Define the input
        const input = {
            id: rawMaterial.id,
            status: type_graphql_2.RawMaterialStatus.REJECTED,
        };
        // Define the mutation
        const mutation = `
            mutation ChangeStatusRawMaterial($changeStatusRawMaterialId: Int!, $status: RawMaterialStatus!) {
                changeStatusRawMaterial(id: $changeStatusRawMaterialId, status: $status) {
                    id
                    requested
                    requestedStatus
                    presentInInventory
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
        expect(result.data?.changeStatusRawMaterial?.requestedStatus).toEqual(type_graphql_2.RawMaterialStatus.REJECTED);
        expect(result.data?.changeStatusRawMaterial?.requested).toEqual(0);
        expect(result.data?.changeStatusRawMaterial?.presentInInventory).toEqual(rawMaterial.presentInInventory);
        // Cleaning up
        await client_1.default.rawMaterial.delete({
            where: { id: result.data?.changeStatusRawMaterial.id },
        });
    });
    it("should return all the raw materials requested", async () => {
        // Creating multile raw materials with request
        const rawMaterial1 = await client_1.default.rawMaterial.createMany({
            data: [
                {
                    name: "Test Raw Material 1",
                    status: true,
                    price: 100,
                    presentInInventory: 10,
                    requested: 10,
                    requestedStatus: type_graphql_2.RawMaterialStatus.PENDING,
                    inventory_id: 1,
                },
                {
                    name: "Test Raw Material 2",
                    status: true,
                    price: 100,
                    presentInInventory: 10,
                    requested: 30,
                    requestedStatus: type_graphql_2.RawMaterialStatus.PENDING,
                    inventory_id: 1,
                },
                {
                    name: "Test Raw Material 3",
                    status: true,
                    price: 100,
                    presentInInventory: 10,
                    requested: 100,
                    requestedStatus: type_graphql_2.RawMaterialStatus.PENDING,
                    inventory_id: 1,
                },
                {
                    name: "Test Raw Material 4",
                    status: true,
                    price: 100,
                    presentInInventory: 10,
                    requested: 500,
                    requestedStatus: type_graphql_2.RawMaterialStatus.PENDING,
                    inventory_id: 1,
                },
                {
                    name: "Test Raw Material 5",
                    status: true,
                    price: 100,
                    presentInInventory: 10,
                    requested: 0,
                    requestedStatus: type_graphql_2.RawMaterialStatus.APPROVED,
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
        expect(result.data?.rawMaterialRequested).toEqual(expect.arrayContaining([
            expect.objectContaining({
                requestedStatus: type_graphql_2.RawMaterialStatus.PENDING,
            }),
        ]));
        expect(result.data?.rawMaterialRequested).not.toEqual(expect.arrayContaining([
            expect.objectContaining({
                requestedStatus: type_graphql_2.RawMaterialStatus.APPROVED,
            }),
        ]));
    });
});
//# sourceMappingURL=RawMaterialResolver.test.js.map