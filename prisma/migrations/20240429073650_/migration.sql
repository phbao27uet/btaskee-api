-- AlterTable
ALTER TABLE "LiquidationAsset" ALTER COLUMN "user_id" DROP NOT NULL,
ALTER COLUMN "asset_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "SpecialAsset" ALTER COLUMN "user_id" DROP NOT NULL;
