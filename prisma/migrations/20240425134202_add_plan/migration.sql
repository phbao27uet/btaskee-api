-- CreateEnum
CREATE TYPE "StatusPlan" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "TypePlan" AS ENUM ('MAINTENANCE', 'SHOPPING');

-- CreateTable
CREATE TABLE "Plans" (
    "id" SERIAL NOT NULL,
    "implemention_date" TIMESTAMP(3) NOT NULL,
    "petition_date" TIMESTAMP(3) NOT NULL,
    "description_plan" TEXT NOT NULL,
    "type" "TypePlan" NOT NULL,
    "status" "StatusPlan" NOT NULL,
    "evaluation" TEXT NOT NULL,
    "department_id" INTEGER,
    "user_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Plans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlanAsset" (
    "id" SERIAL NOT NULL,
    "plan_id" INTEGER NOT NULL,
    "asset_name" TEXT NOT NULL,
    "supplier_name" TEXT NOT NULL,
    "status" "StatusAsset" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PlanAsset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RecommendPlan" (
    "id" SERIAL NOT NULL,
    "implemention_date" TIMESTAMP(3) NOT NULL,
    "petition_date" TIMESTAMP(3) NOT NULL,
    "description_plan" TEXT NOT NULL,
    "type" "TypePlan" NOT NULL,
    "status" "StatusPlan" NOT NULL,
    "evaluation" TEXT NOT NULL,
    "user_id" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RecommendPlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RecommendPlanAsset" (
    "id" SERIAL NOT NULL,
    "recommed_plan_id" INTEGER NOT NULL,
    "asset_name" TEXT NOT NULL,
    "supplier_name" TEXT NOT NULL,
    "status" "StatusAsset" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RecommendPlanAsset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SpecialAsset" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "type_of_vehicle" TEXT NOT NULL,
    "purpose_use" TEXT NOT NULL,
    "status" "StatusPlan" NOT NULL,
    "car_manufacturer" TEXT NOT NULL,
    "manufacture_country" TEXT NOT NULL,
    "user_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SpecialAsset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LiquidationAsset" (
    "id" SERIAL NOT NULL,
    "implemention_date" TIMESTAMP(3) NOT NULL,
    "petition_date" TIMESTAMP(3) NOT NULL,
    "description_plan" TEXT NOT NULL,
    "type" "TypePlan" NOT NULL,
    "status" "StatusPlan" NOT NULL,
    "evaluation" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "original_price" INTEGER NOT NULL,
    "liquidation_price" INTEGER NOT NULL,
    "asset_purchasing_unit" TEXT NOT NULL,
    "user_id" INTEGER NOT NULL,
    "asset_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LiquidationAsset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BuidingRental" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "location_room" TEXT NOT NULL,
    "size_room" DOUBLE PRECISION NOT NULL,
    "renter_information" TEXT,
    "rental_date_start" TIMESTAMP(3) NOT NULL,
    "rental_date_end" TIMESTAMP(3) NOT NULL,
    "rental_price" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BuidingRental_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Plans" ADD CONSTRAINT "Plans_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "Department"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Plans" ADD CONSTRAINT "Plans_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlanAsset" ADD CONSTRAINT "PlanAsset_plan_id_fkey" FOREIGN KEY ("plan_id") REFERENCES "Plans"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecommendPlan" ADD CONSTRAINT "RecommendPlan_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecommendPlanAsset" ADD CONSTRAINT "RecommendPlanAsset_recommed_plan_id_fkey" FOREIGN KEY ("recommed_plan_id") REFERENCES "RecommendPlan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SpecialAsset" ADD CONSTRAINT "SpecialAsset_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LiquidationAsset" ADD CONSTRAINT "LiquidationAsset_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LiquidationAsset" ADD CONSTRAINT "LiquidationAsset_asset_id_fkey" FOREIGN KEY ("asset_id") REFERENCES "Asset"("id") ON DELETE CASCADE ON UPDATE CASCADE;
