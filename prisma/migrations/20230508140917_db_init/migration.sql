/*
  Warnings:

  - The `role` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `Vendor` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterEnum
ALTER TYPE "RawMaterialStatus" ADD VALUE 'WAITING';

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "accessRoles" "AccessRole"[],
DROP COLUMN "role",
ADD COLUMN     "role" TEXT[] DEFAULT ARRAY['admin']::TEXT[];

-- DropTable
DROP TABLE "Vendor";
