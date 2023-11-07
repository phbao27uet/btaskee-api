/*
  Warnings:

  - You are about to drop the column `m_evolution_table_id` on the `Table` table. All the data in the column will be lost.
  - You are about to drop the `MEvolutionTable` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `MEvolutionTable` DROP FOREIGN KEY `MEvolutionTable_mWebsiteId_fkey`;

-- DropForeignKey
ALTER TABLE `Table` DROP FOREIGN KEY `Table_m_evolution_table_id_fkey`;

-- AlterTable
ALTER TABLE `Table` DROP COLUMN `m_evolution_table_id`,
    ADD COLUMN `evolution_table_id` INTEGER NULL;

-- DropTable
DROP TABLE `MEvolutionTable`;
