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
exports.InventoryResolver = void 0;
const type_graphql_1 = require("type-graphql");
const client_1 = __importDefault(require("../prisma/client"));
const apollo_server_core_1 = require("apollo-server-core");
const OrderResolver_1 = require("./OrderResolver");
const type_graphql_2 = require("@generated/type-graphql");
const role_1 = require("../utils/role");
// Inventory Resolver will provide the following functionalities:
// 1. Create Order Request
// 2. Approval of order
// 3. Show Orders requested and pending
// 4. Show all the products present in inventory with their respective quantity
// 5. Change status of products from pending to approved or vice versa
// 6. Show all the raw materials available in inventory with their respective quantity
let OrderCreateInputInventory = class OrderCreateInputInventory extends OrderResolver_1.OrderCreateInput {
};
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_2.OrderStatus),
    __metadata("design:type", String)
], OrderCreateInputInventory.prototype, "status", void 0);
OrderCreateInputInventory = __decorate([
    (0, type_graphql_1.InputType)()
], OrderCreateInputInventory);
let InventoryResolver = class InventoryResolver {
    // Implementing all the functionalitites commented above
    async createInventory(ctx) {
        if (!(0, role_1.isUserAllowed)(ctx.user.role, [
            type_graphql_2.AccessRole.inventory,
            type_graphql_2.AccessRole.admin,
        ]))
            throw new apollo_server_core_1.UserInputError("Not Authorized");
        try {
            const inventory = await client_1.default.inventory.create({
                data: {},
            });
            return inventory;
        }
        catch (error) {
            throw new apollo_server_core_1.UserInputError(error);
        }
    }
    async inventories() {
        try {
            return await client_1.default.inventory.findMany();
        }
        catch (error) {
            throw new apollo_server_core_1.UserInputError(error);
        }
    }
    async createOrderRequest(orderCreateInput, ctx) {
        if (!(0, role_1.isUserAllowed)(ctx.user.role, [
            type_graphql_2.AccessRole.inventory,
            type_graphql_2.AccessRole.admin,
        ]))
            throw new apollo_server_core_1.UserInputError("Not Authorized");
        try {
            const orderCanBeCreated = await OrderResolver_1.OrderResolver.checkRawMaterialAvailability(orderCreateInput);
            if (!orderCanBeCreated)
                throw new apollo_server_core_1.UserInputError("Order cannot be created");
            const createdOrder = await OrderResolver_1.OrderResolver.createOrder(orderCreateInput);
            const updatedOrder = await client_1.default.order.update({
                where: { id: createdOrder.id },
                data: {
                    status: orderCreateInput.status,
                },
            });
            return updatedOrder;
        }
        catch (error) {
            throw new apollo_server_core_1.UserInputError(error);
        }
    }
    async approveOrderRequest(orderId, ctx) {
        if (!(0, role_1.isUserAllowed)(ctx.user.role, [
            type_graphql_2.AccessRole.inventory,
            type_graphql_2.AccessRole.admin,
        ]))
            throw new apollo_server_core_1.UserInputError("Not Authorized");
        try {
            const updatedOrder = await client_1.default.order.update({
                where: { id: orderId },
                data: {
                    status: type_graphql_2.OrderStatus.PROCESSING,
                },
            });
            return updatedOrder;
        }
        catch (error) {
            throw new apollo_server_core_1.UserInputError(error);
        }
    }
    async ordersRequested() {
        try {
            const orders = await client_1.default.order.findMany();
            return orders;
        }
        catch (error) {
            throw new apollo_server_core_1.UserInputError(error);
        }
    }
    async productsInInventory() {
        try {
            const products = await client_1.default.product.findMany();
            return products;
        }
        catch (error) {
            throw new apollo_server_core_1.UserInputError(error);
        }
    }
    async rawMaterialsInInventory() {
        try {
            const rawMaterials = await client_1.default.rawMaterial.findMany({
                where: {
                    presentInInventory: { gt: 0 },
                },
            });
            return rawMaterials;
        }
        catch (error) {
            throw new apollo_server_core_1.UserInputError(error);
        }
    }
};
__decorate([
    (0, type_graphql_1.Mutation)(() => type_graphql_2.Inventory),
    (0, type_graphql_1.Authorized)(),
    __param(0, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], InventoryResolver.prototype, "createInventory", null);
__decorate([
    (0, type_graphql_1.Query)(() => [type_graphql_2.Inventory]),
    (0, type_graphql_1.Authorized)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], InventoryResolver.prototype, "inventories", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => type_graphql_2.Order),
    (0, type_graphql_1.Authorized)(),
    __param(0, (0, type_graphql_1.Arg)("orderCreateInput", () => OrderCreateInputInventory)),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [OrderCreateInputInventory, Object]),
    __metadata("design:returntype", Promise)
], InventoryResolver.prototype, "createOrderRequest", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => type_graphql_2.Order),
    (0, type_graphql_1.Authorized)(),
    __param(0, (0, type_graphql_1.Arg)("orderId", () => type_graphql_1.Int)),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], InventoryResolver.prototype, "approveOrderRequest", null);
__decorate([
    (0, type_graphql_1.Query)(() => [type_graphql_2.Order]),
    (0, type_graphql_1.Authorized)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], InventoryResolver.prototype, "ordersRequested", null);
__decorate([
    (0, type_graphql_1.Query)(() => [type_graphql_2.Product]),
    (0, type_graphql_1.Authorized)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], InventoryResolver.prototype, "productsInInventory", null);
__decorate([
    (0, type_graphql_1.Query)(() => [type_graphql_2.RawMaterial]),
    (0, type_graphql_1.Authorized)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], InventoryResolver.prototype, "rawMaterialsInInventory", null);
InventoryResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], InventoryResolver);
exports.InventoryResolver = InventoryResolver;
//# sourceMappingURL=InventoryResolver.js.map