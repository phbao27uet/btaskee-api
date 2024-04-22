/*
  Warnings:

  - Added the required column `condition` to the `Asset` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `Asset` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "StatusAsset" AS ENUM ('USED', 'READY_TO_USE', 'MAINTENANCE');

-- CreateEnum
CREATE TYPE "ConditionAsset" AS ENUM ('GOOD', 'BAD', 'BROKEN');

-- AlterTable
ALTER TABLE "Asset" ADD COLUMN     "condition" "ConditionAsset" NOT NULL,
ADD COLUMN     "status" "StatusAsset" NOT NULL;
