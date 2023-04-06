/*
  Warnings:

  - You are about to drop the `ProductAllRawMaterials` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ProductRawMaterial` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `time` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ProductAllRawMaterials" DROP CONSTRAINT "ProductAllRawMaterials_product_id_fkey";

-- DropForeignKey
ALTER TABLE "ProductRawMaterial" DROP CONSTRAINT "ProductRawMaterial_product_id_fkey";

-- DropForeignKey
ALTER TABLE "ProductRawMaterial" DROP CONSTRAINT "ProductRawMaterial_raw_material_id_fkey";

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "time" TEXT NOT NULL;

-- DropTable
DROP TABLE "ProductAllRawMaterials";

-- DropTable
DROP TABLE "ProductRawMaterial";

-- CreateTable
CREATE TABLE "ProductRawMaterials" (
    "id" SERIAL NOT NULL,
    "raw_material_id" INTEGER NOT NULL,
    "product_id" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,

    CONSTRAINT "ProductRawMaterials_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ProductRawMaterials" ADD CONSTRAINT "ProductRawMaterials_raw_material_id_fkey" FOREIGN KEY ("raw_material_id") REFERENCES "RawMaterial"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductRawMaterials" ADD CONSTRAINT "ProductRawMaterials_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
