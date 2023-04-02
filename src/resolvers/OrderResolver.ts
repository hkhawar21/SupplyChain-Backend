import {
    OrderCreateInput,
    ProductOrderCreateInput,
    ProductOrder,
    OrderUpdateInput,
} from "@generated/type-graphql";
import {
    Arg,
    Authorized,
    Ctx,
    Int,
    Mutation,
    Query,
    Resolver,
} from "type-graphql";
import prisma from "../prisma/client";
import { Order } from "@generated/type-graphql";
import { UserInputError } from "apollo-server-core";

@Resolver()
export class OrderResolver {
    @Mutation(() => Order)
    @Authorized()
    async createOrder(
        @Arg("orderCreateInput", () => OrderCreateInput)
        orderCreateInput: OrderCreateInput,
        @Arg("customer_id", () => Int, { nullable: true }) customer_id: number,
        @Arg("productOrderCreateInput", () => [ProductOrder])
        productOrderCreateInput: ProductOrderCreateInput[],
    ): Promise<Order> {
        const createdOrder = await prisma.order.create({
            data: {
                ...orderCreateInput,
                customer_id,
                products: {
                    create: productOrderCreateInput,
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
        @Arg("id") id: number,
        @Arg("data") data?: OrderUpdateInput,
    ) {
        const order = await prisma.order.update({
            where: {
                id,
            },
            data: {
                ...data,
                products: {
                    ...data?.products,
                },
            },
        });

        return order;
    }

    @Mutation(() => Order)
    @Authorized()
    async addProductToOrder(
        @Arg("id") id: number,
        @Arg("productOrderCreateInput", () => [ProductOrder])
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
    async removeProductFromOrder(@Arg("id") id: number) {
        return await prisma.productOrder.delete({
            where: {
                id,
            },
        });
    }
}
