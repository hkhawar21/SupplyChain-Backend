import { OrderCreateInput } from "@generated/type-graphql";
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

@Resolver()
export class OrderResolver {
    @Mutation(() => Order)
    @Authorized()
    async createOrder(
        @Arg("orderCreateInput", () => OrderCreateInput)
        orderCreateInput: OrderCreateInput,
        @Arg("customer_id", () => Int, { nullable: true }) customer_id: number,
    ): Promise<Order> {
        const createdOrder = await prisma.order.create({
            data: {
                ...orderCreateInput,
                customer_id,
            },
        });
        return createdOrder;
    }
}
