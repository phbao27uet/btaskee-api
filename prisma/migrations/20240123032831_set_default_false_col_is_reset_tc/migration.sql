/*
  Warnings:

  - Made the column `is_reset_true_count` on table `Table` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `Table` MODIFY `is_reset_true_count` BOOLEAN NOT NULL DEFAULT false;
