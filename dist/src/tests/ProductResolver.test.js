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
describe("Product Resolver", () => {
    let server;
    let categories;
    let rawMaterials;
    beforeAll(async () => {
        const schema = await (0, type_graphql_3.buildSchema)({
            resolvers: [resolvers_1.ProductResolver, type_graphql_1.ProductRelationsResolver],
            validate: false,
            authChecker: AuthChecker_1.authChecker,
        });
        server = new apollo_server_express_1.ApolloServer({
            schema,
            context: { prisma: client_1.default },
        });
        // Clear the database before running the tests
        // await prisma.product.deleteMany({});
        // await prisma.category.deleteMany({});
        // await prisma.rawMaterial.deleteMany({});
        await client_1.default.category.createMany({
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
        await client_1.default.rawMaterial.createMany({
            data: [
                {
                    name: "Test Raw Material 1",
                    status: true,
                    price: 100,
                    presentInInventory: 10000,
                    requested: 0,
                    requestedStatus: type_graphql_2.RawMaterialStatus.APPROVED,
                    inventory_id: 1,
                },
                {
                    name: "Test Raw Material 2",
                    status: true,
                    price: 1000,
                    presentInInventory: 30000,
                    requested: 0,
                    requestedStatus: type_graphql_2.RawMaterialStatus.APPROVED,
                    inventory_id: 1,
                },
                {
                    name: "Test Raw Material 3",
                    status: true,
                    price: 10,
                    presentInInventory: 1000,
                    requested: 0,
                    requestedStatus: type_graphql_2.RawMaterialStatus.APPROVED,
                    inventory_id: 1,
                },
                {
                    name: "Test Raw Material 4",
                    status: false,
                    price: 10000,
                    presentInInventory: 3000,
                    requested: 0,
                    requestedStatus: type_graphql_2.RawMaterialStatus.APPROVED,
                    inventory_id: 1,
                },
            ],
        });
        categories = await client_1.default.category.findMany();
        rawMaterials = await client_1.default.rawMaterial.findMany();
    });
    afterAll(async () => {
        await client_1.default.$disconnect();
    });
    it("should create a new product", async () => {
        const input = {
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
        expect(result.data?.createProduct.category_id).toEqual(input.category_id);
        expect(result.data?.createProduct.category.status).toEqual(true);
        expect(result.data?.createProduct.raw_materials).toBeDefined();
        expect(result.data?.createProduct.raw_materials.length).toEqual(input.raw_materials.length);
        // Cleaning up
        await client_1.default.product.delete({
            where: { id: result.data?.createProduct.id },
        });
    });
    it("should return error for creating duplicate product", async () => {
        // Create a product
        const createProduct = await client_1.default.product.create({
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
        const input = {
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
        expect(result.errors?.[0].message).toEqual("Product already exists with this data. Please enter different details");
        // Cleaning up
        await client_1.default.product.delete({
            where: { id: createProduct.id },
        });
    });
    it("should return error for creating product with invalid category id", async () => {
        const input = {
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
//# sourceMappingURL=ProductResolver.test.js.map