/*
  Warnings:

  - Changed the type of `condition` on the `Asset` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `status` to the `Department` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "StatusDepartment" AS ENUM ('USED', 'READY_TO_USE', 'MAINTENANCE');

-- AlterTable
ALTER TABLE "Asset" DROP COLUMN "condition",
ADD COLUMN     "condition" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Department" ADD COLUMN     "status" "StatusDepartment" NOT NULL;
