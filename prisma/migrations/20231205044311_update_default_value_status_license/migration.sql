-- AlterTable
ALTER TABLE `License` MODIFY `status` ENUM('ACTIVE', 'INACTIVE') NOT NULL DEFAULT 'INACTIVE';