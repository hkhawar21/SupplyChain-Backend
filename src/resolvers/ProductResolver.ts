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
import { Product } from "@generated/type-graphql";
import { UserInputError } from "apollo-server-express";

@InputType()
class ProductRawMaterialUpdate {
    @Field(() => Int)
    id!: number;

    @Field(() => Int)
    quantity!: number;
}

@InputType()
class ProductUpdateInput {
    @Field(() => Int)
    id!: number;

    @Field(() => String, { nullable: true })
    name?: string;

    @Field(() => Boolean, { nullable: true })
    status?: boolean;

    @Field(() => String, { nullable: true })
    image?: string;

    @Field(() => Number, { nullable: true })
    weight?: number;

    @Field(() => Number, { nullable: true })
    price_per_unit?: number;

    @Field(() => Int, { nullable: true })
    category_id?: number;

    @Field(() => String, { nullable: true })
    time?: string;

    @Field(() => [ProductRawMaterialUpdate], { nullable: true })
    raw_materials?: ProductRawMaterialUpdate[];
}

@InputType()
export class ProductRawMaterialsInput {
    @Field(() => Int)
    raw_material_id!: number;

    @Field(() => Int)
    quantity!: number;
}

@InputType()
export class ProductInput {
    @Field(() => String)
    name!: string;

    @Field(() => Boolean)
    status!: boolean;

    @Field(() => String)
    image!: string;

    @Field(() => Number)
    weight!: number;

    @Field(() => Number)
    price_per_unit!: number;

    @Field(() => Int)
    category_id!: number;

    @Field(() => String)
    time!: string;

    @Field(() => [ProductRawMaterialsInput])
    raw_materials!: ProductRawMaterialsInput[];
}

@Resolver()
export class ProductResolver {
    @Mutation(() => Product)
    @Authorized()
    async createProduct(
        @Arg("productInput", () => ProductInput) productInput: ProductInput,
    ): Promise<Product> {
        try {
            // Restrict adding duplicate product
            const product = await prisma.product.findFirst({
                where: {
                    name: productInput.name,
                    status: productInput.status,
                    image: productInput.image,
                    weight: productInput.weight,
                    price_per_unit: productInput.price_per_unit,
                },
            });

            if (product) {
                throw new UserInputError(
                    "Product already exists with this data. Please enter different details",
                );
            }

            const createdProduct = await prisma.product.create({
                data: {
                    name: productInput.name,
                    status: productInput.status,
                    image: productInput.image,
                    weight: productInput.weight,
                    price_per_unit: productInput.price_per_unit,
                    time: productInput.time,
                    category: {
                        connect: {
                            id: productInput.category_id,
                        },
                    },
                    raw_materials: {
                        connect: [
                            ...productInput.raw_materials.map(
                                (raw_material) => ({
                                    id: raw_material.raw_material_id,
                                    quantity: raw_material.quantity,
                                }),
                            ),
                        ],
                    },
                },
                include: {
                    raw_materials: true,
                    category: true,
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
        return await prisma.product.findMany({
            include: {
                raw_materials: true,
                category: true,
            },
        });
    }

    @Query(() => Product)
    @Authorized()
    async productById(@Arg("id", () => Int) id: number) {
        return await prisma.product.findUnique({
            where: { id },
            include: {
                raw_materials: true,
                category: true,
            },
        });
    }

    @Mutation(() => Product)
    @Authorized()
    async updateProduct(
        @Arg("productUpdateInput", () => ProductUpdateInput)
        productUpdateInput: ProductUpdateInput,
    ) {
        const product = await prisma.product.findUnique({
            where: { id: productUpdateInput.id },
        });

        if (!product) {
            throw new UserInputError("Product not found");
        }

        if (productUpdateInput.raw_materials) {
            const updatedProduct = await prisma.product.update({
                where: { id: productUpdateInput.id },
                data: {
                    ...productUpdateInput,
                    raw_materials: {
                        updateMany: [
                            ...productUpdateInput?.raw_materials.map(
                                (raw_material) => ({
                                    where: { id: raw_material.id },
                                    data: {
                                        quantity: raw_material.quantity,
                                    },
                                }),
                            ),
                        ],
                    },
                },
                include: {
                    raw_materials: true,
                    category: true,
                },
            });
            return updatedProduct;
        } else {
            const updatedProduct = await prisma.product.update({
                where: { id: productUpdateInput.id },
                data: {
                    name: productUpdateInput.name,
                    status: productUpdateInput.status,
                    image: productUpdateInput.image,
                    weight: productUpdateInput.weight,
                    price_per_unit: productUpdateInput.price_per_unit,
                    time: productUpdateInput.time,
                },
                include: {
                    raw_materials: true,
                    category: true,
                },
            });
            return updatedProduct;
        }
    }

    @Mutation(() => Boolean)
    @Authorized()
    async deleteProduct(@Arg("id", () => Int) id: number) {
        await prisma.product.delete({ where: { id } });
        return true;
    }
}
