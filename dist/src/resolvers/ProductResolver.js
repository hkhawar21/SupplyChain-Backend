"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductResolver = exports.ProductInput = exports.ProductRawMaterialsInput = exports.ProductUpdateInput = exports.ProductRawMaterialUpdate = void 0;
const type_graphql_1 = require("type-graphql");
const client_1 = __importDefault(require("../prisma/client"));
const type_graphql_2 = require("@generated/type-graphql");
const apollo_server_express_1 = require("apollo-server-express");
const role_1 = require("../utils/role");
let ProductRawMaterialUpdate = class ProductRawMaterialUpdate {
};
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.Int),
    __metadata("design:type", Number)
], ProductRawMaterialUpdate.prototype, "id", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.Int),
    __metadata("design:type", Number)
], ProductRawMaterialUpdate.prototype, "quantity", void 0);
ProductRawMaterialUpdate = __decorate([
    (0, type_graphql_1.InputType)()
], ProductRawMaterialUpdate);
exports.ProductRawMaterialUpdate = ProductRawMaterialUpdate;
let ProductUpdateInput = class ProductUpdateInput {
};
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.Int),
    __metadata("design:type", Number)
], ProductUpdateInput.prototype, "id", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => String, { nullable: true }),
    __metadata("design:type", String)
], ProductUpdateInput.prototype, "name", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => Boolean, { nullable: true }),
    __metadata("design:type", Boolean)
], ProductUpdateInput.prototype, "status", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => String, { nullable: true }),
    __metadata("design:type", String)
], ProductUpdateInput.prototype, "image", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => Number, { nullable: true }),
    __metadata("design:type", Number)
], ProductUpdateInput.prototype, "weight", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => Number, { nullable: true }),
    __metadata("design:type", Number)
], ProductUpdateInput.prototype, "price_per_unit", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.Int, { nullable: true }),
    __metadata("design:type", Number)
], ProductUpdateInput.prototype, "category_id", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.Int, { nullable: true }),
    __metadata("design:type", Number)
], ProductUpdateInput.prototype, "presentInInventory", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => String, { nullable: true }),
    __metadata("design:type", String)
], ProductUpdateInput.prototype, "time", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => [ProductRawMaterialUpdate], { nullable: true }),
    __metadata("design:type", Array)
], ProductUpdateInput.prototype, "raw_materials", void 0);
ProductUpdateInput = __decorate([
    (0, type_graphql_1.InputType)()
], ProductUpdateInput);
exports.ProductUpdateInput = ProductUpdateInput;
let ProductRawMaterialsInput = class ProductRawMaterialsInput {
};
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.Int),
    __metadata("design:type", Number)
], ProductRawMaterialsInput.prototype, "raw_material_id", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.Int),
    __metadata("design:type", Number)
], ProductRawMaterialsInput.prototype, "quantity", void 0);
ProductRawMaterialsInput = __decorate([
    (0, type_graphql_1.InputType)()
], ProductRawMaterialsInput);
exports.ProductRawMaterialsInput = ProductRawMaterialsInput;
let ProductInput = class ProductInput {
};
__decorate([
    (0, type_graphql_1.Field)(() => String),
    __metadata("design:type", String)
], ProductInput.prototype, "name", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => Boolean),
    __metadata("design:type", Boolean)
], ProductInput.prototype, "status", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => String),
    __metadata("design:type", String)
], ProductInput.prototype, "image", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => Number),
    __metadata("design:type", Number)
], ProductInput.prototype, "weight", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => Number),
    __metadata("design:type", Number)
], ProductInput.prototype, "price_per_unit", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.Int),
    __metadata("design:type", Number)
], ProductInput.prototype, "category_id", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => String),
    __metadata("design:type", String)
], ProductInput.prototype, "time", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => Number),
    __metadata("design:type", Number)
], ProductInput.prototype, "presentInInventory", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => [ProductRawMaterialsInput]),
    __metadata("design:type", Array)
], ProductInput.prototype, "raw_materials", void 0);
ProductInput = __decorate([
    (0, type_graphql_1.InputType)()
], ProductInput);
exports.ProductInput = ProductInput;
// FUNCTIONS PRESENT IN THIS RESOLVER
// 1. createProduct
// 2. products
// 3. productById
// 4. updateProduct
// 5. removeRawMaterialFromProduct
// 6. addRawMaterialToProduct
// 7. deleteProduct
let ProductResolver = class ProductResolver {
    async createProduct(productInput, ctx) {
        if (!(0, role_1.isUserAllowed)(ctx.role, [type_graphql_2.AccessRole.products, type_graphql_2.AccessRole.admin]))
            throw new apollo_server_express_1.UserInputError("Not Authorized");
        try {
            // Restrict adding duplicate product
            const product = await client_1.default.product.findFirst({
                where: {
                    name: productInput.name,
                    status: productInput.status,
                    image: productInput.image,
                    weight: productInput.weight,
                    price_per_unit: productInput.price_per_unit,
                    presentInInventory: productInput.presentInInventory,
                },
            });
            if (product) {
                throw new apollo_server_express_1.UserInputError("Product already exists with this data. Please enter different details");
            }
            // Restric adding product with invalid category
            const category = await client_1.default.category.findFirst({
                where: {
                    id: productInput.category_id,
                },
            });
            if (!category?.status)
                throw new apollo_server_express_1.UserInputError("Invalid category");
            const createdProduct = await client_1.default.product.create({
                data: {
                    name: productInput.name,
                    status: productInput.status,
                    image: productInput.image,
                    weight: productInput.weight,
                    price_per_unit: productInput.price_per_unit,
                    time: productInput.time,
                    presentInInventory: productInput.presentInInventory,
                    category: {
                        connect: {
                            id: productInput.category_id,
                        },
                    },
                    raw_materials: {
                        createMany: {
                            data: productInput.raw_materials.map((item) => ({
                                raw_material_id: item.raw_material_id,
                                quantity: item.quantity,
                            })),
                        },
                    },
                },
                include: {
                    raw_materials: true,
                    category: true,
                },
            });
            return createdProduct;
        }
        catch (error) {
            console.error(error);
            throw new Error(error.message);
        }
    }
    async products() {
        return await client_1.default.product.findMany({
            include: {
                raw_materials: true,
                category: true,
            },
        });
    }
    async productById(id) {
        return await client_1.default.product.findUnique({
            where: { id },
            include: {
                raw_materials: true,
                category: true,
            },
        });
    }
    async updateProduct(productUpdateInput, ctx) {
        if (!(0, role_1.isUserAllowed)(ctx.role, [type_graphql_2.AccessRole.products, type_graphql_2.AccessRole.admin]))
            throw new apollo_server_express_1.UserInputError("Not Authorized");
        const product = await client_1.default.product.findUnique({
            where: { id: productUpdateInput.id },
        });
        if (!product) {
            throw new apollo_server_express_1.UserInputError("Product not found");
        }
        if (productUpdateInput.raw_materials) {
            const updatedProduct = await client_1.default.product.update({
                where: { id: productUpdateInput.id },
                data: {
                    ...productUpdateInput,
                    raw_materials: {
                        updateMany: [
                            ...productUpdateInput?.raw_materials.map((raw_material) => ({
                                where: { id: raw_material.id },
                                data: {
                                    quantity: raw_material.quantity,
                                },
                            })),
                        ],
                    },
                },
                include: {
                    raw_materials: true,
                    category: true,
                },
            });
            return updatedProduct;
        }
        else {
            const updatedProduct = await client_1.default.product.update({
                where: { id: productUpdateInput.id },
                data: {
                    name: productUpdateInput.name,
                    status: productUpdateInput.status,
                    image: productUpdateInput.image,
                    weight: productUpdateInput.weight,
                    price_per_unit: productUpdateInput.price_per_unit,
                    time: productUpdateInput.time,
                    presentInInventory: productUpdateInput.presentInInventory,
                },
                include: {
                    raw_materials: true,
                    category: true,
                },
            });
            return updatedProduct;
        }
    }
    async removeRawMaterialFromProduct(productId, rawMaterialId, ctx) {
        if (!(0, role_1.isUserAllowed)(ctx.role, [type_graphql_2.AccessRole.products, type_graphql_2.AccessRole.admin]))
            throw new apollo_server_express_1.UserInputError("Not Authorized");
        try {
            return await client_1.default.product.update({
                where: { id: productId },
                data: {
                    raw_materials: {
                        disconnect: {
                            id: rawMaterialId,
                        },
                    },
                },
                include: {
                    raw_materials: true,
                    category: true,
                },
            });
        }
        catch (error) {
            throw new Error(error.message);
        }
    }
    async addRawMaterialToProduct(productId, rawMaterialId, quantity, ctx) {
        if (!(0, role_1.isUserAllowed)(ctx.role, [type_graphql_2.AccessRole.products, type_graphql_2.AccessRole.admin]))
            throw new apollo_server_express_1.UserInputError("Not Authorized");
        try {
            await client_1.default.productRawMaterials.create({
                data: {
                    raw_material_id: rawMaterialId,
                    quantity: quantity,
                    product_id: productId,
                },
            });
            return await client_1.default.product.findUnique({
                where: { id: productId },
                include: {
                    raw_materials: true,
                    category: true,
                },
            });
        }
        catch (error) {
            throw new Error(error.message);
        }
    }
    async deleteProduct(id, ctx) {
        if (!(0, role_1.isUserAllowed)(ctx.role, [type_graphql_2.AccessRole.products, type_graphql_2.AccessRole.admin]))
            throw new apollo_server_express_1.UserInputError("Not Authorized");
        try {
            return await client_1.default.product.update({
                where: { id },
                data: {
                    status: false,
                },
            });
        }
        catch (error) {
            throw new Error(error.message);
        }
    }
};
__decorate([
    (0, type_graphql_1.Mutation)(() => type_graphql_2.Product),
    (0, type_graphql_1.Authorized)(),
    __param(0, (0, type_graphql_1.Arg)("productInput", () => ProductInput)),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ProductInput, Object]),
    __metadata("design:returntype", Promise)
], ProductResolver.prototype, "createProduct", null);
__decorate([
    (0, type_graphql_1.Query)(() => [type_graphql_2.Product]),
    (0, type_graphql_1.Authorized)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ProductResolver.prototype, "products", null);
__decorate([
    (0, type_graphql_1.Query)(() => type_graphql_2.Product),
    (0, type_graphql_1.Authorized)(),
    __param(0, (0, type_graphql_1.Arg)("id", () => type_graphql_1.Int)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ProductResolver.prototype, "productById", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => type_graphql_2.Product),
    (0, type_graphql_1.Authorized)(),
    __param(0, (0, type_graphql_1.Arg)("productUpdateInput", () => ProductUpdateInput)),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ProductUpdateInput, Object]),
    __metadata("design:returntype", Promise)
], ProductResolver.prototype, "updateProduct", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => type_graphql_2.Product),
    (0, type_graphql_1.Authorized)(),
    __param(0, (0, type_graphql_1.Arg)("productId", () => type_graphql_1.Int)),
    __param(1, (0, type_graphql_1.Arg)("rawMaterialId", () => type_graphql_1.Int)),
    __param(2, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Object]),
    __metadata("design:returntype", Promise)
], ProductResolver.prototype, "removeRawMaterialFromProduct", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => type_graphql_2.Product),
    (0, type_graphql_1.Authorized)(),
    __param(0, (0, type_graphql_1.Arg)("productId", () => type_graphql_1.Int)),
    __param(1, (0, type_graphql_1.Arg)("rawMaterialId", () => type_graphql_1.Int)),
    __param(2, (0, type_graphql_1.Arg)("quantity", () => type_graphql_1.Int)),
    __param(3, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Number, Object]),
    __metadata("design:returntype", Promise)
], ProductResolver.prototype, "addRawMaterialToProduct", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => type_graphql_2.Product),
    (0, type_graphql_1.Authorized)(),
    __param(0, (0, type_graphql_1.Arg)("id", () => type_graphql_1.Int)),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], ProductResolver.prototype, "deleteProduct", null);
ProductResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], ProductResolver);
exports.ProductResolver = ProductResolver;
//# sourceMappingURL=ProductResolver.js.map