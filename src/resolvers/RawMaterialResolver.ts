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
import {
    RawMaterialStatus,
    RawMaterial,
    AccessRole,
} from "@generated/type-graphql";
import { isUserAllowed } from "../utils/role";

@InputType()
export class RawMaterialUpdateInput {
    @Field(() => Int)
    id!: number;

    @Field(() => String, { nullable: true })
    name?: string;

    @Field(() => Boolean, { nullable: true })
    status?: boolean;

    @Field(() => Float, { nullable: true })
    price?: number;

    @Field(() => Int, { nullable: true })
    presentInInventory?: number;
}

@InputType()
export class RawMaterialInput {
    @Field(() => String)
    name!: string;

    @Field(() => Float)
    price!: number;

    @Field(() => Boolean)
    status!: boolean;

    @Field(() => Number)
    presentInInventory!: number;
}

@InputType()
export class RawMaterialRequestInput {
    @Field(() => Int)
    quantity!: number;

    @Field(() => Int)
    id!: number;
}

@Resolver()
export class RawMaterialResolver {
    // Implementing all the functionalitites commented above

    // CREATE RAW MATERIAL REQUEST
    @Mutation(() => RawMaterial)
    @Authorized()
    async createRawMaterialRequest(
        @Arg("rawMaterialRequestInput", () => RawMaterialRequestInput)
        rawMaterialRequestInput: RawMaterialRequestInput,
        @Ctx() ctx: any,
    ): Promise<RawMaterial> {
        if (
            !isUserAllowed(ctx.user.role, [
                AccessRole.inventory,
                AccessRole.admin,
                AccessRole.products,
            ])
        )
            throw new UserInputError("Not Authorized");
        try {
            return await prisma.rawMaterial.update({
                where: { id: rawMaterialRequestInput.id },
                data: {
                    requested: rawMaterialRequestInput.quantity,
                    requestedStatus: RawMaterialStatus.PENDING,
                },
            });
        } catch (error: any) {
            throw new UserInputError(error);
        }
    }

    // RETURN RAW MATERIAL REQUESTED
    @Query(() => [RawMaterial])
    @Authorized()
    async rawMaterialRequested(): Promise<RawMaterial[]> {
        try {
            return await prisma.rawMaterial.findMany({
                where: {
                    requestedStatus: RawMaterialStatus.PENDING,
                },
            });
        } catch (error: any) {
            throw new UserInputError(error);
        }
    }

    // ALL RAW MATERIALS
    @Query(() => [RawMaterial])
    @Authorized()
    async rawMaterial(): Promise<RawMaterial[]> {
        try {
            return await prisma.rawMaterial.findMany();
        } catch (error: any) {
            throw new UserInputError(error);
        }
    }

    // UPDATE STATUS OF RAW MATERIAL REQUESTED
    @Mutation(() => RawMaterial)
    @Authorized()
    async changeStatusRawMaterial(
        @Arg("id", () => Int) id: number,
        @Arg("status", () => RawMaterialStatus) status: RawMaterialStatus,
        @Ctx() ctx: any,
    ): Promise<RawMaterial> {
        if (
            !isUserAllowed(ctx.user.role, [
                AccessRole.inventory,
                AccessRole.admin,
                AccessRole.products,
            ])
        )
            throw new UserInputError("Not Authorized");
        try {
            const rawMaterial = await prisma.rawMaterial.findFirst({
                where: {
                    id,
                },
            });

            return await prisma.rawMaterial.update({
                where: { id },
                data: {
                    requestedStatus: status,
                    presentInInventory: {
                        increment:
                            status === RawMaterialStatus.APPROVED
                                ? rawMaterial?.requested
                                : 0,
                    },
                    requested: 0,
                },
            });
        } catch (error: any) {
            throw new UserInputError(error);
        }
    }

    // CREATE RAW MATERIAL
    @Mutation(() => RawMaterial)
    @Authorized()
    async createRawMaterial(
        @Arg("rawMaterialInput", () => RawMaterialInput)
        rawMaterialInput: RawMaterialInput,
        @Ctx() ctx: any,
    ): Promise<RawMaterial> {
        if (
            !isUserAllowed(ctx.user.role, [
                AccessRole.inventory,
                AccessRole.admin,
                AccessRole.products,
            ])
        )
            throw new UserInputError("Not Authorized");
        try {
            const rawMaterial = await prisma.rawMaterial.findFirst({
                where: {
                    ...rawMaterialInput,
                },
            });

            if (rawMaterial)
                throw new UserInputError("Raw Material already exists");

            return await prisma.rawMaterial.create({
                data: {
                    ...rawMaterialInput,
                    requested: 0,
                    requestedStatus: RawMaterialStatus.PENDING,
                    inventory_id: 1,
                    presentInInventory: rawMaterialInput.presentInInventory,
                },
            });
        } catch (error: any) {
            throw new UserInputError(error);
        }
    }

    // UPDATE RAW MATERIAL
    @Mutation(() => RawMaterial)
    @Authorized()
    async updateRawMaterial(
        @Arg("rawMaterialInput", () => RawMaterialUpdateInput)
        rawMaterialInput: RawMaterialUpdateInput,
        @Ctx() ctx: any,
    ): Promise<RawMaterial> {
        if (
            !isUserAllowed(ctx.user.role, [
                AccessRole.inventory,
                AccessRole.admin,
                AccessRole.products,
            ])
        )
            throw new UserInputError("Not Authorized");
        try {
            return await prisma.rawMaterial.update({
                where: { id: rawMaterialInput.id },
                data: rawMaterialInput,
            });
        } catch (error: any) {
            throw new UserInputError(error);
        }
    }

    // DELETE RAW MATERIAL
    @Mutation(() => RawMaterial)
    @Authorized()
    async deleteRawMaterial(@Arg("id", () => Int) id: number, @Ctx() ctx: any) {
        if (
            !isUserAllowed(ctx.user.role, [
                AccessRole.inventory,
                AccessRole.admin,
                AccessRole.products,
            ])
        )
            throw new UserInputError("Not Authorized");
        try {
            return await prisma.rawMaterial.update({
                where: { id },
                data: {
                    status: false,
                },
            });
        } catch (error: any) {
            throw new UserInputError(error);
        }
    }
}
