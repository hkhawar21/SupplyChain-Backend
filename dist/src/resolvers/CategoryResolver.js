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
exports.CategoryResolver = exports.CategoryCreateInput = exports.CategoryUpdateInput = void 0;
require("reflect-metadata");
const type_graphql_1 = require("type-graphql");
const apollo_server_express_1 = require("apollo-server-express");
const client_1 = __importDefault(require("../prisma/client"));
const type_graphql_2 = require("@generated/type-graphql");
const role_1 = require("../utils/role");
let CategoryUpdateInput = class CategoryUpdateInput {
};
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.Int),
    __metadata("design:type", Number)
], CategoryUpdateInput.prototype, "id", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => String, { nullable: true }),
    __metadata("design:type", String)
], CategoryUpdateInput.prototype, "name", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => Boolean, { nullable: true }),
    __metadata("design:type", Boolean)
], CategoryUpdateInput.prototype, "status", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => String, { nullable: true }),
    __metadata("design:type", String)
], CategoryUpdateInput.prototype, "image", void 0);
CategoryUpdateInput = __decorate([
    (0, type_graphql_1.InputType)()
], CategoryUpdateInput);
exports.CategoryUpdateInput = CategoryUpdateInput;
let CategoryCreateInput = class CategoryCreateInput {
};
__decorate([
    (0, type_graphql_1.Field)(() => String),
    __metadata("design:type", String)
], CategoryCreateInput.prototype, "name", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => Boolean),
    __metadata("design:type", Boolean)
], CategoryCreateInput.prototype, "status", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => String),
    __metadata("design:type", String)
], CategoryCreateInput.prototype, "image", void 0);
CategoryCreateInput = __decorate([
    (0, type_graphql_1.InputType)()
], CategoryCreateInput);
exports.CategoryCreateInput = CategoryCreateInput;
let CategoryResolver = class CategoryResolver {
    async createCategory(categoryCreateInput, ctx) {
        console.log(ctx);
        if (!(0, role_1.isUserAllowed)(ctx.user.role, [
            type_graphql_2.AccessRole.inventory,
            type_graphql_2.AccessRole.products,
            type_graphql_2.AccessRole.admin,
        ]))
            throw new apollo_server_express_1.UserInputError("Not Authorized");
        try {
            // Restrict adding duplicate category
            const category = await client_1.default.category.findFirst({
                where: {
                    ...categoryCreateInput,
                },
            });
            if (category) {
                throw new apollo_server_express_1.UserInputError("Category already exists with this data. Please enter different details");
            }
            const createdCategory = await client_1.default.category.create({
                data: {
                    ...categoryCreateInput,
                },
            });
            return createdCategory;
        }
        catch (error) {
            throw new Error(error.message);
        }
    }
    async categories(ctx) {
        try {
            return await client_1.default.category.findMany({
                include: {
                    products: true,
                },
            });
        }
        catch (error) {
            throw new Error(error.message);
        }
    }
    async categoryById(id) {
        return await client_1.default.category.findUnique({
            where: { id },
            include: {
                products: true,
            },
        });
    }
    async updateCategory(categoryUpdateInput, ctx) {
        console.log("ROLEEE", ctx);
        if (!(0, role_1.isUserAllowed)(ctx.user.role, [
            type_graphql_2.AccessRole.inventory,
            type_graphql_2.AccessRole.products,
            type_graphql_2.AccessRole.admin,
        ]))
            throw new apollo_server_express_1.UserInputError("Not Authorized");
        const category = await client_1.default.category.findUnique({
            where: { id: categoryUpdateInput.id },
        });
        if (!category)
            throw new apollo_server_express_1.UserInputError("Category does not exists with this data. Please enter different details");
        return await client_1.default.category.update({
            where: { id: categoryUpdateInput.id },
            data: {
                ...categoryUpdateInput,
            },
        });
    }
    async deleteCategory(id, ctx) {
        if (!(0, role_1.isUserAllowed)(ctx.user.role, [
            type_graphql_2.AccessRole.inventory,
            type_graphql_2.AccessRole.products,
            type_graphql_2.AccessRole.admin,
        ]))
            throw new apollo_server_express_1.UserInputError("Not Authorized");
        await client_1.default.category.delete({ where: { id } });
        return true;
    }
};
__decorate([
    (0, type_graphql_1.Mutation)(() => type_graphql_2.Category),
    (0, type_graphql_1.Authorized)(),
    __param(0, (0, type_graphql_1.Arg)("categoryCreateInput", () => CategoryCreateInput)),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CategoryCreateInput, Object]),
    __metadata("design:returntype", Promise)
], CategoryResolver.prototype, "createCategory", null);
__decorate([
    (0, type_graphql_1.Query)(() => [type_graphql_2.Category]),
    (0, type_graphql_1.Authorized)(),
    __param(0, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CategoryResolver.prototype, "categories", null);
__decorate([
    (0, type_graphql_1.Query)(() => type_graphql_2.Category),
    (0, type_graphql_1.Authorized)(),
    __param(0, (0, type_graphql_1.Arg)("id", () => type_graphql_1.Int)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], CategoryResolver.prototype, "categoryById", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => type_graphql_2.Category),
    (0, type_graphql_1.Authorized)(),
    __param(0, (0, type_graphql_1.Arg)("categoryUpdateInput", () => CategoryUpdateInput)),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CategoryUpdateInput, Object]),
    __metadata("design:returntype", Promise)
], CategoryResolver.prototype, "updateCategory", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Boolean),
    (0, type_graphql_1.Authorized)(),
    __param(0, (0, type_graphql_1.Arg)("id", () => type_graphql_1.Int)),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], CategoryResolver.prototype, "deleteCategory", null);
CategoryResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], CategoryResolver);
exports.CategoryResolver = CategoryResolver;
//# sourceMappingURL=CategoryResolver.js.map