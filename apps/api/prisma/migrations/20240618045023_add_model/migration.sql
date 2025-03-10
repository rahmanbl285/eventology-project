-- CreateTable
CREATE TABLE `samples` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `code` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `samples_code_key`(`code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `username` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `image` LONGTEXT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT false,
    `isOrganizer` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Users_username_key`(`username`),
    UNIQUE INDEX `Users_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Referral` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `usersId` INTEGER NOT NULL,
    `myReferralCode` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Referral_usersId_key`(`usersId`),
    UNIQUE INDEX `Referral_myReferralCode_key`(`myReferralCode`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Points` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `amount` INTEGER NOT NULL,
    `expiredPoints` DATETIME(3) NOT NULL,
    `usersId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Discounts` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `discount` INTEGER NOT NULL,
    `expiredDiscount` DATETIME(3) NOT NULL,
    `usersId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Events` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `usersId` INTEGER NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `startDate` DATETIME(3) NOT NULL,
    `endDate` DATETIME(3) NOT NULL,
    `image` LONGTEXT NOT NULL,
    `description` LONGTEXT NOT NULL,
    `slug` VARCHAR(191) NULL,
    `address` VARCHAR(191) NOT NULL,
    `city` VARCHAR(191) NOT NULL,
    `latitude` DOUBLE NOT NULL,
    `longitude` DOUBLE NOT NULL,
    `category` ENUM('Festival', 'Konser', 'Pertandingan', 'Pameran', 'Konferensi', 'Workshop', 'Pertunjukan', 'Seminar') NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Promo` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `eventsId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PromoItems` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `promoId` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `discount` INTEGER NOT NULL,
    `startDate` DATETIME(3) NOT NULL,
    `endDate` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Tickets` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `eventsId` INTEGER NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `isPaid` BOOLEAN NOT NULL DEFAULT false,
    `availableSeat` INTEGER NOT NULL,
    `price` INTEGER NOT NULL,
    `startSaleDate` DATETIME(3) NOT NULL,
    `endSaleDate` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Transaction` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `eventId` INTEGER NOT NULL,
    `discountId` INTEGER NOT NULL,
    `pointsId` INTEGER NOT NULL,
    `promoId` INTEGER NOT NULL,
    `quantity` INTEGER NOT NULL,
    `usedDiscount` INTEGER NOT NULL,
    `usedPoint` INTEGER NOT NULL,
    `total` INTEGER NOT NULL,
    `grandTotal` INTEGER NOT NULL,
    `status` ENUM('waitingPayment', 'waitingConfirmation', 'paid', 'cancelled', 'declined') NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Referral` ADD CONSTRAINT `Referral_usersId_fkey` FOREIGN KEY (`usersId`) REFERENCES `Users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Points` ADD CONSTRAINT `Points_usersId_fkey` FOREIGN KEY (`usersId`) REFERENCES `Users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Discounts` ADD CONSTRAINT `Discounts_usersId_fkey` FOREIGN KEY (`usersId`) REFERENCES `Users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Events` ADD CONSTRAINT `Events_usersId_fkey` FOREIGN KEY (`usersId`) REFERENCES `Users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Promo` ADD CONSTRAINT `Promo_eventsId_fkey` FOREIGN KEY (`eventsId`) REFERENCES `Events`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PromoItems` ADD CONSTRAINT `PromoItems_promoId_fkey` FOREIGN KEY (`promoId`) REFERENCES `Promo`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Tickets` ADD CONSTRAINT `Tickets_eventsId_fkey` FOREIGN KEY (`eventsId`) REFERENCES `Events`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Transaction` ADD CONSTRAINT `Transaction_eventId_fkey` FOREIGN KEY (`eventId`) REFERENCES `Events`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Transaction` ADD CONSTRAINT `Transaction_discountId_fkey` FOREIGN KEY (`discountId`) REFERENCES `Discounts`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Transaction` ADD CONSTRAINT `Transaction_pointsId_fkey` FOREIGN KEY (`pointsId`) REFERENCES `Points`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Transaction` ADD CONSTRAINT `Transaction_promoId_fkey` FOREIGN KEY (`promoId`) REFERENCES `Promo`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
