/*
  Warnings:

  - You are about to drop the column `category_name` on the `Product` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_category_name_category_id_fkey";

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "category_name";

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
