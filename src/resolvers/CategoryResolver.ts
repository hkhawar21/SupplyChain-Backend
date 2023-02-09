import {
    Arg,
    Authorized,
    Ctx,
    Int,
    Mutation,
    Query,
    Resolver,
} from "type-graphql";
import { Category } from "@generated/type-graphql";
import { UserInputError } from "apollo-server-express";
import prisma from "../prisma/client";

@Resolver()
export class CategoryResolver {
    @Mutation(() => Category)
    @Authorized()
    async createCategory(
        @Arg("name", () => String) name: string,
        @Arg("status", () => Boolean) status: boolean,
        @Arg("image", () => String) image: string,
    ): Promise<Category> {
        try {
            // Restrict adding duplicate category
            const category = await prisma.category.findFirst({
                where: {
                    name,
                    status,
                    image,
                },
            });

            if (category) {
                throw new UserInputError(
                    "Category already exists with this data. Please enter different details",
                );
            }

            const createdCategory = await prisma.category.create({
                data: {
                    name,
                    status,
                    image: image === "" || !image ? "" : image,
                },
            });

            return createdCategory;
        } catch (error: any) {
            console.error(error);
            throw new Error(error.message);
        }
    }

    @Query(() => [Category])
    @Authorized()
    async categories() {
        try {
            return await prisma.category.findMany({
                select: {
                    id: true,
                    name: true,
                    status: true,
                    image: true,
                    products: {
                        select: {
                            id: true,
                            name: true,
                            price_per_unit: true,
                            status: true,
                            weight: true,
                        },
                    },
                },
            });
        } catch (error: any) {
            console.error(error);
            throw new Error(error.message);
        }
    }

    @Query(() => Category)
    @Authorized()
    async categoryById(@Arg("id", () => Number) id: number) {
        return await prisma.category.findUnique({ where: { id } });
    }

    @Mutation(() => Category)
    @Authorized()
    async updateCategory(
        @Arg("id", () => Number) id: number,
        @Arg("name", () => String) name: string,
        @Arg("status", () => Boolean) status: boolean,
        @Arg("image", () => String) image: string,
    ) {
        const category = await prisma.category.findUnique({ where: { id } });
        if (!category)
            throw new UserInputError(
                "Category does not exists with this data. Please enter different details",
            );

        return await prisma.category.update({
            where: { id },
            data: {
                name,
                status,
                image: image !== null ? image : undefined,
            },
        });
    }

    @Mutation(() => Boolean)
    @Authorized()
    async deleteCategory(@Arg("id", () => Int) id: number) {
        await prisma.category.delete({ where: { id } });
        return true;
    }
}
