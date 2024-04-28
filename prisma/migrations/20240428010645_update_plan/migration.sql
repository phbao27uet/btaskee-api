/*
  Warnings:

  - You are about to drop the column `supplier_name` on the `PlanAsset` table. All the data in the column will be lost.
  - You are about to drop the column `supplier_name` on the `RecommendPlanAsset` table. All the data in the column will be lost.
  - Added the required column `supplier_id` to the `PlanAsset` table without a default value. This is not possible if the table is not empty.
  - Added the required column `department_id` to the `RecommendPlan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `supplier_id` to the `RecommendPlanAsset` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PlanAsset" DROP COLUMN "supplier_name",
ADD COLUMN     "supplier_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Plans" ALTER COLUMN "status" DROP NOT NULL,
ALTER COLUMN "evaluation" DROP NOT NULL;

-- AlterTable
ALTER TABLE "RecommendPlan" ADD COLUMN     "department_id" INTEGER NOT NULL,
ALTER COLUMN "status" DROP NOT NULL,
ALTER COLUMN "evaluation" DROP NOT NULL;

-- AlterTable
ALTER TABLE "RecommendPlanAsset" DROP COLUMN "supplier_name",
ADD COLUMN     "supplier_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "PlanAsset" ADD CONSTRAINT "PlanAsset_supplier_id_fkey" FOREIGN KEY ("supplier_id") REFERENCES "Supplier"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecommendPlan" ADD CONSTRAINT "RecommendPlan_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "Department"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecommendPlanAsset" ADD CONSTRAINT "RecommendPlanAsset_supplier_id_fkey" FOREIGN KEY ("supplier_id") REFERENCES "Supplier"("id") ON DELETE CASCADE ON UPDATE CASCADE;
