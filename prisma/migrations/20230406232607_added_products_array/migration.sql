/*
  Warnings:

  - You are about to drop the column `product_id` on the `Inventory` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Inventory" DROP CONSTRAINT "Inventory_product_id_fkey";

-- AlterTable
ALTER TABLE "Inventory" DROP COLUMN "product_id";

-- CreateTable
CREATE TABLE "_InventoryToProduct" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_InventoryToProduct_AB_unique" ON "_InventoryToProduct"("A", "B");

-- CreateIndex
CREATE INDEX "_InventoryToProduct_B_index" ON "_InventoryToProduct"("B");

-- AddForeignKey
ALTER TABLE "_InventoryToProduct" ADD CONSTRAINT "_InventoryToProduct_A_fkey" FOREIGN KEY ("A") REFERENCES "Inventory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_InventoryToProduct" ADD CONSTRAINT "_InventoryToProduct_B_fkey" FOREIGN KEY ("B") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
