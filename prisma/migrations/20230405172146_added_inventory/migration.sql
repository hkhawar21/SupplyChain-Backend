/*
  Warnings:

  - The values [pending,processing,delivered,cancelled] on the enum `OrderStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `raw_material_id` on the `Inventory` table. All the data in the column will be lost.
  - You are about to drop the `Raw_Material` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ProductToRaw_Material` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "OrderStatus_new" AS ENUM ('PENDING', 'PROCESSING', 'DELIVERED', 'CANCELLED');
ALTER TABLE "Order" ALTER COLUMN "status" TYPE "OrderStatus_new" USING ("status"::text::"OrderStatus_new");
ALTER TYPE "OrderStatus" RENAME TO "OrderStatus_old";
ALTER TYPE "OrderStatus_new" RENAME TO "OrderStatus";
DROP TYPE "OrderStatus_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "Inventory" DROP CONSTRAINT "Inventory_raw_material_id_fkey";

-- DropForeignKey
ALTER TABLE "_ProductToRaw_Material" DROP CONSTRAINT "_ProductToRaw_Material_A_fkey";

-- DropForeignKey
ALTER TABLE "_ProductToRaw_Material" DROP CONSTRAINT "_ProductToRaw_Material_B_fkey";

-- AlterTable
ALTER TABLE "Inventory" DROP COLUMN "raw_material_id";

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "inventory_id" INTEGER NOT NULL DEFAULT 0;

-- DropTable
DROP TABLE "Raw_Material";

-- DropTable
DROP TABLE "_ProductToRaw_Material";

-- CreateTable
CREATE TABLE "ProductRawMaterials" (
    "id" SERIAL NOT NULL,
    "product_id" INTEGER NOT NULL,

    CONSTRAINT "ProductRawMaterials_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RawMaterial" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "status" BOOLEAN NOT NULL,
    "inventory_id" INTEGER NOT NULL,

    CONSTRAINT "RawMaterial_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ProductRawMaterialsToRawMaterial" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ProductRawMaterialsToRawMaterial_AB_unique" ON "_ProductRawMaterialsToRawMaterial"("A", "B");

-- CreateIndex
CREATE INDEX "_ProductRawMaterialsToRawMaterial_B_index" ON "_ProductRawMaterialsToRawMaterial"("B");

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_inventory_id_fkey" FOREIGN KEY ("inventory_id") REFERENCES "Inventory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductRawMaterials" ADD CONSTRAINT "ProductRawMaterials_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RawMaterial" ADD CONSTRAINT "RawMaterial_inventory_id_fkey" FOREIGN KEY ("inventory_id") REFERENCES "Inventory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductRawMaterialsToRawMaterial" ADD CONSTRAINT "_ProductRawMaterialsToRawMaterial_A_fkey" FOREIGN KEY ("A") REFERENCES "ProductRawMaterials"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductRawMaterialsToRawMaterial" ADD CONSTRAINT "_ProductRawMaterialsToRawMaterial_B_fkey" FOREIGN KEY ("B") REFERENCES "RawMaterial"("id") ON DELETE CASCADE ON UPDATE CASCADE;
