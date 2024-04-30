/*
  Warnings:

  - You are about to drop the column `quantity` on the `RecommendPlan` table. All the data in the column will be lost.
  - Added the required column `quantity` to the `Plans` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Plans" ADD COLUMN     "quantity" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "RecommendPlan" DROP COLUMN "quantity";
