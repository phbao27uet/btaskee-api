/*
  Warnings:

  - Added the required column `depreciation_rate` to the `Asset` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Asset" ADD COLUMN     "depreciation_rate" DOUBLE PRECISION NOT NULL;
