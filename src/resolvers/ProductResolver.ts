import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from "type-graphql";
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
        @Arg("category_id", () => Number) category_id: number,
        @Arg("category_name", () => String) category_name: string,
        @Arg("raw_materials") raw_materials: Raw_Material[],
    ): Promise<Product> {
        try {
            // Restrict adding duplicate product
            const category = await prisma.category.findFirst({
                where: { id: category_id },
            });

            const product = await prisma.product.findFirst({
                where: {
                    name,
                    status,
                    image,
                    weight,
                    price_per_unit,
                },
            });

            const isDuplicateProduct =
                product && category_name === category?.name;

            if (isDuplicateProduct) {
                throw new UserInputError(
                    "Product already exists with this data. Please enter different details",
                );
            }

            // const createProductInCategory = await prisma.category.update({
            //     where: {id: category_id},
            //     data: {
            //         product: {
            //             create: [{name, status, image, weight, price_per_unit}]
            //         }
            //     }
            // })

            const createdProduct = await prisma.product.create({
                data: {
                    name,
                    status,
                    image,
                    weight,
                    price_per_unit,
                    // category: {
                    //     connectOrCreate: {
                    //         where: {
                    //             category_id
                    //         },
                    //         create: {
                    //             category_id,
                    //             category_name
                    //         }
                    //     }
                    // }
                },
            });
        } catch (error: any) {
            console.error(error);
            throw new Error(error.message);
        }
    }
}
