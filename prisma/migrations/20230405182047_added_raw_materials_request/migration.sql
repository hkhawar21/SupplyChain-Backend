/*
  Warnings:

  - Added the required column `requested` to the `RawMaterial` table without a default value. This is not possible if the table is not empty.
  - Added the required column `requestedStatus` to the `RawMaterial` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "RawMaterialStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- AlterTable
ALTER TABLE "RawMaterial" ADD COLUMN     "requested" INTEGER NOT NULL,
ADD COLUMN     "requestedStatus" "RawMaterialStatus" NOT NULL;
