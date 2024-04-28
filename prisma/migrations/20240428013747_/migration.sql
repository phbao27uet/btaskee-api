/*
  Warnings:

  - Made the column `department_id` on table `Plans` required. This step will fail if there are existing NULL values in that column.
  - Made the column `department_id` on table `RecommendPlan` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Plans" ALTER COLUMN "department_id" SET NOT NULL;

-- AlterTable
ALTER TABLE "RecommendPlan" ALTER COLUMN "department_id" SET NOT NULL;
