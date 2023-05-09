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
import { Product, AccessRole } from "@generated/type-graphql";
import { UserInputError } from "apollo-server-express";
import { isUserAllowed } from "../utils/role";

@InputType()
export class ProductRawMaterialUpdate {
    @Field(() => Int)
    id!: number;

    @Field(() => Int)
    quantity!: number;
}

@InputType()
export class ProductUpdateInput {
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

    @Field(() => Int, { nullable: true })
    presentInInventory?: number;

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

    @Field(() => Number)
    presentInInventory!: number;

    @Field(() => [ProductRawMaterialsInput])
    raw_materials!: ProductRawMaterialsInput[];
}

// FUNCTIONS PRESENT IN THIS RESOLVER
// 1. createProduct
// 2. products
// 3. productById
// 4. updateProduct
// 5. removeRawMaterialFromProduct
// 6. addRawMaterialToProduct
// 7. deleteProduct

@Resolver()
export class ProductResolver {
    @Mutation(() => Product)
    @Authorized()
    async createProduct(
        @Arg("productInput", () => ProductInput) productInput: ProductInput,
        @Ctx() ctx: any,
    ): Promise<Product> {
        if (!isUserAllowed(ctx.role, [AccessRole.products, AccessRole.admin]))
            throw new UserInputError("Not Authorized");
        try {
            // Restrict adding duplicate product
            const product = await prisma.product.findFirst({
                where: {
                    name: productInput.name,
                    status: productInput.status,
                    image: productInput.image,
                    weight: productInput.weight,
                    price_per_unit: productInput.price_per_unit,
                    presentInInventory: productInput.presentInInventory,
                },
            });

            if (product) {
                throw new UserInputError(
                    "Product already exists with this data. Please enter different details",
                );
            }

            // Restric adding product with invalid category
            const category = await prisma.category.findFirst({
                where: {
                    id: productInput.category_id,
                },
            });
            if (!category?.status) throw new UserInputError("Invalid category");

            const createdProduct = await prisma.product.create({
                data: {
                    name: productInput.name,
                    status: productInput.status,
                    image: productInput.image,
                    weight: productInput.weight,
                    price_per_unit: productInput.price_per_unit,
                    time: productInput.time,
                    presentInInventory: productInput.presentInInventory,
                    category: {
                        connect: {
                            id: productInput.category_id,
                        },
                    },
                    raw_materials: {
                        createMany: {
                            data: productInput.raw_materials.map((item) => ({
                                raw_material_id: item.raw_material_id,
                                quantity: item.quantity,
                            })),
                        },
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
        @Ctx() ctx: any,
    ) {
        if (!isUserAllowed(ctx.role, [AccessRole.products, AccessRole.admin]))
            throw new UserInputError("Not Authorized");
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
                    presentInInventory: productUpdateInput.presentInInventory,
                },
                include: {
                    raw_materials: true,
                    category: true,
                },
            });
            return updatedProduct;
        }
    }

    @Mutation(() => Product)
    @Authorized()
    async removeRawMaterialFromProduct(
        @Arg("productId", () => Int) productId: number,
        @Arg("rawMaterialId", () => Int) rawMaterialId: number,
        @Ctx() ctx: any,
    ) {
        if (!isUserAllowed(ctx.role, [AccessRole.products, AccessRole.admin]))
            throw new UserInputError("Not Authorized");
        try {
            return await prisma.product.update({
                where: { id: productId },
                data: {
                    raw_materials: {
                        disconnect: {
                            id: rawMaterialId,
                        },
                    },
                },
                include: {
                    raw_materials: true,
                    category: true,
                },
            });
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    @Mutation(() => Product)
    @Authorized()
    async addRawMaterialToProduct(
        @Arg("productId", () => Int) productId: number,
        @Arg("rawMaterialId", () => Int) rawMaterialId: number,
        @Arg("quantity", () => Int) quantity: number,
        @Ctx() ctx: any,
    ) {
        if (!isUserAllowed(ctx.role, [AccessRole.products, AccessRole.admin]))
            throw new UserInputError("Not Authorized");
        try {
            await prisma.productRawMaterials.create({
                data: {
                    raw_material_id: rawMaterialId,
                    quantity: quantity,
                    product_id: productId,
                },
            });

            return await prisma.product.findUnique({
                where: { id: productId },
                include: {
                    raw_materials: true,
                    category: true,
                },
            });
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    @Mutation(() => Product)
    @Authorized()
    async deleteProduct(
        @Arg("id", () => Int) id: number,
        @Ctx() ctx: any,
    ): Promise<Product> {
        if (!isUserAllowed(ctx.role, [AccessRole.products, AccessRole.admin]))
            throw new UserInputError("Not Authorized");
        try {
            return await prisma.product.update({
                where: { id },
                data: {
                    status: false,
                },
            });
        } catch (error: any) {
            throw new Error(error.message);
        }
    }
}
