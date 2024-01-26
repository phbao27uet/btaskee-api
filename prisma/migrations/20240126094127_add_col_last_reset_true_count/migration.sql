-- AlterTable
ALTER TABLE `Table` ADD COLUMN `is_reset_by_max_card` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `last_reset_true_count` DATETIME(3) NULL;
