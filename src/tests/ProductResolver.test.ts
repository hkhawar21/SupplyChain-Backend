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
    let categories: Category[];
    let rawMaterials: RawMaterial[];

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

        // Clear the database before running the tests
        // await prisma.product.deleteMany({});
        // await prisma.category.deleteMany({});
        // await prisma.rawMaterial.deleteMany({});

        await prisma.category.createMany({
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
                {
                    name: "Test Category 4",
                    status: false,
                    image: "",
                },
            ],
        });

        await prisma.rawMaterial.createMany({
            data: [
                {
                    name: "Test Raw Material 1",
                    status: true,
                    price: 100,
                    presentInInventory: 10000,
                    requested: 0,
                    requestedStatus: RawMaterialStatus.APPROVED,
                    inventory_id: 1,
                },
                {
                    name: "Test Raw Material 2",
                    status: true,
                    price: 1000,
                    presentInInventory: 30000,
                    requested: 0,
                    requestedStatus: RawMaterialStatus.APPROVED,
                    inventory_id: 1,
                },
                {
                    name: "Test Raw Material 3",
                    status: true,
                    price: 10,
                    presentInInventory: 1000,
                    requested: 0,
                    requestedStatus: RawMaterialStatus.APPROVED,
                    inventory_id: 1,
                },
                {
                    name: "Test Raw Material 4",
                    status: false,
                    price: 10000,
                    presentInInventory: 3000,
                    requested: 0,
                    requestedStatus: RawMaterialStatus.APPROVED,
                    inventory_id: 1,
                },
            ],
        });

        categories = await prisma.category.findMany();
        rawMaterials = await prisma.rawMaterial.findMany();
    });

    afterAll(async () => {
        await prisma.$disconnect();
    });

    it("should create a new product", async () => {
        const input: ProductInput = {
            name: "Test Product",
            status: true,
            image: "",
            category_id: categories[1].id,
            weight: 800,
            price_per_unit: 10000,
            time: "8 days",
            presentInInventory: 0,
            raw_materials: [
                {
                    raw_material_id: rawMaterials[0].id,
                    quantity: 10,
                },
                {
                    raw_material_id: rawMaterials[1].id,
                    quantity: 10,
                },
            ],
        };

        const mutation = `
            mutation CreateProduct($productInput: ProductInput!) {
                createProduct(productInput: $productInput) {
                    id
                    category_id
                    category {
                        id
                        status
                    }
                    name
                    presentInInventory
                    price_per_unit
                    raw_materials {
                        id
                        quantity
                        raw_material_id
                        product_id
                    }
                    status
                    time
                    weight
                }
            }
        `;

        const result = await server.executeOperation({
            query: mutation,
            variables: { productInput: input },
            extensions,
        });

        expect(result.errors).toBeUndefined();
        expect(result.data).toBeDefined();
        expect(result.data?.createProduct).toBeDefined();
        expect(result.data?.createProduct.id).toBeDefined();
        expect(result.data?.createProduct.name).toEqual(input.name);
        expect(result.data?.createProduct.status).toEqual(input.status);
        expect(result.data?.createProduct.category).toBeDefined();
        expect(result.data?.createProduct.category_id).toEqual(
            input.category_id,
        );
        expect(result.data?.createProduct.category.status).toEqual(true);
        expect(result.data?.createProduct.raw_materials).toBeDefined();
        expect(result.data?.createProduct.raw_materials.length).toEqual(
            input.raw_materials.length,
        );

        // Cleaning up
        await prisma.product.delete({
            where: { id: result.data?.createProduct.id },
        });
    });

    it("should return error for creating duplicate product", async () => {
        // Create a product
        const createProduct = await prisma.product.create({
            data: {
                name: "Test Product",
                status: true,
                image: "",
                category_id: categories[1].id,
                weight: 800,
                price_per_unit: 10000,
                time: "8 days",
                presentInInventory: 0,
                raw_materials: {
                    createMany: {
                        data: [
                            {
                                raw_material_id: rawMaterials[0].id,
                                quantity: 10,
                            },
                            {
                                raw_material_id: rawMaterials[1].id,
                                quantity: 10,
                            },
                        ],
                    },
                },
            },
        });

        const input: ProductInput = {
            name: "Test Product",
            status: true,
            image: "",
            category_id: categories[1].id,
            weight: 800,
            price_per_unit: 10000,
            time: "8 days",
            presentInInventory: 0,
            raw_materials: [
                {
                    raw_material_id: rawMaterials[0].id,
                    quantity: 10,
                },
                {
                    raw_material_id: rawMaterials[1].id,
                    quantity: 10,
                },
            ],
        };

        const mutation = `
            mutation CreateProduct($productInput: ProductInput!) {
                createProduct(productInput: $productInput) {
                    id
                    category_id
                    category {
                        id
                        status
                    }
                    name
                    presentInInventory
                    price_per_unit
                    raw_materials {
                        id
                        quantity
                        raw_material_id
                        product_id
                    }
                    status
                    time
                    weight
                }
            }
        `;

        const result = await server.executeOperation({
            query: mutation,
            variables: { productInput: input },
            extensions,
        });

        expect(result.errors).toBeDefined();
        expect(result.errors?.[0].message).toEqual(
            "Product already exists with this data. Please enter different details",
        );

        // Cleaning up
        await prisma.product.delete({
            where: { id: createProduct.id },
        });
    });

    it("should return error for creating product with invalid category id", async () => {
        const input: ProductInput = {
            name: "Test Product",
            status: true,
            image: "",
            category_id: 999999999,
            weight: 800,
            price_per_unit: 10000,
            time: "8 days",
            presentInInventory: 0,
            raw_materials: [
                {
                    raw_material_id: rawMaterials[0].id,
                    quantity: 10,
                },
                {
                    raw_material_id: rawMaterials[1].id,
                    quantity: 10,
                },
            ],
        };

        const mutation = `
            mutation CreateProduct($productInput: ProductInput!) {
                createProduct(productInput: $productInput) {
                    id
                    category_id
                    category {
                        id
                        status
                    }
                    name
                    presentInInventory
                    price_per_unit
                    raw_materials {
                        id
                        quantity
                        raw_material_id
                        product_id
                    }
                    status
                    time
                    weight
                }
            }
        `;

        const result = await server.executeOperation({
            query: mutation,
            variables: { productInput: input },
            extensions,
        });

        expect(result.errors).toBeDefined();
        expect(result.errors?.[0].message).toEqual("Invalid category");
    });
});
