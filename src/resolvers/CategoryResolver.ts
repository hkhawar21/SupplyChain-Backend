import "reflect-metadata";
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
import { Category, AccessRole } from "@generated/type-graphql";
import { UserInputError } from "apollo-server-express";
import prisma from "../prisma/client";
import { Context } from "../types";
import { isUserAllowed } from "../utils/role";

@InputType()
export class CategoryUpdateInput {
    @Field(() => Int)
    id!: number;

    @Field(() => String, { nullable: true })
    name?: string;

    @Field(() => Boolean, { nullable: true })
    status?: boolean;

    @Field(() => String, { nullable: true })
    image?: string;
}

@InputType()
export class CategoryCreateInput {
    @Field(() => String)
    name!: string;

    @Field(() => Boolean)
    status!: boolean;

    @Field(() => String)
    image!: string;
}

@Resolver()
export class CategoryResolver {
    @Mutation(() => Category)
    @Authorized()
    async createCategory(
        @Arg("categoryCreateInput", () => CategoryCreateInput)
        categoryCreateInput: CategoryCreateInput,
        @Ctx() ctx: Context,
    ): Promise<Category> {
        if (
            !isUserAllowed(ctx.user!.role, [
                AccessRole.inventory,
                AccessRole.products,
                AccessRole.admin,
            ])
        )
            throw new UserInputError("Not Authorized");
        try {
            // Restrict adding duplicate category
            const category = await prisma.category.findFirst({
                where: {
                    ...categoryCreateInput,
                },
            });

            if (category) {
                throw new UserInputError(
                    "Category already exists with this data. Please enter different details",
                );
            }

            const createdCategory = await prisma.category.create({
                data: {
                    ...categoryCreateInput,
                },
            });

            return createdCategory;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    @Query(() => [Category])
    @Authorized()
    async categories() {
        try {
            return await prisma.category.findMany({
                include: {
                    products: true,
                },
            });
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    @Query(() => Category)
    @Authorized()
    async categoryById(@Arg("id", () => Int) id: number) {
        return await prisma.category.findUnique({ where: { id } });
    }

    @Mutation(() => Category)
    @Authorized()
    async updateCategory(
        @Arg("categoryUpdateInput", () => CategoryUpdateInput)
        categoryUpdateInput: CategoryUpdateInput,
        @Ctx() ctx: Context,
    ) {
        if (
            !isUserAllowed(ctx.user!.role, [
                AccessRole.inventory,
                AccessRole.products,
                AccessRole.admin,
            ])
        )
            throw new UserInputError("Not Authorized");
        const category = await prisma.category.findUnique({
            where: { id: categoryUpdateInput.id },
        });
        if (!category)
            throw new UserInputError(
                "Category does not exists with this data. Please enter different details",
            );

        return await prisma.category.update({
            where: { id: categoryUpdateInput.id },
            data: {
                ...categoryUpdateInput,
            },
        });
    }

    @Mutation(() => Boolean)
    @Authorized()
    async deleteCategory(
        @Arg("id", () => Int) id: number,
        @Ctx() ctx: Context,
    ) {
        if (
            !isUserAllowed(ctx.user!.role, [
                AccessRole.inventory,
                AccessRole.products,
                AccessRole.admin,
            ])
        )
            throw new UserInputError("Not Authorized");
        await prisma.category.delete({ where: { id } });
        return true;
    }
}
