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
import { UserInputError } from "apollo-server-core";
import { OrderCreateInput, OrderResolver } from "./OrderResolver";
import {
    Order,
    OrderStatus,
    Product,
    RawMaterial,
} from "@generated/type-graphql";

// Inventory Resolver will provide the following functionalities:
// 1. Create Order Request
// 2. Approval of order
// 3. Show Orders requested and pending
// 4. Show all the products present in inventory with their respective quantity
// 5. Change status of products from pending to approved or vice versa
// 6. Show all the raw materials available in inventory with their respective quantity
// 7. Create requests for raw materials which is then to be approved by the finance admin

@InputType()
class OrderCreateInputInventory extends OrderCreateInput {
    @Field(() => OrderStatus)
    status!: OrderStatus;
}

@Resolver()
export class InventoryResolver {
    // Implementing all the functionalitites commented above
    @Mutation()
    @Authorized()
    async createOrderRequest(
        @Arg("orderCreateInput", () => OrderCreateInputInventory)
        orderCreateInput: OrderCreateInputInventory,
    ): Promise<Order> {
        try {
            const createdOrder = await OrderResolver.createOrder(
                orderCreateInput,
            );
            const updatedOrder = await prisma.order.update({
                where: { id: createdOrder.id },
                data: {
                    status: orderCreateInput.status,
                },
            });
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

            return updatedOrder;
        } catch (error: any) {
            throw new UserInputError(error);
        }
    }

    @Mutation()
    @Authorized()
    async approveOrderRequest(
        @Arg("orderId", () => Int) orderId: number,
    ): Promise<Order> {
        try {
            const updatedOrder = await prisma.order.update({
                where: { id: orderId },
                data: {
                    status: OrderStatus.PROCESSING,
                },
            });
            return updatedOrder;
        } catch (error: any) {
            throw new UserInputError(error);
        }
    }

    @Query(() => [Order])
    @Authorized()
    async showOrdersRequested(): Promise<Order[]> {
        try {
            const orders = await prisma.order.findMany();
            return orders;
        } catch (error: any) {
            throw new UserInputError(error);
        }
    }

    @Query(() => [Product])
    @Authorized()
    async showProductsInInventory(): Promise<Product[]> {
        try {
            const products = await prisma.product.findMany();
            return products;
        } catch (error: any) {
            throw new UserInputError(error);
        }
    }

    @Query(() => [RawMaterial])
    @Authorized()
    async showRawMaterialsInInventory(): Promise<RawMaterial[]> {
        try {
            const rawMaterials = await prisma.rawMaterial.findMany();
            return rawMaterials;
        } catch (error: any) {
            throw new UserInputError(error);
        }
    }
}
