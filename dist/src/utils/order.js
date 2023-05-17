"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.areAllRawMaterialsPresent = exports.deductRawMaterialsFromInventory = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function deductRawMaterialsFromInventory(id) {
    // Returns all the raw materials used in a specific order for all the products in it
    // ONLY FOR ORDERS IN PROCESSING STATUS
    const order = await prisma.order.findUnique({
        where: {
            id,
        },
        include: {
            products: true,
        },
    });
    let rawMaterialsRequired = [];
    let productRawMaterials;
    // Mapping through all the products in the order and returning the raw materials used in each product multiplied by the quantity of the product
    order?.products.map(async (product) => {
        productRawMaterials = await prisma.productRawMaterials.findMany({
            where: {
                id: product.id,
            },
        });
        productRawMaterials?.map((productRawMaterial) => {
            // If the raw material is already present in the rawMaterialsRequired array, then add the quantity to the existing quantity
            if (rawMaterialsRequired?.find((rawMaterial) => rawMaterial.id === productRawMaterial.raw_material_id)) {
                rawMaterialsRequired?.map((rawMaterial) => {
                    if (rawMaterial.id === productRawMaterial.raw_material_id) {
                        rawMaterial.quantity +=
                            productRawMaterial.quantity * product.quantity;
                    }
                });
            }
            else {
                rawMaterialsRequired?.push({
                    id: productRawMaterial.raw_material_id,
                    quantity: productRawMaterial.quantity * product.quantity,
                });
            }
        });
    });
    const rawMaterialsInventoryStatus = await areAllRawMaterialsPresent(rawMaterialsRequired);
    if (rawMaterialsInventoryStatus) {
        // Deducting the raw materials from the inventory
        rawMaterialsRequired?.map(async (rawMaterial) => {
            const rawMaterialInInventory = await prisma.rawMaterial.findUnique({
                where: {
                    id: rawMaterial.id,
                },
            });
            if (rawMaterialInInventory) {
                await prisma.rawMaterial.update({
                    where: {
                        id: rawMaterial.id,
                    },
                    data: {
                        presentInInventory: rawMaterialInInventory.presentInInventory -
                            rawMaterial.quantity,
                    },
                });
            }
        });
    }
    else
        return false;
    return true;
}
exports.deductRawMaterialsFromInventory = deductRawMaterialsFromInventory;
async function areAllRawMaterialsPresent(rawMaterials) {
    rawMaterials.map(async (rawMaterial) => {
        const rawMaterialInInventory = await prisma.rawMaterial.findUnique({
            where: {
                id: rawMaterial.id,
            },
        });
        if (!rawMaterialInInventory)
            return false;
        if (rawMaterialInInventory?.presentInInventory < rawMaterial.quantity) {
            return false;
        }
    });
    return true;
}
exports.areAllRawMaterialsPresent = areAllRawMaterialsPresent;
//# sourceMappingURL=order.js.map