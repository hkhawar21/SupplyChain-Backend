import {
    OrderCreateInput,
    ProductOrderCreateInput,
    ProductOrder,
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
}
