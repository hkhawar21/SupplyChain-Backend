import { ApolloServer } from "apollo-server-express";
import { CategoryResolver } from "../resolvers";
import { CategoryCreateInput, CategoryUpdateInput } from "../resolvers";
import { Category } from "@generated/type-graphql";
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

describe("CategoryResolver", () => {
    let server: ApolloServer;

    beforeAll(async () => {
        const schema = await buildSchema({
            resolvers: [CategoryResolver],
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

    describe("createCategory", () => {
        beforeAll(async () => {
            // Clear the database before running the tests
            await prisma.category.deleteMany({});
        });

        it("should create a new category", async () => {
            // Define the input
            const input: CategoryCreateInput = {
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
            const category: Category | null = await prisma.category.findUnique({
                where: { id: response.data?.createCategory.id },
            });
            expect(category).toBeDefined();
            expect(category?.name).toEqual(input.name);
            expect(category?.status).toEqual(input.status);
            expect(category?.image).toEqual(input.image);

            // Cleaning up
            await prisma.category.delete({
                where: { id: response.data?.createCategory.id },
            });
        });

        it("should throw an error if the category already exists", async () => {
            // Define the input
            const input: CategoryCreateInput = {
                name: "Test Category",
                status: true,
                image: "",
            };

            // Try to create the category twice
            await prisma.category.create({ data: input });

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
        const input: CategoryCreateInput = {
            name: "Test Category",
            status: true,
            image: "",
        };
        const createdCategory = await prisma.category.create({ data: input });

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
            variables: { id: createdCategory.id },
            extensions,
        });

        // Check the response
        expect(response.errors).toBeUndefined();
        expect(response.data?.categoryById.id).toEqual(createdCategory.id);
        expect(response.data?.categoryById.name).toEqual(createdCategory.name);
        expect(response.data?.categoryById.status).toEqual(
            createdCategory.status,
        );
        expect(response.data?.categoryById.image).toEqual(
            createdCategory.image,
        );

        // Delete the category
        await prisma.category.delete({ where: { id: createdCategory.id } });
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
        const input: CategoryCreateInput = {
            name: "Test Category",
            status: true,
            image: "",
        };
        const createdCategory = await prisma.category.create({ data: input });

        // Define the input for update
        const updateInput: CategoryUpdateInput = {
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

        console.log(response.errors);

        // Check the response
        expect(response.errors).toBeUndefined();
        expect(response.data).toBeDefined();
        expect(response.data?.updateCategory).toBeDefined();
        expect(response.data?.updateCategory.id).toEqual(createdCategory.id);
        expect(response.data?.updateCategory.name).toEqual(updateInput.name);
        expect(response.data?.updateCategory.status).toEqual(
            updateInput.status,
        );
        expect(response.data?.updateCategory.image).toEqual(updateInput.image);

        // Cleaning up
        await prisma.category.delete({ where: { id: createdCategory.id } });
    });
});
