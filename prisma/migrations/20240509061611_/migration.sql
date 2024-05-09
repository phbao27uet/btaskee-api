/*
  Warnings:

  - Added the required column `order_link` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "order_link" TEXT NOT NULL;
