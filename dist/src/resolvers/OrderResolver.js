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
var OrderResolver_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderResolver = exports.OrderUpdateInput = exports.ProductOrderUpdateInput = exports.OrderCreateInput = exports.ProductOrderCreateInput = void 0;
const type_graphql_1 = require("type-graphql");
const client_1 = __importDefault(require("../prisma/client"));
const type_graphql_2 = require("@generated/type-graphql");
const apollo_server_core_1 = require("apollo-server-core");
const role_1 = require("../utils/role");
const order_1 = require("../utils/order");
let ProductOrderCreateInput = class ProductOrderCreateInput {
};
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.Int),
    __metadata("design:type", Number)
], ProductOrderCreateInput.prototype, "quantity", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.Float),
    __metadata("design:type", Number)
], ProductOrderCreateInput.prototype, "price", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => String),
    __metadata("design:type", String)
], ProductOrderCreateInput.prototype, "name", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.Int),
    __metadata("design:type", Number)
], ProductOrderCreateInput.prototype, "product_id", void 0);
ProductOrderCreateInput = __decorate([
    (0, type_graphql_1.InputType)()
], ProductOrderCreateInput);
exports.ProductOrderCreateInput = ProductOrderCreateInput;
let OrderCreateInput = class OrderCreateInput {
};
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.Int),
    __metadata("design:type", Number)
], OrderCreateInput.prototype, "quantity", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.Float),
    __metadata("design:type", Number)
], OrderCreateInput.prototype, "amount", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => String),
    __metadata("design:type", String)
], OrderCreateInput.prototype, "address", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.Int, { nullable: true }),
    __metadata("design:type", Number)
], OrderCreateInput.prototype, "customer_id", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => [ProductOrderCreateInput]),
    __metadata("design:type", Array)
], OrderCreateInput.prototype, "products", void 0);
OrderCreateInput = __decorate([
    (0, type_graphql_1.InputType)()
], OrderCreateInput);
exports.OrderCreateInput = OrderCreateInput;
let ProductOrderUpdateInput = class ProductOrderUpdateInput {
};
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.Int),
    __metadata("design:type", Number)
], ProductOrderUpdateInput.prototype, "id", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.Int),
    __metadata("design:type", Number)
], ProductOrderUpdateInput.prototype, "quantity", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.Float),
    __metadata("design:type", Number)
], ProductOrderUpdateInput.prototype, "price", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => String),
    __metadata("design:type", String)
], ProductOrderUpdateInput.prototype, "name", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.Int),
    __metadata("design:type", Number)
], ProductOrderUpdateInput.prototype, "product_id", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.Int, { nullable: true }),
    __metadata("design:type", Number)
], ProductOrderUpdateInput.prototype, "order_id", void 0);
ProductOrderUpdateInput = __decorate([
    (0, type_graphql_1.InputType)()
], ProductOrderUpdateInput);
exports.ProductOrderUpdateInput = ProductOrderUpdateInput;
let OrderUpdateInput = class OrderUpdateInput {
};
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.Int, { nullable: true }),
    __metadata("design:type", Number)
], OrderUpdateInput.prototype, "quantity", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_2.OrderStatus, { nullable: true }),
    __metadata("design:type", String)
], OrderUpdateInput.prototype, "status", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.Float, { nullable: true }),
    __metadata("design:type", Number)
], OrderUpdateInput.prototype, "amount", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => String, { nullable: true }),
    __metadata("design:type", String)
], OrderUpdateInput.prototype, "address", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.Int, { nullable: true }),
    __metadata("design:type", Number)
], OrderUpdateInput.prototype, "customer_id", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => [ProductOrderUpdateInput]),
    __metadata("design:type", Array)
], OrderUpdateInput.prototype, "products", void 0);
OrderUpdateInput = __decorate([
    (0, type_graphql_1.InputType)()
], OrderUpdateInput);
exports.OrderUpdateInput = OrderUpdateInput;
let OrderResolver = OrderResolver_1 = class OrderResolver {
    static async checkRawMaterialAvailability(order) {
        const products = order.products;
        const rawMaterialsOrderCheck = [];
        let status = true;
        for (const product of products) {
            const rawMaterials = await client_1.default.productRawMaterials.findMany({
                where: {
                    product_id: product.product_id,
                },
                select: {
                    quantity: true,
                    raw_material_id: true,
                },
            });
            for (const rawMaterial of rawMaterials) {
                const rawMaterialIndex = rawMaterialsOrderCheck.findIndex((rawMaterialOrderCheck) => rawMaterialOrderCheck.raw_material_id ===
                    rawMaterial.raw_material_id);
                if (rawMaterialIndex === -1) {
                    rawMaterialsOrderCheck.push({
                        raw_material_id: rawMaterial.raw_material_id,
                        quantityRequired: rawMaterial.quantity * product.quantity,
                    });
                }
                else {
                    rawMaterialsOrderCheck[rawMaterialIndex].quantityRequired +=
                        rawMaterial.quantity * product.quantity;
                }
            }
        }
        for (const rawMaterial of rawMaterialsOrderCheck) {
            const rawMaterialInventory = await client_1.default.rawMaterial.findUnique({
                where: {
                    id: rawMaterial.raw_material_id,
                },
                select: {
                    presentInInventory: true,
                },
            });
            if (!rawMaterialInventory)
                throw new apollo_server_core_1.UserInputError("Raw material not found");
            if (rawMaterialInventory?.presentInInventory <
                rawMaterial.quantityRequired) {
                status = false;
                break;
            }
            else {
                status = true;
            }
        }
        return status;
    }
    static async createOrder(orderCreateInput) {
        const orderCanBeCreated = await OrderResolver_1.checkRawMaterialAvailability(orderCreateInput);
        if (!orderCanBeCreated)
            throw new apollo_server_core_1.UserInputError("Order cannot be created");
        const createdOrder = await client_1.default.order.create({
            data: {
                ...orderCreateInput,
                status: type_graphql_2.OrderStatus.PENDING,
                products: {
                    create: orderCreateInput.products,
                },
            },
        });
        return createdOrder;
    }
    async createOrder(orderCreateInput, ctx) {
        if (!(0, role_1.isUserAllowed)(ctx.user.role, [type_graphql_2.AccessRole.orders, type_graphql_2.AccessRole.admin]))
            throw new apollo_server_core_1.UserInputError("Not Authorized");
        const orderCanBeCreated = await OrderResolver_1.checkRawMaterialAvailability(orderCreateInput);
        if (!orderCanBeCreated)
            throw new apollo_server_core_1.UserInputError("Order cannot be created");
        const createdOrder = await client_1.default.order.create({
            data: {
                ...orderCreateInput,
                status: type_graphql_2.OrderStatus.PENDING,
                products: {
                    create: orderCreateInput.products,
                },
            },
        });
        return createdOrder;
    }
    async orders() {
        // fetch all orders
        return await client_1.default.order.findMany();
    }
    async orderById(id) {
        // fetch order by id
        const order = await client_1.default.order.findUnique({
            where: {
                id,
            },
        });
        if (!order)
            throw new apollo_server_core_1.UserInputError("Order not found");
        return order;
    }
    async ordersByCustomerId(id) {
        // fetch orders by customer id
        return await client_1.default.order.findMany({
            where: {
                customer_id: id,
            },
        });
    }
    async updateOrderDetails(id, data, ctx) {
        if (!(0, role_1.isUserAllowed)(ctx.user.role, [type_graphql_2.AccessRole.orders, type_graphql_2.AccessRole.admin]))
            throw new apollo_server_core_1.UserInputError("Not Authorized");
        const orderCanBeUpdated = await OrderResolver_1.checkRawMaterialAvailability(data);
        if (!orderCanBeUpdated)
            throw new apollo_server_core_1.UserInputError("Order cannot be updated");
        const order = await client_1.default.order.update({
            where: {
                id,
            },
            data: {
                ...data,
                products: {
                    deleteMany: {
                        id: {
                            in: data?.products?.map((product) => product?.id),
                        },
                    },
                    createMany: {
                        data: data.products,
                    },
                },
            },
        });
        return order;
    }
    async addProductToOrder(id, productOrderCreateInput, ctx) {
        if (!(0, role_1.isUserAllowed)(ctx.user.role, [type_graphql_2.AccessRole.orders, type_graphql_2.AccessRole.admin]))
            throw new apollo_server_core_1.UserInputError("Not Authorized");
        const order = await client_1.default.order.update({
            where: {
                id,
            },
            data: {
                products: {
                    create: productOrderCreateInput,
                },
            },
        });
        return order;
    }
    async removeProductFromOrder(id, ctx) {
        if (!(0, role_1.isUserAllowed)(ctx.user.role, [type_graphql_2.AccessRole.orders, type_graphql_2.AccessRole.admin]))
            throw new apollo_server_core_1.UserInputError("Not Authorized");
        return await client_1.default.productOrder.delete({
            where: {
                id,
            },
        });
    }
    async updateStatus(id, status, ctx) {
        if (!(0, role_1.isUserAllowed)(ctx.user.role, [type_graphql_2.AccessRole.orders, type_graphql_2.AccessRole.admin]))
            throw new apollo_server_core_1.UserInputError("Not Authorized");
        try {
            const existingOrder = await client_1.default.order.findFirst({
                where: {
                    id,
                },
            });
            const order = await client_1.default.order.update({
                where: {
                    id,
                },
                data: {
                    status,
                },
            });
            if (existingOrder?.status === type_graphql_2.OrderStatus.PENDING &&
                status === type_graphql_2.OrderStatus.PROCESSING) {
                const status = (0, order_1.deductRawMaterialsFromInventory)(order.id);
                if (!status)
                    throw new apollo_server_core_1.UserInputError("Order cannot be processed");
            }
            return order;
        }
        catch (error) {
            throw new apollo_server_core_1.UserInputError("Order not found");
        }
    }
    async deleteOrder(id, ctx) {
        if (!(0, role_1.isUserAllowed)(ctx.user.role, [type_graphql_2.AccessRole.orders, type_graphql_2.AccessRole.admin]))
            throw new apollo_server_core_1.UserInputError("Not Authorized");
        try {
            const order = client_1.default.order.update({
                where: {
                    id,
                },
                data: {
                    status: type_graphql_2.OrderStatus.CANCELLED,
                },
            });
            return order;
        }
        catch (error) {
            throw new apollo_server_core_1.UserInputError("Order not found");
        }
    }
};
__decorate([
    (0, type_graphql_1.Mutation)(() => type_graphql_2.Order),
    (0, type_graphql_1.Authorized)(),
    __param(0, (0, type_graphql_1.Arg)("orderCreateInput", () => OrderCreateInput)),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [OrderCreateInput, Object]),
    __metadata("design:returntype", Promise)
], OrderResolver.prototype, "createOrder", null);
__decorate([
    (0, type_graphql_1.Query)(() => [type_graphql_2.Order]),
    (0, type_graphql_1.Authorized)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], OrderResolver.prototype, "orders", null);
__decorate([
    (0, type_graphql_1.Query)(() => type_graphql_2.Order),
    (0, type_graphql_1.Authorized)(),
    __param(0, (0, type_graphql_1.Arg)("id", () => type_graphql_1.Int)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], OrderResolver.prototype, "orderById", null);
__decorate([
    (0, type_graphql_1.Query)(() => [type_graphql_2.Order]),
    (0, type_graphql_1.Authorized)(),
    __param(0, (0, type_graphql_1.Arg)("id", () => type_graphql_1.Int)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], OrderResolver.prototype, "ordersByCustomerId", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => type_graphql_2.Order),
    (0, type_graphql_1.Authorized)(),
    __param(0, (0, type_graphql_1.Arg)("id", () => type_graphql_1.Int)),
    __param(1, (0, type_graphql_1.Arg)("data", () => OrderUpdateInput)),
    __param(2, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, OrderUpdateInput, Object]),
    __metadata("design:returntype", Promise)
], OrderResolver.prototype, "updateOrderDetails", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => type_graphql_2.Order),
    (0, type_graphql_1.Authorized)(),
    __param(0, (0, type_graphql_1.Arg)("id", () => type_graphql_1.Int)),
    __param(1, (0, type_graphql_1.Arg)("productOrderCreateInput", () => [ProductOrderCreateInput])),
    __param(2, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Array, Object]),
    __metadata("design:returntype", Promise)
], OrderResolver.prototype, "addProductToOrder", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => type_graphql_2.Order),
    (0, type_graphql_1.Authorized)(),
    __param(0, (0, type_graphql_1.Arg)("id", () => type_graphql_1.Int)),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], OrderResolver.prototype, "removeProductFromOrder", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => type_graphql_2.Order),
    (0, type_graphql_1.Authorized)(),
    __param(0, (0, type_graphql_1.Arg)("id", () => type_graphql_1.Int)),
    __param(1, (0, type_graphql_1.Arg)("status", () => String)),
    __param(2, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, Object]),
    __metadata("design:returntype", Promise)
], OrderResolver.prototype, "updateStatus", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => type_graphql_2.Order),
    (0, type_graphql_1.Authorized)(),
    __param(0, (0, type_graphql_1.Arg)("id", () => type_graphql_1.Int)),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], OrderResolver.prototype, "deleteOrder", null);
OrderResolver = OrderResolver_1 = __decorate([
    (0, type_graphql_1.Resolver)()
], OrderResolver);
exports.OrderResolver = OrderResolver;
//# sourceMappingURL=OrderResolver.js.map