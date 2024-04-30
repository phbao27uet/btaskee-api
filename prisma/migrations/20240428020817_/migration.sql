/*
  Warnings:

  - You are about to drop the column `plan_id` on the `PlanAsset` table. All the data in the column will be lost.
  - You are about to drop the column `recommed_plan_id` on the `RecommendPlanAsset` table. All the data in the column will be lost.
  - Added the required column `plan_asset_id` to the `Plans` table without a default value. This is not possible if the table is not empty.
  - Added the required column `recommend_plan_asset_id` to the `RecommendPlan` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "PlanAsset" DROP CONSTRAINT "PlanAsset_plan_id_fkey";

-- DropForeignKey
ALTER TABLE "RecommendPlanAsset" DROP CONSTRAINT "RecommendPlanAsset_recommed_plan_id_fkey";

-- AlterTable
ALTER TABLE "PlanAsset" DROP COLUMN "plan_id";

-- AlterTable
ALTER TABLE "Plans" ADD COLUMN     "plan_asset_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "RecommendPlan" ADD COLUMN     "recommend_plan_asset_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "RecommendPlanAsset" DROP COLUMN "recommed_plan_id";

-- AddForeignKey
ALTER TABLE "Plans" ADD CONSTRAINT "Plans_plan_asset_id_fkey" FOREIGN KEY ("plan_asset_id") REFERENCES "PlanAsset"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecommendPlan" ADD CONSTRAINT "RecommendPlan_recommend_plan_asset_id_fkey" FOREIGN KEY ("recommend_plan_asset_id") REFERENCES "RecommendPlanAsset"("id") ON DELETE CASCADE ON UPDATE CASCADE;
