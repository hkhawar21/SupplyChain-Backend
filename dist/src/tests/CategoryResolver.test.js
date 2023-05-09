"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_server_express_1 = require("apollo-server-express");
const resolvers_1 = require("../resolvers");
const client_1 = __importDefault(require("../prisma/client"));
const type_graphql_1 = require("type-graphql");
const AuthChecker_1 = require("../auth/AuthChecker");
const extensions = {
    req: {
        headers: {
            Authorization: "Bearer eyJhbGciOiJIUzI1NiJ9.MQ.qE39ToFvx4LCHkn3tDVpMwdABQHu4woudGi6jfg3zxs",
        },
    },
};
describe("CategoryResolver", () => {
    let server;
    beforeAll(async () => {
        const schema = await (0, type_graphql_1.buildSchema)({
            resolvers: [resolvers_1.CategoryResolver],
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
    describe("createCategory", () => {
        beforeAll(async () => {
            // Clear the database before running the tests
            await client_1.default.category.deleteMany({});
        });
        it("should create a new category", async () => {
            // Define the input
            const input = {
                name: "Test Category",
                status: true,
                image: "",
            };
            // Define the mutation
            const mutation = `
            mutation CreateCategory($categoryCreateInput: CategoryCreateInput!) {
                createCategory(categoryCreateInput: $categoryCreateInput) {
                    id
                    name
                    status
                    image
                }
            }
        `;
            // Execute the mutation
            const response = await server.executeOperation({
                query: mutation,
                variables: { categoryCreateInput: input },
                extensions,
            });
            // Check the response
            expect(response.errors).toBeUndefined();
            expect(response.data).toBeDefined();
            expect(response.data?.createCategory).toBeDefined();
            expect(response.data?.createCategory.id).toBeDefined();
            expect(response.data?.createCategory.name).toEqual(input.name);
            expect(response.data?.createCategory.status).toEqual(input.status);
            expect(response.data?.createCategory.image).toEqual(input.image);
            // Check if the category was created in the database
            const category = await client_1.default.category.findUnique({
                where: { id: response.data?.createCategory.id },
            });
            expect(category).toBeDefined();
            expect(category?.name).toEqual(input.name);
            expect(category?.status).toEqual(input.status);
            expect(category?.image).toEqual(input.image);
            // Cleaning up
            await client_1.default.category.delete({
                where: { id: response.data?.createCategory.id },
            });
        });
        it("should throw an error if the category already exists", async () => {
            // Define the input
            const input = {
                name: "Test Category",
                status: true,
                image: "",
            };
            // Try to create the category twice
            await client_1.default.category.create({ data: input });
            // Define the mutation
            const mutation = `
            mutation CreateCategory($categoryCreateInput: CategoryCreateInput!) {
                createCategory(categoryCreateInput: $categoryCreateInput) {
                    id
                    name
                    status
                    image
                }
            }
        `;
            // Execute the mutation
            const response = await server.executeOperation({
                query: mutation,
                variables: { categoryCreateInput: input },
                extensions,
            });
            // Check the response
            expect(response.errors).toBeDefined();
        });
    });
    it("should return all the categories", async () => {
        // Define the query
        const query = `
            query Categories {
                categories {
                    id
                    name
                    status
                    image
                }
            }
        `;
        // Execute the query
        const response = await server.executeOperation({ query, extensions });
        // Check the response
        expect(response.errors).toBeUndefined();
        expect(response.data).toBeDefined();
        expect(response.data?.categories).toBeDefined();
        expect(response.data?.categories.length).toBeGreaterThan(0);
    });
    it("should return a category by ID", async () => {
        // Create a category
        const input = {
            name: "Test Category",
            status: true,
            image: "",
        };
        const createdCategory = await client_1.default.category.create({ data: input });
        // Define the query
        const query = `
                query CategoryById($categoryByIdId: Int!) {
                    categoryById(id: $categoryByIdId) {
                        id
                        image
                        name
                        status
                    }
                }
            `;
        // Execute the query
        const response = await server.executeOperation({
            query,
            variables: { categoryByIdId: createdCategory.id },
            extensions,
        });
        // Check the response
        expect(response.errors).toBeUndefined();
        expect(response.data?.categoryById.id).toEqual(createdCategory.id);
        expect(response.data?.categoryById.name).toEqual(createdCategory.name);
        expect(response.data?.categoryById.status).toEqual(createdCategory.status);
        expect(response.data?.categoryById.image).toEqual(createdCategory.image);
        // Delete the category
        await client_1.default.category.delete({ where: { id: createdCategory.id } });
    });
    it("should return error if the category does not exist", async () => {
        // Define the query
        const query = `
                query CategoryById($id: Int!) {
                    categoryById(id: $id) {
                        id
                        name
                        status
                        image
                    }
                }
            `;
        // Execute the query
        const response = await server.executeOperation({
            query,
            variables: { id: 99999 },
            extensions,
        });
        // Check the response
        expect(response.errors).toBeDefined();
    });
    it("should update a category", async () => {
        // Creating a category
        const input = {
            name: "Test Category",
            status: true,
            image: "",
        };
        const createdCategory = await client_1.default.category.create({ data: input });
        // Define the input for update
        const updateInput = {
            id: createdCategory.id,
            name: "Updated Category",
            status: false,
            image: "",
        };
        // Define the mutation
        const mutation = `
            mutation UpdateCategory($categoryUpdateInput: CategoryUpdateInput!) {
                updateCategory(categoryUpdateInput: $categoryUpdateInput) {
                    id
                    name
                    status
                    image
                }
            }
                `;
        // Execute the mutation
        const response = await server.executeOperation({
            query: mutation,
            variables: { categoryUpdateInput: updateInput },
            extensions,
        });
        // Check the response
        expect(response.errors).toBeUndefined();
        expect(response.data).toBeDefined();
        expect(response.data?.updateCategory).toBeDefined();
        expect(response.data?.updateCategory.id).toEqual(createdCategory.id);
        expect(response.data?.updateCategory.name).toEqual(updateInput.name);
        expect(response.data?.updateCategory.status).toEqual(updateInput.status);
        expect(response.data?.updateCategory.image).toEqual(updateInput.image);
        // Cleaning up
        await client_1.default.category.delete({ where: { id: createdCategory.id } });
    });
});
//# sourceMappingURL=CategoryResolver.test.js.map