/*
  Warnings:

  - You are about to drop the `AssetDepartment` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[email]` on the table `Supplier` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[username]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Asset" DROP CONSTRAINT "Asset_supplier_id_fkey";

-- DropForeignKey
ALTER TABLE "AssetDepartment" DROP CONSTRAINT "AssetDepartment_asset_id_fkey";

-- DropForeignKey
ALTER TABLE "AssetDepartment" DROP CONSTRAINT "AssetDepartment_department_id_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_department_id_fkey";

-- AlterTable
ALTER TABLE "Asset" ADD COLUMN     "department_id" INTEGER;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "username" TEXT,
ALTER COLUMN "password" DROP NOT NULL;

-- DropTable
DROP TABLE "AssetDepartment";

-- CreateIndex
CREATE UNIQUE INDEX "Supplier_email_key" ON "Supplier"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "Department"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Asset" ADD CONSTRAINT "Asset_supplier_id_fkey" FOREIGN KEY ("supplier_id") REFERENCES "Supplier"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Asset" ADD CONSTRAINT "Asset_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "Department"("id") ON DELETE CASCADE ON UPDATE CASCADE;
