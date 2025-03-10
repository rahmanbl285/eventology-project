-- DropForeignKey
ALTER TABLE `transaction` DROP FOREIGN KEY `Transaction_discountId_fkey`;

-- DropForeignKey
ALTER TABLE `transaction` DROP FOREIGN KEY `Transaction_pointsId_fkey`;

-- DropForeignKey
ALTER TABLE `transaction` DROP FOREIGN KEY `Transaction_promoId_fkey`;

-- DropIndex
DROP INDEX `Events_slug_key` ON `events`;

-- AlterTable
ALTER TABLE `transaction` MODIFY `discountId` INTEGER NULL,
    MODIFY `pointsId` INTEGER NULL,
    MODIFY `promoId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Transaction` ADD CONSTRAINT `Transaction_discountId_fkey` FOREIGN KEY (`discountId`) REFERENCES `Discounts`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Transaction` ADD CONSTRAINT `Transaction_pointsId_fkey` FOREIGN KEY (`pointsId`) REFERENCES `Points`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Transaction` ADD CONSTRAINT `Transaction_promoId_fkey` FOREIGN KEY (`promoId`) REFERENCES `Promo`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
