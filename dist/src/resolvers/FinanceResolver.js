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
exports.FinanceResolver = void 0;
const type_graphql_1 = require("type-graphql");
const client_1 = __importDefault(require("../prisma/client"));
const apollo_server_core_1 = require("apollo-server-core");
const type_graphql_2 = require("@generated/type-graphql");
const role_1 = require("../utils/role");
let FinanceResolver = class FinanceResolver {
    async approveRawmaterialRequest(id, quantity, ctx) {
        if (!(0, role_1.isUserAllowed)(ctx.role, [type_graphql_2.AccessRole.finance, type_graphql_2.AccessRole.admin]))
            throw new apollo_server_core_1.UserInputError("Not Authorized");
        try {
            // If existing raw materials request is present, then provide the updated value
            const rawMaterial = await client_1.default.rawMaterial.update({
                where: {
                    id,
                },
                data: {
                    requested: quantity,
                    requestedStatus: type_graphql_2.RawMaterialStatus.WAITING,
                },
            });
            return rawMaterial;
        }
        catch (error) {
            throw new apollo_server_core_1.UserInputError(error);
        }
    }
    async rejectRawmaterialRequest(id, ctx) {
        if (!(0, role_1.isUserAllowed)(ctx.role, [type_graphql_2.AccessRole.finance, type_graphql_2.AccessRole.admin]))
            throw new apollo_server_core_1.UserInputError("Not Authorized");
        try {
            // If existing raw materials request is present, then provide the updated value
            const rawMaterial = await client_1.default.rawMaterial.update({
                where: {
                    id,
                },
                data: {
                    requested: 0,
                    requestedStatus: type_graphql_2.RawMaterialStatus.REJECTED,
                },
            });
            return rawMaterial;
        }
        catch (error) {
            throw new apollo_server_core_1.UserInputError(error);
        }
    }
};
__decorate([
    (0, type_graphql_1.Mutation)(() => type_graphql_2.RawMaterial),
    (0, type_graphql_1.Authorized)(),
    __param(0, (0, type_graphql_1.Arg)("id", () => type_graphql_1.Int)),
    __param(1, (0, type_graphql_1.Arg)("quantity", () => type_graphql_1.Int)),
    __param(2, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Object]),
    __metadata("design:returntype", Promise)
], FinanceResolver.prototype, "approveRawmaterialRequest", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => type_graphql_2.RawMaterial),
    (0, type_graphql_1.Authorized)(),
    __param(0, (0, type_graphql_1.Arg)("id", () => type_graphql_1.Int)),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], FinanceResolver.prototype, "rejectRawmaterialRequest", null);
FinanceResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], FinanceResolver);
exports.FinanceResolver = FinanceResolver;
//# sourceMappingURL=FinanceResolver.js.map