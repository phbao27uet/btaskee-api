/*
  Warnings:

  - You are about to alter the column `name` on the `MWebsite` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(1))` to `VarChar(191)`.

*/
-- AlterTable
ALTER TABLE `MWebsite` MODIFY `name` VARCHAR(191) NOT NULL;

-- CreateTable
CREATE TABLE `WebsiteTable` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `website_id` INTEGER NOT NULL,
    `table_id` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `WebsiteTable_website_id_table_id_key`(`website_id`, `table_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `WebsiteTable` ADD CONSTRAINT `WebsiteTable_website_id_fkey` FOREIGN KEY (`website_id`) REFERENCES `MWebsite`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `WebsiteTable` ADD CONSTRAINT `WebsiteTable_table_id_fkey` FOREIGN KEY (`table_id`) REFERENCES `Table`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
