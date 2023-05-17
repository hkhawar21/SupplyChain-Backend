import { Arg, Authorized, Ctx, Int, Mutation, Resolver } from "type-graphql";
import prisma from "../prisma/client";
import { UserInputError } from "apollo-server-core";
import {
    RawMaterialStatus,
    RawMaterial,
    AccessRole,
} from "@generated/type-graphql";
import { isUserAllowed } from "../utils/role";

@Resolver()
export class FinanceResolver {
    @Mutation(() => RawMaterial)
    @Authorized()
    async approveRawmaterialRequest(
        @Arg("id", () => Int) id: number,
        @Arg("quantity", () => Int) quantity: number,
        @Ctx() ctx: any,
    ) {
        if (
            !isUserAllowed(ctx.user.role, [
                AccessRole.finance,
                AccessRole.admin,
            ])
        )
            throw new UserInputError("Not Authorized");
        try {
            // If existing raw materials request is present, then provide the updated value
            const rawMaterial = await prisma.rawMaterial.update({
                where: {
                    id,
                },
                data: {
                    requested: quantity,
                    requestedStatus: RawMaterialStatus.WAITING,
                },
            });
            return rawMaterial;
        } catch (error: any) {
            throw new UserInputError(error);
        }
    }

    @Mutation(() => RawMaterial)
    @Authorized()
    async rejectRawmaterialRequest(
        @Arg("id", () => Int) id: number,
        @Ctx() ctx: any,
    ) {
        if (
            !isUserAllowed(ctx.user.role, [
                AccessRole.finance,
                AccessRole.admin,
            ])
        )
            throw new UserInputError("Not Authorized");
        try {
            // If existing raw materials request is present, then provide the updated value
            const rawMaterial = await prisma.rawMaterial.update({
                where: {
                    id,
                },
                data: {
                    requested: 0,
                    requestedStatus: RawMaterialStatus.REJECTED,
                },
            });
            return rawMaterial;
        } catch (error: any) {
            throw new UserInputError(error);
        }
    }
}
