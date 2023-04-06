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
        @Arg("id", () => Int) id: number,
        @Arg("quantity", () => Int) quantity: number,
    ): Promise<RawMaterial> {
        try {
            const createdRequest = await prisma.rawMaterial.update({
                where: { id },
                data: {
                    quantity: quantity,
                    requestedStatus: RawMaterialStatus.PENDING,
                },
            });
            return createdRequest;
        } catch (error: any) {
            throw new UserInputError(error);
        }
    }

    @Query(() => [RawMaterial])
    @Authorized()
    async rawMaterialRequested(): Promise<RawMaterial[]> {
        try {
            const rawMaterialRequest = await prisma.rawMaterial.findMany({
                where: {
                    requestedStatus: RawMaterialStatus.PENDING,
                },
            });
            return rawMaterialRequest;
        } catch (error: any) {
            throw new UserInputError(error);
        }
    }

    @Query(() => [RawMaterial])
    @Authorized()
    async rawMaterial(): Promise<RawMaterial[]> {
        try {
            const rawMaterial = await prisma.rawMaterial.findMany();
            return rawMaterial;
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
            const updatedRawMaterial = await prisma.rawMaterial.update({
                where: { id },
                data: { requestedStatus: status },
            });
            return updatedRawMaterial;
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
            const createdRawMaterial = await prisma.rawMaterial.create({
                data: {
                    ...rawMaterialInput,
                    requested: 0,
                    requestedStatus: RawMaterialStatus.PENDING,
                    inventory_id: 0,
                },
            });
            return createdRawMaterial;
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
            const updatedRawMaterial = await prisma.rawMaterial.update({
                where: { id: rawMaterialInput.id },
                data: rawMaterialInput,
            });
            return updatedRawMaterial;
        } catch (error: any) {
            throw new UserInputError(error);
        }
    }
}
