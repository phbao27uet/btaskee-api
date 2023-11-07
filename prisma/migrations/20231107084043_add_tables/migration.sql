-- CreateTable
CREATE TABLE `License` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `generated_code` VARCHAR(191) NOT NULL,
    `expiration_date` DATETIME(3) NOT NULL,
    `m_group_id` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `License_generated_code_key`(`generated_code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserLicense` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `license_id` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `UserLicense_user_id_license_id_key`(`user_id`, `license_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PlayerLog` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `play_count` INTEGER NOT NULL,
    `play_time` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `PlayerLog_user_id_key`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `GameLog` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `rtp_value` DOUBLE NOT NULL,
    `balance` DOUBLE NOT NULL,
    `money` DOUBLE NULL,
    `player_log_id` INTEGER NOT NULL,
    `table_id` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Table` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NULL,
    `true_count` DOUBLE NOT NULL,
    `running_count` DOUBLE NOT NULL,
    `m_evolution_table_id` INTEGER NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Table_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserTable` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `table_id` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `UserTable_user_id_table_id_key`(`user_id`, `table_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TrueCountSetting` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `true_count` DOUBLE NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MGroup` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` ENUM('A', 'B', 'C', 'D') NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `MGroup_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MWebsite` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` ENUM('steak', 'ELDOAH', 'Fortune', 'BC_game', 'Bit_Casino', 'Bonds_Casino', 'TED_BET') NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `MWebsite_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MEvolutionTable` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `table_id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `mWebsiteId` INTEGER NULL,

    UNIQUE INDEX `MEvolutionTable_table_id_name_key`(`table_id`, `name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `License` ADD CONSTRAINT `License_m_group_id_fkey` FOREIGN KEY (`m_group_id`) REFERENCES `MGroup`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserLicense` ADD CONSTRAINT `UserLicense_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserLicense` ADD CONSTRAINT `UserLicense_license_id_fkey` FOREIGN KEY (`license_id`) REFERENCES `License`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PlayerLog` ADD CONSTRAINT `PlayerLog_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GameLog` ADD CONSTRAINT `GameLog_player_log_id_fkey` FOREIGN KEY (`player_log_id`) REFERENCES `PlayerLog`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GameLog` ADD CONSTRAINT `GameLog_table_id_fkey` FOREIGN KEY (`table_id`) REFERENCES `Table`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Table` ADD CONSTRAINT `Table_m_evolution_table_id_fkey` FOREIGN KEY (`m_evolution_table_id`) REFERENCES `MEvolutionTable`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserTable` ADD CONSTRAINT `UserTable_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserTable` ADD CONSTRAINT `UserTable_table_id_fkey` FOREIGN KEY (`table_id`) REFERENCES `Table`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MEvolutionTable` ADD CONSTRAINT `MEvolutionTable_mWebsiteId_fkey` FOREIGN KEY (`mWebsiteId`) REFERENCES `MWebsite`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
