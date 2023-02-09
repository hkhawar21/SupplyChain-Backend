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
import { Product, Raw_Material } from "@generated/type-graphql";
import { UserInputError } from "apollo-server-express";

@Resolver()
export class ProductResolver {
    @Mutation(() => Product)
    @Authorized()
    async createProduct(
        @Arg("name", () => String) name: string,
        @Arg("status", () => Boolean) status: boolean,
        @Arg("image", () => String) image: string,
        @Arg("weight", () => Number) weight: number,
        @Arg("price_per_unit", () => Number) price_per_unit: number,
        @Arg("category_id", () => Int) category_id: number,
    ): Promise<Product> {
        try {
            // Restrict adding duplicate product
            const product = await prisma.product.findFirst({
                where: {
                    name,
                    status,
                    image,
                    weight,
                    price_per_unit,
                    category_id,
                },
            });

            if (product) {
                throw new UserInputError(
                    "Product already exists with this data. Please enter different details",
                );
            }

            const createdProduct = await prisma.product.create({
                data: {
                    name,
                    status,
                    image,
                    weight,
                    price_per_unit,
                    category: {
                        connect: {
                            id: category_id,
                        },
                    },
                },
            });

            return createdProduct;
        } catch (error: any) {
            console.error(error);
            throw new Error(error.message);
        }
    }

    @Query(() => [Product])
    @Authorized()
    async products() {
        return await prisma.product.findMany();
    }

    @Mutation(() => Boolean)
    @Authorized()
    async deleteProduct(@Arg("id", () => Int) id: number) {
        await prisma.product.delete({ where: { id } });
        return true;
    }
}
