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
import { Inventory } from "@generated/type-graphql";
import { UserInputError } from "apollo-server-core";
import { OrderResolver, ProductOrderCreateInput } from "./OrderResolver";
import { Order, OrderStatus } from "@generated/type-graphql";

// Inventory Resolver will provide the following functionalities:
// 1. Create Order Request
// 2. Update Order Request
// 3. Show Orders requested and pending
// 4. Show all the products present in inventory with their respective quantity
// 5. Change status of products from pending to approved or vice versa
// 6. Show all the raw materials available in inventory with their respective quantity
// 7. Create requests for raw materials which is then to be approved by the finance admin

@InputType()
class OrderCreateInput {
    @Field(() => Int)
    quantity!: number;

    @Field(() => Float)
    amount!: number;

    @Field(() => String)
    address!: string;

    @Field(() => OrderStatus)
    status!: OrderStatus;

    @Field(() => Int, { nullable: true })
    customer_id?: number;

    @Field(() => [ProductOrderCreateInput])
    products!: ProductOrderCreateInput[];
}

@Resolver()
export class InventoryResolver {
    // Implementing all the functionalitites commented above
    @Mutation()
    @Authorized()
    async createOrderRequest(
        @Arg("orderCreateInput", () => OrderCreateInput)
        orderCreateInput: OrderCreateInput,
    ): Promise<Order> {
        try {
            const createdOrder = await OrderResolver.createOrder(
                orderCreateInput,
            );
            createdOrder.status = orderCreateInput.status;
            // const createdOrder = await prisma.order.create({
            //     data: {
            //         quantity: orderCreateInput.quantity,
            //         amount: orderCreateInput.amount,
            //         address: orderCreateInput.address,
            //         status: orderCreateInput.status,
            //         customer_id: orderCreateInput.customer_id,
            //         products: {
            //             create: orderCreateInput.products,
            //         },
            //     },
            // });

            return createdOrder;
        } catch (error: any) {
            throw new UserInputError(error);
        }
    }
}
