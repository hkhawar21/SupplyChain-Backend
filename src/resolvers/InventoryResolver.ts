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
} from "type-graphql";
import prisma from "../prisma/client";
import { UserInputError } from "apollo-server-core";
import { OrderCreateInput, OrderResolver } from "./OrderResolver";
import {
    Order,
    OrderStatus,
    Product,
    RawMaterial,
    Inventory,
    AccessRole,
} from "@generated/type-graphql";
import { isUserAllowed } from "../utils/role";

// Inventory Resolver will provide the following functionalities:
// 1. Create Order Request
// 2. Approval of order
// 3. Show Orders requested and pending
// 4. Show all the products present in inventory with their respective quantity
// 5. Change status of products from pending to approved or vice versa
// 6. Show all the raw materials available in inventory with their respective quantity

@InputType()
class OrderCreateInputInventory extends OrderCreateInput {
    @Field(() => OrderStatus)
    status!: OrderStatus;
}

@Resolver()
export class InventoryResolver {
    // Implementing all the functionalitites commented above

    @Mutation(() => Inventory)
    @Authorized()
    async createInventory(@Ctx() ctx: any): Promise<Inventory> {
        if (
            !isUserAllowed(ctx.user.role, [
                AccessRole.inventory,
                AccessRole.admin,
            ])
        )
            throw new UserInputError("Not Authorized");
        try {
            const inventory = await prisma.inventory.create({
                data: {},
            });
            return inventory;
        } catch (error: any) {
            throw new UserInputError(error);
        }
    }

    @Query(() => [Inventory])
    @Authorized()
    async inventories(): Promise<Inventory[]> {
        try {
            return await prisma.inventory.findMany();
        } catch (error: any) {
            throw new UserInputError(error);
        }
    }

    @Mutation(() => Order)
    @Authorized()
    async createOrderRequest(
        @Arg("orderCreateInput", () => OrderCreateInputInventory)
        orderCreateInput: OrderCreateInputInventory,
        @Ctx() ctx: any,
    ): Promise<Order> {
        if (
            !isUserAllowed(ctx.user.role, [
                AccessRole.inventory,
                AccessRole.admin,
            ])
        )
            throw new UserInputError("Not Authorized");
        try {
            const orderCanBeCreated =
                await OrderResolver.checkRawMaterialAvailability(
                    orderCreateInput,
                );
            if (!orderCanBeCreated)
                throw new UserInputError("Order cannot be created");

            const createdOrder = await OrderResolver.createOrder(
                orderCreateInput,
            );
            const updatedOrder = await prisma.order.update({
                where: { id: createdOrder.id },
                data: {
                    status: orderCreateInput.status,
                },
            });

            return updatedOrder;
        } catch (error: any) {
            throw new UserInputError(error);
        }
    }

    @Mutation(() => Order)
    @Authorized()
    async approveOrderRequest(
        @Arg("orderId", () => Int) orderId: number,
        @Ctx() ctx: any,
    ): Promise<Order> {
        if (
            !isUserAllowed(ctx.user.role, [
                AccessRole.inventory,
                AccessRole.admin,
            ])
        )
            throw new UserInputError("Not Authorized");
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
    async ordersRequested(): Promise<Order[]> {
        try {
            const orders = await prisma.order.findMany();
            return orders;
        } catch (error: any) {
            throw new UserInputError(error);
        }
    }

    @Query(() => [Product])
    @Authorized()
    async productsInInventory(): Promise<Product[]> {
        try {
            const products = await prisma.product.findMany();
            return products;
        } catch (error: any) {
            throw new UserInputError(error);
        }
    }

    @Query(() => [RawMaterial])
    @Authorized()
    async rawMaterialsInInventory(): Promise<RawMaterial[]> {
        try {
            const rawMaterials = await prisma.rawMaterial.findMany({
                where: {
                    presentInInventory: { gt: 0 },
                },
            });
            return rawMaterials;
        } catch (error: any) {
            throw new UserInputError(error);
        }
    }
}
