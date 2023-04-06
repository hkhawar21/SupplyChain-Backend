/*
  Warnings:

  - Added the required column `presentInInventory` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `presentInInventory` to the `RawMaterial` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "presentInInventory" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "RawMaterial" ADD COLUMN     "presentInInventory" INTEGER NOT NULL;
