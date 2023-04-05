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
import { Order, OrderStatus } from "@generated/type-graphql";
import { UserInputError } from "apollo-server-core";

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
export class OrderCreateInput {
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

@Resolver()
export class OrderResolver {
    static createOrder(orderCreateInput: OrderCreateInput): Promise<Order> {
        throw new Error("Method not implemented.");
    }
    @Mutation(() => Order)
    @Authorized()
    async createOrder(
        @Arg("orderCreateInput", () => OrderCreateInput)
        orderCreateInput: OrderCreateInput,
    ) {
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
    ) {
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
    ) {
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
    async removeProductFromOrder(@Arg("id", () => Int) id: number) {
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
    ) {
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
    async deleteOrder(@Arg("id", () => Int) id: number) {
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
