/*
  Warnings:

  - You are about to drop the column `eventsId` on the `promo` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `promo` DROP FOREIGN KEY `Promo_eventsId_fkey`;

-- AlterTable
ALTER TABLE `promo` DROP COLUMN `eventsId`;

-- CreateTable
CREATE TABLE `EventPromo` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `eventsId` INTEGER NOT NULL,
    `promoId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `EventPromo` ADD CONSTRAINT `EventPromo_eventsId_fkey` FOREIGN KEY (`eventsId`) REFERENCES `Events`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EventPromo` ADD CONSTRAINT `EventPromo_promoId_fkey` FOREIGN KEY (`promoId`) REFERENCES `Promo`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
