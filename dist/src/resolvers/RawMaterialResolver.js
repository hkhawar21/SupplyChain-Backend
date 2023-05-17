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
exports.RawMaterialResolver = exports.RawMaterialRequestInput = exports.RawMaterialInput = exports.RawMaterialUpdateInput = void 0;
const type_graphql_1 = require("type-graphql");
const client_1 = __importDefault(require("../prisma/client"));
const apollo_server_core_1 = require("apollo-server-core");
const type_graphql_2 = require("@generated/type-graphql");
const role_1 = require("../utils/role");
let RawMaterialUpdateInput = class RawMaterialUpdateInput {
};
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.Int),
    __metadata("design:type", Number)
], RawMaterialUpdateInput.prototype, "id", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => String, { nullable: true }),
    __metadata("design:type", String)
], RawMaterialUpdateInput.prototype, "name", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => Boolean, { nullable: true }),
    __metadata("design:type", Boolean)
], RawMaterialUpdateInput.prototype, "status", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.Float, { nullable: true }),
    __metadata("design:type", Number)
], RawMaterialUpdateInput.prototype, "price", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.Int, { nullable: true }),
    __metadata("design:type", Number)
], RawMaterialUpdateInput.prototype, "presentInInventory", void 0);
RawMaterialUpdateInput = __decorate([
    (0, type_graphql_1.InputType)()
], RawMaterialUpdateInput);
exports.RawMaterialUpdateInput = RawMaterialUpdateInput;
let RawMaterialInput = class RawMaterialInput {
};
__decorate([
    (0, type_graphql_1.Field)(() => String),
    __metadata("design:type", String)
], RawMaterialInput.prototype, "name", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.Float),
    __metadata("design:type", Number)
], RawMaterialInput.prototype, "price", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => Boolean),
    __metadata("design:type", Boolean)
], RawMaterialInput.prototype, "status", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => Number),
    __metadata("design:type", Number)
], RawMaterialInput.prototype, "presentInInventory", void 0);
RawMaterialInput = __decorate([
    (0, type_graphql_1.InputType)()
], RawMaterialInput);
exports.RawMaterialInput = RawMaterialInput;
let RawMaterialRequestInput = class RawMaterialRequestInput {
};
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.Int),
    __metadata("design:type", Number)
], RawMaterialRequestInput.prototype, "quantity", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.Int),
    __metadata("design:type", Number)
], RawMaterialRequestInput.prototype, "id", void 0);
RawMaterialRequestInput = __decorate([
    (0, type_graphql_1.InputType)()
], RawMaterialRequestInput);
exports.RawMaterialRequestInput = RawMaterialRequestInput;
let RawMaterialResolver = class RawMaterialResolver {
    // Implementing all the functionalitites commented above
    // CREATE RAW MATERIAL REQUEST
    async createRawMaterialRequest(rawMaterialRequestInput, ctx) {
        if (!(0, role_1.isUserAllowed)(ctx.user.role, [
            type_graphql_2.AccessRole.inventory,
            type_graphql_2.AccessRole.admin,
            type_graphql_2.AccessRole.products,
        ]))
            throw new apollo_server_core_1.UserInputError("Not Authorized");
        try {
            return await client_1.default.rawMaterial.update({
                where: { id: rawMaterialRequestInput.id },
                data: {
                    requested: rawMaterialRequestInput.quantity,
                    requestedStatus: type_graphql_2.RawMaterialStatus.PENDING,
                },
            });
        }
        catch (error) {
            throw new apollo_server_core_1.UserInputError(error);
        }
    }
    // RETURN RAW MATERIAL REQUESTED
    async rawMaterialRequested() {
        try {
            return await client_1.default.rawMaterial.findMany({
                where: {
                    requestedStatus: type_graphql_2.RawMaterialStatus.PENDING,
                },
            });
        }
        catch (error) {
            throw new apollo_server_core_1.UserInputError(error);
        }
    }
    // ALL RAW MATERIALS
    async rawMaterial() {
        try {
            return await client_1.default.rawMaterial.findMany();
        }
        catch (error) {
            throw new apollo_server_core_1.UserInputError(error);
        }
    }
    // UPDATE STATUS OF RAW MATERIAL REQUESTED
    async changeStatusRawMaterial(id, status, ctx) {
        if (!(0, role_1.isUserAllowed)(ctx.user.role, [
            type_graphql_2.AccessRole.inventory,
            type_graphql_2.AccessRole.admin,
            type_graphql_2.AccessRole.products,
        ]))
            throw new apollo_server_core_1.UserInputError("Not Authorized");
        try {
            const rawMaterial = await client_1.default.rawMaterial.findFirst({
                where: {
                    id,
                },
            });
            return await client_1.default.rawMaterial.update({
                where: { id },
                data: {
                    requestedStatus: status,
                    presentInInventory: {
                        increment: status === type_graphql_2.RawMaterialStatus.APPROVED
                            ? rawMaterial?.requested
                            : 0,
                    },
                    requested: 0,
                },
            });
        }
        catch (error) {
            throw new apollo_server_core_1.UserInputError(error);
        }
    }
    // CREATE RAW MATERIAL
    async createRawMaterial(rawMaterialInput, ctx) {
        if (!(0, role_1.isUserAllowed)(ctx.user.role, [
            type_graphql_2.AccessRole.inventory,
            type_graphql_2.AccessRole.admin,
            type_graphql_2.AccessRole.products,
        ]))
            throw new apollo_server_core_1.UserInputError("Not Authorized");
        try {
            const rawMaterial = await client_1.default.rawMaterial.findFirst({
                where: {
                    ...rawMaterialInput,
                },
            });
            if (rawMaterial)
                throw new apollo_server_core_1.UserInputError("Raw Material already exists");
            return await client_1.default.rawMaterial.create({
                data: {
                    ...rawMaterialInput,
                    requested: 0,
                    requestedStatus: type_graphql_2.RawMaterialStatus.PENDING,
                    inventory_id: 1,
                    presentInInventory: rawMaterialInput.presentInInventory,
                },
            });
        }
        catch (error) {
            throw new apollo_server_core_1.UserInputError(error);
        }
    }
    // UPDATE RAW MATERIAL
    async updateRawMaterial(rawMaterialInput, ctx) {
        if (!(0, role_1.isUserAllowed)(ctx.user.role, [
            type_graphql_2.AccessRole.inventory,
            type_graphql_2.AccessRole.admin,
            type_graphql_2.AccessRole.products,
        ]))
            throw new apollo_server_core_1.UserInputError("Not Authorized");
        try {
            return await client_1.default.rawMaterial.update({
                where: { id: rawMaterialInput.id },
                data: rawMaterialInput,
            });
        }
        catch (error) {
            throw new apollo_server_core_1.UserInputError(error);
        }
    }
    // DELETE RAW MATERIAL
    async deleteRawMaterial(id, ctx) {
        if (!(0, role_1.isUserAllowed)(ctx.user.role, [
            type_graphql_2.AccessRole.inventory,
            type_graphql_2.AccessRole.admin,
            type_graphql_2.AccessRole.products,
        ]))
            throw new apollo_server_core_1.UserInputError("Not Authorized");
        try {
            return await client_1.default.rawMaterial.update({
                where: { id },
                data: {
                    status: false,
                },
            });
        }
        catch (error) {
            throw new apollo_server_core_1.UserInputError(error);
        }
    }
};
__decorate([
    (0, type_graphql_1.Mutation)(() => type_graphql_2.RawMaterial),
    (0, type_graphql_1.Authorized)(),
    __param(0, (0, type_graphql_1.Arg)("rawMaterialRequestInput", () => RawMaterialRequestInput)),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [RawMaterialRequestInput, Object]),
    __metadata("design:returntype", Promise)
], RawMaterialResolver.prototype, "createRawMaterialRequest", null);
__decorate([
    (0, type_graphql_1.Query)(() => [type_graphql_2.RawMaterial]),
    (0, type_graphql_1.Authorized)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], RawMaterialResolver.prototype, "rawMaterialRequested", null);
__decorate([
    (0, type_graphql_1.Query)(() => [type_graphql_2.RawMaterial]),
    (0, type_graphql_1.Authorized)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], RawMaterialResolver.prototype, "rawMaterial", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => type_graphql_2.RawMaterial),
    (0, type_graphql_1.Authorized)(),
    __param(0, (0, type_graphql_1.Arg)("id", () => type_graphql_1.Int)),
    __param(1, (0, type_graphql_1.Arg)("status", () => type_graphql_2.RawMaterialStatus)),
    __param(2, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, Object]),
    __metadata("design:returntype", Promise)
], RawMaterialResolver.prototype, "changeStatusRawMaterial", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => type_graphql_2.RawMaterial),
    (0, type_graphql_1.Authorized)(),
    __param(0, (0, type_graphql_1.Arg)("rawMaterialInput", () => RawMaterialInput)),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [RawMaterialInput, Object]),
    __metadata("design:returntype", Promise)
], RawMaterialResolver.prototype, "createRawMaterial", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => type_graphql_2.RawMaterial),
    (0, type_graphql_1.Authorized)(),
    __param(0, (0, type_graphql_1.Arg)("rawMaterialInput", () => RawMaterialUpdateInput)),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [RawMaterialUpdateInput, Object]),
    __metadata("design:returntype", Promise)
], RawMaterialResolver.prototype, "updateRawMaterial", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => type_graphql_2.RawMaterial),
    (0, type_graphql_1.Authorized)(),
    __param(0, (0, type_graphql_1.Arg)("id", () => type_graphql_1.Int)),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], RawMaterialResolver.prototype, "deleteRawMaterial", null);
RawMaterialResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], RawMaterialResolver);
exports.RawMaterialResolver = RawMaterialResolver;
//# sourceMappingURL=RawMaterialResolver.js.map