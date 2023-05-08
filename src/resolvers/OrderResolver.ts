import {
    Arg,
    Authorized,
    Ctx,
    Int,
    Mutation,
    Query,
    Resolver,
    InputType,
    Field,
    Float,
} from "type-graphql";
import prisma from "../prisma/client";
import { Order, OrderStatus, AccessRole } from "@generated/type-graphql";
import { UserInputError } from "apollo-server-core";
import { Context } from "../types";
import { isUserAllowed } from "../utils/role";

@InputType()
export class ProductOrderCreateInput {
    @Field(() => Int)
    quantity!: number;

    @Field(() => Float)
    price!: number;

    @Field(() => String)
    name!: string;

    @Field(() => Int)
    product_id!: number;
}

@InputType()
export abstract class OrderCreateInput {
    @Field(() => Int)
    quantity!: number;

    @Field(() => Float)
    amount!: number;

    @Field(() => String)
    address!: string;

    @Field(() => Int, { nullable: true })
    customer_id?: number;

    @Field(() => [ProductOrderCreateInput])
    products!: ProductOrderCreateInput[];
}

@InputType()
export class ProductOrderUpdateInput {
    @Field(() => Int)
    id!: number;

    @Field(() => Int)
    quantity!: number;

    @Field(() => Float)
    price!: number;

    @Field(() => String)
    name!: string;

    @Field(() => Int)
    product_id!: number;

    @Field(() => Int, { nullable: true })
    order_id?: number;
}

@InputType()
export class OrderUpdateInput {
    @Field(() => Int, { nullable: true })
    quantity?: number;

    @Field(() => OrderStatus, { nullable: true })
    status?: OrderStatus;

    @Field(() => Float, { nullable: true })
    amount?: number;

    @Field(() => String, { nullable: true })
    address?: string;

    @Field(() => Int, { nullable: true })
    customer_id?: number;

    @Field(() => [ProductOrderUpdateInput])
    products!: ProductOrderUpdateInput[];
}

type RawMaterialsOrderCheck = {
    raw_material_id: number;
    quantityRequired: number;
};

@Resolver()
export class OrderResolver {
    static async checkRawMaterialAvailability(
        order: OrderCreateInput | OrderUpdateInput,
    ): Promise<boolean> {
        const products = order.products;
        const rawMaterialsOrderCheck: RawMaterialsOrderCheck[] = [];
        let status = true;
        for (const product of products) {
            const rawMaterials = await prisma.productRawMaterials.findMany({
                where: {
                    product_id: product.product_id,
                },
                select: {
                    quantity: true,
                    raw_material_id: true,
                },
            });
            for (const rawMaterial of rawMaterials) {
                const rawMaterialIndex = rawMaterialsOrderCheck.findIndex(
                    (rawMaterialOrderCheck) =>
                        rawMaterialOrderCheck.raw_material_id ===
                        rawMaterial.raw_material_id,
                );
                if (rawMaterialIndex === -1) {
                    rawMaterialsOrderCheck.push({
                        raw_material_id: rawMaterial.raw_material_id,
                        quantityRequired:
                            rawMaterial.quantity * product.quantity,
                    });
                } else {
                    rawMaterialsOrderCheck[rawMaterialIndex].quantityRequired +=
                        rawMaterial.quantity * product.quantity;
                }
            }
        }
        for (const rawMaterial of rawMaterialsOrderCheck) {
            const rawMaterialInventory = await prisma.rawMaterial.findUnique({
                where: {
                    id: rawMaterial.raw_material_id,
                },
                select: {
                    presentInInventory: true,
                },
            });
            if (!rawMaterialInventory)
                throw new UserInputError("Raw material not found");
            if (
                rawMaterialInventory?.presentInInventory <
                rawMaterial.quantityRequired
            ) {
                status = false;
                break;
            } else {
                status = true;
            }
        }
        return status;
    }

    static async createOrder(
        orderCreateInput: OrderCreateInput,
    ): Promise<Order> {
        const orderCanBeCreated =
            await OrderResolver.checkRawMaterialAvailability(orderCreateInput);
        if (!orderCanBeCreated)
            throw new UserInputError("Order cannot be created");

        const createdOrder = await prisma.order.create({
            data: {
                ...orderCreateInput,
                status: OrderStatus.PENDING,
                products: {
                    create: orderCreateInput.products,
                },
            },
        });
        return createdOrder;
    }

    @Mutation(() => Order)
    @Authorized()
    async createOrder(
        @Arg("orderCreateInput", () => OrderCreateInput)
        orderCreateInput: OrderCreateInput,
        @Ctx() ctx: Context,
    ) {
        if (
            !isUserAllowed(ctx.user!.role, [
                AccessRole.orders,
                AccessRole.admin,
            ])
        )
            throw new UserInputError("Not Authorized");
        const orderCanBeCreated =
            await OrderResolver.checkRawMaterialAvailability(orderCreateInput);
        if (!orderCanBeCreated)
            throw new UserInputError("Order cannot be created");

        const createdOrder = await prisma.order.create({
            data: {
                ...orderCreateInput,
                status: OrderStatus.PENDING,
                products: {
                    create: orderCreateInput.products,
                },
            },
        });
        return createdOrder;
    }

    @Query(() => [Order])
    @Authorized()
    async orders() {
        // fetch all orders
        return await prisma.order.findMany();
    }

    @Query(() => Order)
    @Authorized()
    async orderById(@Arg("id", () => Int) id: number) {
        // fetch order by id
        const order = await prisma.order.findUnique({
            where: {
                id,
            },
        });

        if (!order) throw new UserInputError("Order not found");

        return order;
    }

    @Query(() => [Order])
    @Authorized()
    async ordersByCustomerId(@Arg("id", () => Int) id: number) {
        // fetch orders by customer id
        return await prisma.order.findMany({
            where: {
                customer_id: id,
            },
        });
    }

    @Mutation(() => Order)
    @Authorized()
    async updateOrderDetails(
        @Arg("id", () => Int) id: number,
        @Arg("data", () => OrderUpdateInput) data: OrderUpdateInput,
        @Ctx() ctx: Context,
    ) {
        if (
            !isUserAllowed(ctx.user!.role, [
                AccessRole.orders,
                AccessRole.admin,
            ])
        )
            throw new UserInputError("Not Authorized");

        const orderCanBeUpdated =
            await OrderResolver.checkRawMaterialAvailability(data);
        if (!orderCanBeUpdated)
            throw new UserInputError("Order cannot be updated");

        const order = await prisma.order.update({
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

    @Mutation(() => Order)
    @Authorized()
    async addProductToOrder(
        @Arg("id", () => Int) id: number,
        @Arg("productOrderCreateInput", () => [ProductOrderCreateInput])
        productOrderCreateInput: ProductOrderCreateInput[],
        @Ctx() ctx: Context,
    ) {
        if (
            !isUserAllowed(ctx.user!.role, [
                AccessRole.orders,
                AccessRole.admin,
            ])
        )
            throw new UserInputError("Not Authorized");

        const order = await prisma.order.update({
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

    @Mutation(() => Order)
    @Authorized()
    async removeProductFromOrder(
        @Arg("id", () => Int) id: number,
        @Ctx() ctx: Context,
    ) {
        if (
            !isUserAllowed(ctx.user!.role, [
                AccessRole.orders,
                AccessRole.admin,
            ])
        )
            throw new UserInputError("Not Authorized");
        return await prisma.productOrder.delete({
            where: {
                id,
            },
        });
    }

    @Mutation(() => Order)
    @Authorized()
    async updateStatus(
        @Arg("id", () => Int) id: number,
        @Arg("status", () => Int) status: OrderStatus,
        @Ctx() ctx: Context,
    ) {
        if (
            !isUserAllowed(ctx.user!.role, [
                AccessRole.orders,
                AccessRole.admin,
            ])
        )
            throw new UserInputError("Not Authorized");
        try {
            const order = prisma.order.update({
                where: {
                    id,
                },
                data: {
                    status,
                },
            });
            return order;
        } catch (error) {
            throw new UserInputError("Order not found");
        }
    }

    @Mutation(() => Order)
    @Authorized()
    async deleteOrder(@Arg("id", () => Int) id: number, @Ctx() ctx: Context) {
        if (
            !isUserAllowed(ctx.user!.role, [
                AccessRole.orders,
                AccessRole.admin,
            ])
        )
            throw new UserInputError("Not Authorized");
        try {
            const order = prisma.order.update({
                where: {
                    id,
                },
                data: {
                    status: OrderStatus.CANCELLED,
                },
            });
            return order;
        } catch (error) {
            throw new UserInputError("Order not found");
        }
    }
}
