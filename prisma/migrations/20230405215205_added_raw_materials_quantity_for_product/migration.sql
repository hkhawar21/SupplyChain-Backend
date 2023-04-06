/*
  Warnings:

  - You are about to drop the `ProductRawMaterials` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ProductRawMaterialsToRawMaterial` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ProductRawMaterials" DROP CONSTRAINT "ProductRawMaterials_product_id_fkey";

-- DropForeignKey
ALTER TABLE "_ProductRawMaterialsToRawMaterial" DROP CONSTRAINT "_ProductRawMaterialsToRawMaterial_A_fkey";

-- DropForeignKey
ALTER TABLE "_ProductRawMaterialsToRawMaterial" DROP CONSTRAINT "_ProductRawMaterialsToRawMaterial_B_fkey";

-- DropTable
DROP TABLE "ProductRawMaterials";

-- DropTable
DROP TABLE "_ProductRawMaterialsToRawMaterial";

-- CreateTable
CREATE TABLE "ProductAllRawMaterials" (
    "id" SERIAL NOT NULL,
    "product_id" INTEGER NOT NULL,
    "time" TEXT NOT NULL,

    CONSTRAINT "ProductAllRawMaterials_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductRawMaterial" (
    "id" SERIAL NOT NULL,
    "product_id" INTEGER NOT NULL,
    "raw_material_id" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,

    CONSTRAINT "ProductRawMaterial_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ProductAllRawMaterials" ADD CONSTRAINT "ProductAllRawMaterials_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductRawMaterial" ADD CONSTRAINT "ProductRawMaterial_raw_material_id_fkey" FOREIGN KEY ("raw_material_id") REFERENCES "RawMaterial"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductRawMaterial" ADD CONSTRAINT "ProductRawMaterial_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "ProductAllRawMaterials"("id") ON DELETE CASCADE ON UPDATE CASCADE;
