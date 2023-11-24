/*
  Warnings:

  - You are about to drop the column `money` on the `GameLog` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `GameLog` DROP COLUMN `money`,
    ADD COLUMN `money_bet` DOUBLE NULL;
