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
import { RawMaterialStatus, RawMaterial } from "@generated/type-graphql";

@InputType()
class RawMaterialUpdateInput {
    @Field(() => Int)
    id!: number;

    @Field(() => String, { nullable: true })
    name?: string;

    @Field(() => Boolean, { nullable: true })
    status?: boolean;

    @Field(() => Int, { nullable: true })
    quantity?: number;

    @Field(() => Float, { nullable: true })
    price?: number;

    @Field(() => Int, { nullable: true })
    presentInInventory?: number;
}

@InputType()
class RawMaterialInput {
    @Field(() => String)
    name!: string;

    @Field(() => Float)
    price!: number;

    @Field(() => Boolean)
    status!: boolean;

    @Field(() => Int)
    quantity!: number;

    @Field(() => Number)
    presentInInventory!: number;
}

@InputType()
class RawMaterialRequestInput {
    @Field(() => Int)
    quantity!: number;

    @Field(() => Int)
    raw_material_id!: number;
}

@Resolver()
export class RawMaterialResolver {
    // Implementing all the functionalitites commented above
    @Mutation(() => RawMaterial)
    @Authorized()
    async createRawMaterialRequest(
        @Arg("rawMaterialRequestInput", () => RawMaterialRequestInput)
        rawMaterialRequestInput: RawMaterialRequestInput,
    ): Promise<RawMaterial> {
        try {
            return await prisma.rawMaterial.update({
                where: { id: rawMaterialRequestInput.raw_material_id },
                data: {
                    quantity: rawMaterialRequestInput.quantity,
                    requestedStatus: RawMaterialStatus.PENDING,
                },
            });
        } catch (error: any) {
            throw new UserInputError(error);
        }
    }

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

    @Query(() => [RawMaterial])
    @Authorized()
    async rawMaterial(): Promise<RawMaterial[]> {
        try {
            return await prisma.rawMaterial.findMany();
        } catch (error: any) {
            throw new UserInputError(error);
        }
    }

    @Mutation(() => RawMaterial)
    @Authorized()
    async changeStatusRawMaterial(
        @Arg("id", () => Int) id: number,
        @Arg("status", () => RawMaterialStatus) status: RawMaterialStatus,
    ): Promise<RawMaterial> {
        try {
            return await prisma.rawMaterial.update({
                where: { id },
                data: { requestedStatus: status },
            });
        } catch (error: any) {
            throw new UserInputError(error);
        }
    }

    @Mutation(() => RawMaterial)
    @Authorized()
    async createRawMaterial(
        @Arg("rawMaterialInput", () => RawMaterialInput)
        rawMaterialInput: RawMaterialInput,
    ): Promise<RawMaterial> {
        try {
            return await prisma.rawMaterial.create({
                data: {
                    ...rawMaterialInput,
                    requested: 0,
                    requestedStatus: RawMaterialStatus.PENDING,
                    inventory_id: 0,
                    presentInInventory: rawMaterialInput.presentInInventory,
                },
            });
        } catch (error: any) {
            throw new UserInputError(error);
        }
    }

    @Mutation(() => RawMaterial)
    @Authorized()
    async updateRawMaterial(
        @Arg("rawMaterialInput", () => RawMaterialUpdateInput)
        rawMaterialInput: RawMaterialUpdateInput,
    ): Promise<RawMaterial> {
        try {
            return await prisma.rawMaterial.update({
                where: { id: rawMaterialInput.id },
                data: rawMaterialInput,
            });
        } catch (error: any) {
            throw new UserInputError(error);
        }
    }

    @Mutation(() => RawMaterial)
    @Authorized()
    async deleteRawMaterial(@Arg("id", () => Int) id: number) {
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
