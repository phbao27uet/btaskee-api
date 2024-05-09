/*
  Warnings:

  - Added the required column `order_payment_id` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PaypalOrderStatus" AS ENUM ('CREATED', 'SAVED', 'APPROVED', 'VOIDED', 'COMPLETED', 'PAYER_ACTION_REQUIRED');

-- CreateEnum
CREATE TYPE "Intent" AS ENUM ('CAPTURE', 'AUTHORIZE');

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "intent" "Intent" NOT NULL DEFAULT 'CAPTURE',
ADD COLUMN     "order_payment_id" TEXT NOT NULL,
ADD COLUMN     "status" "PaypalOrderStatus" NOT NULL DEFAULT 'CREATED';
